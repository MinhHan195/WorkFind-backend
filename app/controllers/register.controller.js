require('dotenv').config();

const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const AccountService = require("../services/account.service");

const UserService = require("../services/user.service");
const CompanyService = require("../services/company.service");

const sendMail = require("../helpers/send.mail");

const bcrypt = require("bcrypt");
const { addMinutes, isAfter } = require("date-fns");
const Joi = require("../validation/user.validate");

exports.create = async (req, res, next) => {
    try {
        // B1: Validate phia sever
        if (req.body.role === "user") {
            const { value, error } = Joi.registerUserValidate.validate(req.body);
            if (error) {
                return next(new ApiError(400, error.details[0].message));
            }
        } else if (req.body.role === "company") {
            const { value, error } = Joi.registerCompanyValidate.validate(req.body);
            if (error) {
                return next(new ApiError(400, error.details[0].message));
            }
        } else {
            return next(new ApiError(403, "Loi khong the tạo tai khoan"));
        }

        // B2: Kiem tra tai khoan co ton tai khong
        const accountService = new AccountService(MongoDB.client);
        const result = await accountService.findByEmail(req.body.email);
        if (result) {
            return next(new ApiError(409, "Email đã tồn tại"))
        }

        // B3: Tạo mã kích hoạt tài khoản
        const token = await bcrypt.hash(req.body.email, 5);

        // B4: Tạo tài khoản với mã kích hoạt
        const document = await accountService.create(req.body, token);

        if (document.acknowledged) {
            // B5: Tạo record lưu thông tin khác của user tài khoản
            if (req.body.role === "user") {
                const userService = new UserService(MongoDB.client);
                await userService.create(req.body, document.insertedId);
            } else if (req.body.role === "company") {
                const companyService = new CompanyService(MongoDB.client);
                await companyService.create(req.body, document.insertedId);
            }

            // B6: Gửi mail kích hoạt tài khoảng
            await sendMail({
                email: req.body.email,
                subject: "KÍCH HOẠT TÀI KHOẢN",
                html: `
                    <h1> Cảm ơn bạn đã đăng ký tài khoản </h1>
                    <a href="${process.env.URL_FRONTEND}/auth/login?token=${token}&id=${document.insertedId}">
                    Vui lòng click vào đây để kích hoạt tài khoản
                    </a>
                `
            })

            // B7: Thông báo cho người dùng tại tài khoảng thành công
            return res.send({
                result: true,
                message: "Tạo tài khoản thành công"
            });
        }
        return res.send({
            result: false,
            message: "Tạo tài khoản không thành công"
        });


    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "Co loi trong khi tao tai khoan")
        );
    }
};

exports.verify = async (req, res, next) => {
    const queryParams = req.query;
    const token = queryParams.token;
    const id = queryParams.id;
    const accountService = new AccountService(MongoDB.client);
    try {
        const account = await accountService.findById(id);
        if (!account) {
            return next(new ApiError(409, `Không tìm thấy tài khoản`));
        }
        const timeCreated = addMinutes(account.dateTimeCreate, 10);
        if (account.activeStatus) {
            return next(new ApiError(410, "Tài khoản đã được kích hoạt trước đó"));
        }
        if (isAfter(new Date().toLocaleString(), timeCreated)) {
            if (account.role === "user") {
                const userService = new UserService(MongoDB.client);
                await userService.deleteUser(id);
            } else if (account.role === "company") {
                const companyService = new CompanyService(MongoDB.client);
                await companyService.deleteCompany(id);
            }
            await accountService.deleteAccount(id);
            return next(new ApiError(403, "Tài khoản đã hết thời hạn kích hoạt, vui lòng tạo tài khoản khác!"));
        }
        else if (token === account.token) {
            await accountService.activateAccount(id);
            return res.send({
                message: "Tài khoản đã được kích hoạt thành công!",
                result: true
            });
        }
        return next(new ApiError(422, "Token không hợp lệ"));
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error activate account with id=${req.params.id}`)
        );
    }


}