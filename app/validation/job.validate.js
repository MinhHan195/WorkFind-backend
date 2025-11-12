const { min } = require('date-fns');
const Joi = require('joi');

exports.jobValidate = Joi.object({
    nameCompany: Joi.string().min(10).max((100)).required(),
    totalEmployees: Joi.string().required(),
    websiteLink: Joi.string().required(),
    companyDescription: Joi.string(),
    jobName: Joi.string().required(),
    province: Joi.string().required(),
    provinceContact: Joi.string().required(),
    district: Joi.string().required(),
    districtContact: Joi.string().required(),
    ward: Joi.string().required(),
    wardContact: Joi.string().required(),
    salary: Joi.string(),
    jobDescription: Joi.string().required(),
    educationLevel: Joi.string().required(),
    experienceLevel: Joi.string().required(),
    careerLevel: Joi.string().required(),
    positionType: Joi.string().required(),
    gender: Joi.required(),
    typeJob: Joi.string().required(),
    addressContact: Joi.string().required(),
    staffName: Joi.string().min(3).max(30).required(),
    phone:Joi.string().pattern(/^0[35789][0-9]{8}$/),
    jobRequirements: Joi.string().required(),
    maxSalary: Joi.number().min(0).max(10000),
    minSalary: Joi.number().min(0).max(10000),
    status: Joi.string().required(),

})