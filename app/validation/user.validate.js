const Joi = require('joi');

exports.signInValidate = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().min(6).max(30).required(),
})

exports.registerValidate = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("company", "user").required(),
    password:Joi.string().min(6).max(30).required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password")) // Kiểm tra confirmPassword phải giống password
        .required()
        .messages({ "ConfirmPassword": "Mật khẩu xác nhận không khớp!" }),
})