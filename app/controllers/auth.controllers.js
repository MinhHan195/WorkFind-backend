const ApiError = require("../api-error");
const Joi = require("../validation/user.validate");
const AccountService = require("../services/account.service");
const UserService = require("../services/user.service");
const CompanyService = require("../services/company.service");
const MongoDB = require("../utils/mongodb.util");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

exports.logIn = async (req, res, next) => {
    try {
        // B1: Validate phía server
        const { value, error } = Joi.signInValidate.validate(req.body);
        if (error) {
            return next(new ApiError(400, error.details[0].message));
        }
        // B2: Kiểm tra email tồn tại hay chưa
        const accountService = new AccountService(MongoDB.client);
        const account = await accountService.findByEmail(req.body.email);
        if (!account) {
            return next(new ApiError(404, "Không tìm thấy tài khoản"));
        }
        else if (!account.activeStatus) {
            return next(new ApiError(403, "Tài khoản chưa được kích hoạt"));
        }

        // B3: Kiểm tra password
        const isMatch = await bcrypt.compare(req.body.password, account.password);

        if (!isMatch) {
            return next(new ApiError(400, "Mật khẩu không chính xác"));
        }

        // B4: Tạo JWT
        const JWTtoken = jwt.sign({ _id: account._id }, process.env.SECRET_CODE);
        console.log(JWTtoken);
        // B5: Lưu JWT vào cookie
        res.cookie("JWT", JWTtoken, {
            httpOnly: true,  // Ngăn JavaScript truy cập cookie (bảo vệ XSS)
            secure: false,   // Đặt `true` nếu chạy HTTPS
            sameSite: "Strict", // Chống CSRF
            maxAge: 3600000, // 1 giờ
        });

        // B5: Lấy thông tin người dùng
        const userService = new UserService(MongoDB.client);
        const user = await userService.findByAccountId(account._id);
        user.role = account.role
        // B6: Trả ra thông báo cho người dùng
        user.dateTimeCreate = account.dateTimeCreate,
            user.dateTimeUpdate = account.dateTimeUpdate,
            account.password = undefined;
        return res.send({
            result: true,
            message: "Đăng nhập thành công",
            user: user,
        });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Có lỗi trong quá trình đăng nhập"))
    }
}

exports.checkLogin = async (req, res, next) => {
    // B1: Kiểm tra xem header có token hay không
    const token = req.cookies.JWT;
    if (!token) {
        return res.send({ logged: false });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_CODE);
        const accountService = new AccountService(MongoDB.client);
        const user = await accountService.findById(decoded._id);
        if (!user) {
            return res.send({ logged: false });
        }
        return res.send({ logged: true });
    } catch (error) {
        console.log(error)
        return res.send({ logged: false });
    }
}

exports.getUserData = async (req, res, next) => {
    try {
        // Lấy account từ id đc kiểm từ middleware
        const accountService = new AccountService(MongoDB.client);
        const account = await accountService.findById(req.user._id);
        if (!account) {
            return next(new ApiError(404, "User not found"));
        }
        var result;
        // Kiểm tra role để gọi hàm phù hợp
        if (account.role === "user") {
            const userService = new UserService(MongoDB.client);
            result = await userService.findByAccountId(account._id);
        } else if (account.role === "company") {
            const companyService = new CompanyService(MongoDB.client);
            result = await companyService.findByAccountId(account._id);
        }

        if (result.length === 0) {
            return next(new ApiError(404, "User not found"));
        }
        // console.log(result);
        return res.send(result);

    } catch (error) {
        console.log("Loi: ", error);
        return next(new ApiError(500, "Somthing wrong when check account sign in"));
    }

}