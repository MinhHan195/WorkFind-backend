require('dotenv').config();

const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const AccountService = require("../services/account.service");

const UserService = require("../services/user.service");
const CompanyService = require("../services/company.service");

const sendMail = require("../helpers/send.mail");

const bcrypt = require("bcrypt");
const {addMinutes, isAfter} = require("date-fns");

exports.create = async (req, res, next) => {
    if(!req.body?.name) {
        return next(new ApiError(400, "Ten tai khoang khong the trong"));
    }
    try{
        const token = await bcrypt.hash(req.body.email, 5);
        const accountService = new AccountService(MongoDB.client);
        const result = await accountService.findByEmail(req.body.email);
        if(result){
            return res.send({message: "Tim tai khoan nguoi dung"});
        }
        const document = await accountService.create(req.body, token);
        if(req.body.role==="user"){
            const userService = new UserService(MongoDB.client);
            await userService.create(req.body, document.insertedId);
        }else if(req.body.role==="company"){
            const companyService = new CompanyService(MongoDB.client);
            await companyService.create(req.body, document.insertedId);
        }
        console.log(document);
        
        await sendMail({
            email: req.body.email,
            subject: "KÍCH HOẠT TÀI KHOẢN",
            html: `
                <h1> Cảm ơn bạn đã đăng ký tài khoản </h1>
                <a href="${process.env.URL}/api/accounts/verify?token=${token}&id=${document.insertedId}">
                Vui lòng click vào đây để kích hoạt tài khoản
                </a>
            `
        })
        return res.send(document);
    }catch(error) {
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
    try{
        const account = await accountService.findById(id);
        if(!account) {
            return next(new ApiError(404, `Account not found`));
        }
        console.log(account.dateTimeCreate);
        const timeCreated = addMinutes(account.dateTimeCreate, 1);
        console.log(timeCreated);
        if(account.activeStatus) {
            return res.send({message: "Tài khoản đã được kích hoạt trước đó"});
        }
        if(isAfter(new Date().toLocaleString(), timeCreated)){
            if(account.role==="user"){
                const userService = new UserService(MongoDB.client);
                await userService.deleteUser(id);
            }else if(account.role==="company"){
                const companyService = new CompanyService(MongoDB.client);
                await companyService.deleteCompany(id);
            }
            await accountService.deleteAccount(id);
            return res.send({message: "Tài khoản đã hết thời hạn kích hoạt, vui lòng tạo tài khoản khác!"});
        }
        else if(token === account.token){
            await accountService.activateAccount(id);
            return res.send({message: "Tài khoản đã được kích hoạt thành công!"});
        }
        return  next(new ApiError(422,"Token không hợp lệ"));
    }catch(error) {
        console.log(error);
        return next(
            new ApiError(500, `Error activate account with id=${req.params.id}`)
        );
    }
    

}