const Joi = require('joi');

exports.signInValidate = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().min(6).max(30).required(),
})

exports.registerUserValidate = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("company", "user").required(),
    password:Joi.string().min(6).max(30).required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password")) // Kiểm tra confirmPassword phải giống password
        .required()
        .messages({ "ConfirmPassword": "Mật khẩu xác nhận không khớp!" }),
})

exports.registerCompanyValidate = Joi.object({
    nameCompany: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    address: Joi.string().min(3).max(100).required(),
    province: Joi.string().max(20).required(),
    district: Joi.string().max(20).required(),
    phone: Joi.string().pattern(/^0[35789][0-9]{8}$/),
    password: Joi.string().min(6).max(30).required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password")) // Kiểm tra confirmPassword phải giống password
        .required()
        .messages({ "ConfirmPassword": "Mật khẩu xác nhận không khớp!" }),
    totalEmployees: Joi.number().required(),
    description: Joi.string().required(),
    role: Joi.string().valid("company", "user").required(),
})

exports.passwordValidate = Joi.object({
    oldPassword: Joi.string().min(6).max(30).required(),
    newPassword: Joi.string().min(6).max(30).required(),
    confirmNewPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({"any.only": "Mật khẩu xác nhận không khớp!"}),
})

exports.forgotPasswordValidate = Joi.object({
    userId: Joi.string().required(),
    newPassword: Joi.string().min(6).max(30).required(),
    confirmNewPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({ 'any.only': 'Xác nhận mật khẩu không khớp' }),
})