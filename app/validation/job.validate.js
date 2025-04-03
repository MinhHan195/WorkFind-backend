const Joi = require('joi');

exports.jobValidate = Joi.object({
    nameCompany: Joi.string().min(10).max((100)).required(),
    staffNumber: Joi.number().required(),
    urlWebSite: Joi.string().required(),
    companyDescription: Joi.string(),
    jobName: Joi.string().required(),
    province: Joi.string().required(),
    district: Joi.string().required(),
    salary: Joi.string().required(),
    jobDescription: Joi.string().required(),
    benefits: Joi.string(),
    educationLevel: Joi.string().required(),
    experienceLevel: Joi.string().required(),
    careerLevel: Joi.string().required(),
    positionType: Joi.string().required(),
    gender: Joi.required(),
    jobType: Joi.string().required(),
    addressContact: Joi.string().required(),
    staffName: Joi.string().min(3).max(30).required(),
    phone:Joi.string().pattern(/^0[35789][0-9]{8}$/),
    attention: Joi.string(),
})