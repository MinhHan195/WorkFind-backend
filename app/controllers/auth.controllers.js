const ApiError = require("../api-error");
const Joi = require("../validation/user.validate");
const AccountService = require("../services/account.service");
const MongoDB = require("../utils/mongodb.util");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

exports.signIn = async (req, res, next) => {
    try {
        // B1: Validate phía server
        const {value, error} = Joi.signInValidate.validate(req.body);
        if(error){
            return next(new ApiError(400,error.details[0].message));
        }
        // B2: Kiểm tra email tồn tại hay chưa
        const accountService = new AccountService(MongoDB.client);
        const account = await accountService.findByEmail(req.body.email);
        if(!account){
            return res.send({message: "Khong tim thay account"});
        }
        else if(!account.activeStatus){
            return res.send({message: "Tai khoan chua duoc kich hoat"});
        }
        
        // B3: Kiểm tra password
        const isMatch = bcrypt.compare(req.body.password, account.password);
        if(!isMatch){
            return next(new ApiError(400,"Mat khau khong dung"));
        }

        // B4: Tạo JWS
        const JWtoken = jwt.sign({ _id: account._id }, process.env.SECRET_CODE);
        // B5: Trả ra thông báo cho người dùng
        account.password = undefined;
        return res.send({
            message: "Dang nhap thanh cong",
            user: account,
            JWT: JWtoken,
        });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Có lỗi trong quá trình đăng nhập"))
    }
}