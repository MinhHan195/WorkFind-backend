const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const AccountService = require("../services/account.service");
const bcrypt = require("bcrypt");
const Joi = require("../validation/user.validate");
const sendMail = require("../helpers/send.mail");
const UserService = require("../services/user.service");
const CompanyService = require("../services/company.service");


exports.changePassword = async (req, res, next) => {
    try {
        // B1: verify token o middleware
        console.log(req.user);
        // B2: Validate mat khau
        const {value, error} = Joi.passwordValidate.validate(req.body);
        if(error) {
            return next(new ApiError(400, error.details[0].message));
        }
        // B3: Kiem tra mat khau cu
        const accountService = new AccountService(MongoDB.client);
        const account = await accountService.findById(req.user._id);
        const isMatch = await bcrypt.compare(req.body.oldPassword, account.password);
        if(!isMatch){
            return next(new ApiError(400,"Mat khau hien tai khong dung"));
        }
        // B4: doi mat khau
        const result = await accountService.changePassword(req.user._id, req.body.newPassword);
        if(!result) {
            return next(new ApiError(404,"Account not found"));
        }

        return res.send(result);
        // B5: thong bao
    } catch (error) {
        console.log(error);
        return next(new ApiError(500,"Something wrong when changing the password"));
    }
}

exports.reset = async (req, res, next) => {
    const result = await accountService.changePassword(req.query.id, req.body.newPassword);
    if(!result) {
        return next(new ApiError(404,"Account not found"));
    }

    return res.send(result);
}

exports.sendRequest = async (req,res,next) => {
    // B1: Lấy id của tài khoảng bằng email
    const email = req.body.email;
    const accountService = new AccountService(MongoDB.client);
    const account = await accountService.findByEmail(email);
    const id = account._id;
    // B2: Gửi mail kèm theo id để xác nhận
    await sendMail({
        email: email,
        subject: "THAY ĐỔI MẬT KHẨU TÀI KHOẢN",
        html: `
            <p> Bạn đã sử dụng lệnh "Thiết lập lại mật khẩu" cho tài khoản của bạn trên WorkFind. 
            Để hoàn thành yêu cầu này, vui lòng nhấn đường link bên dưới. </p>
            <a href="${process.env.URL}/api/accounts/reset/reset_request?id=${id}">
            Vui lòng click vào đây để thay đổi mật khẩu
            </a>
        `
    });

    return res.send({message: "Send mail successfuly"});
    
}

exports.resetPassword = async (req,res,next) => {
    
    try {
        // B1: validate data
        const {value, error} = Joi.forgotPasswordValidate.validate(req.body);
        if(error){
            return next(new ApiError(400, error.details[0].message));
        }
        // B2: Doi password
        const accountService = new AccountService(MongoDB.client);
        const result = await accountService.changePassword(req.body.userId, req.body.newPassword);
        if(!result) {
            return next(new ApiError(404,"Account not found"));
        }
        // B3: Thong bao
        return res.send({
            message: "Change password successfuly",
            result
        });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500,"Something wrong when changing password"));
    }
}

exports.getUserId = async (req, res, next) => {
    return res.send({id: req.query.id});
}

exports.delete = async (req, res, next) => {
    try {
        // B1: verify JWT
        if(req.params.id!==req.user._id){
            return next(new ApiError(400,"Access denied"))
        }
        // B2: Lấy thông tin về role của account 
        const accountService = new AccountService(MongoDB.client);
        const account = await accountService.findById(req.user._id);
        // B3: Xóa các thông tin liên quan về tài khoảng
        if(account.role==="user"){
            const userService = new UserService(MongoDB.client);
            await userService.deleteByAccountId(req.user._id);
        }else if (account.role==="company"){
            const companyService = new CompanyService(MongoDB.client);
            await companyService.deleteByAccountId(req.user._id);
        }
        // B4: Xóa tài khoảng
        const result = await accountService.deleteAccount(req.user._id);
        return res.send({
            message: "Delete account successfuly",
            result
        });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500,"Something wrong when deleting account"));
    }
}                                                               