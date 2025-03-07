const Joi = require("../validation/job.validate");
const ApiError = require("../api-error");
const JobService = require("../services/job.service");
const MongoDB = require("../utils/mongodb.util");
const AccountService = require("../services/account.service");


exports.create = async (req, res, next) => {
    try{
        // B1: kiem tra token trong MiddleWare và kiểm tra id
        const id = req.user._id;
        const accountService = new AccountService(MongoDB.client);
        const result =  await accountService.findById(id);
        if(!result || result.role!=="company"){
            return next(new ApiError(403, "Tài khoản không hợp lệ"))
        }
        // B2: validate thong tin
        const {value, error} = Joi.jobValidate.validate(req.body);
        if(error){
            return next(new ApiError(400,error.details[0].message));
        }
        
        // B3: tao job len trang
        const jobService = new JobService(MongoDB.client);
        const document = await jobService.create(req.body, id);
        // B4: thong bao cho nguoi dung
        return res.send({ document });
    }catch(error){
        console.log(error);
        return next(new ApiError(500,"Có lỗi trong quá trình đăng bài"));
    }
}

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const jobService = new JobService(MongoDB.client);
        const document = await jobService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(400, "Job not found"));
        }
        return res.send({message: "Jobs update successfuly"});
    } catch (error) {
        console.log(error);
        return next(new ApiError(500,"Something wrong when updating job"));
    }
}

exports.findOne = async (req, res, next) => {
    try {
        const jobService = new JobService(MongoDB.client);
        const document = await jobService.findById(req.params.id);
        if(!document){
            return next(new ApiError(404, "Job not found"));
        }
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving job with id=${req.params.id}`)
        );
    }
}

exports.findByUserId = async (req, res, next) => {
    try {
        const jobService = new JobService(MongoDB.client);
        const document = await jobService.findByUserId(req.params.userId);
        if(document.length==0){
            return next(new ApiError(404, "Job from user not found"));
        }
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving job with id=${req.params.userId}`)
        );
    }
}

exports.getTotalByUserId = async (req, res, next) => {
    try {
        const jobService = new JobService(MongoDB.client);
        const count = await jobService.countTotal(req.params.userId);
        if(!count){
            return next(new ApiError(404, "Job from user not found"));
        }
        return res.send({total: count});
    }catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error getting job total with id=${req.params.userId}`)
        );
    }
}

exports.findByFilter = async (req, res, next) => {
    try {
        const jobService = new JobService(MongoDB.client);
        const document = await jobService.findByFilter(req.query);
        if(document.length==0){
            return next(new ApiError(404, "Job not found"));
        }
        console.log(document);
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error getting job`)
        );
    }
}

exports.findByKey = async (req, res, next) => {
    try {
        const jobService = new JobService(MongoDB.client);
        const document = await jobService.findByKey(req.params.key);
        if(document.length==0){
            return next(new ApiError(404, "Job not found"));
        }
        console.log(document);
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error getting job`)
        );
    }
}

exports.findByProvince = async (req, res, next) => {
    try {
        const jobService = new JobService(MongoDB.client);
        const document = await jobService.findByProvince(req.params.province);
        if(document.length==0){
            return next(new ApiError(404, "Job not found"));
        }
        console.log(document);
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error getting job`)
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        // B1: Kiểm tra id trả về sau khi verify token 
        const userId = req.user._id;
        const accountService = new AccountService(MongoDB.client);
        const account =  await accountService.findById(userId);
        if(!account || account.role!=="company"){
            return next(new ApiError(403, "Tài khoản không hợp lệ"))
        };
        // B2: Xóa
        const jobService = new JobService(MongoDB.client);
        const result = jobService.delete(req.params.id, userId);
        if(!result) {
            return next(new ApiError(404, "Job not found"));
        }
        return res.send({message: "Job was deleted successfully"});
        // B3: Thông báo cho người dùng
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Something wrong when deleting the job`)
        );
    }
}