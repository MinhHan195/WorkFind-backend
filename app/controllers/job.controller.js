const Joi = require("../validation/job.validate");
const ApiError = require("../api-error");
const JobService = require("../services/job.service");
const MongoDB = require("../utils/mongodb.util");
const AccountService = require("../services/account.service");
const UserService = require("../services/user.service");
const JobTypeService = require("../services/jobtype.service");
const CareerLevelService = require("../services/careerLevel.service");
const EducationLevelService = require("../services/educationLevel.service");


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
        const document = await jobService.findByFilter(req.body);
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
        const key = req.params.key ? req.params.key.toLowerCase() : undefined;
        const province = req.params.province ? req.params.province.toLowerCase() : undefined;
        console.log(key);
        const jobService = new JobService(MongoDB.client);
        const document = await jobService.find({});
        const string = jobService.jobToString(document);
        console.log(string);
        const result = document.filter((job, index) => {
            console.log("Key: ",string[index].includes(key))
            console.log("Province: ",string[index].includes(province))
            return (string[index].includes(key) || string[index].includes(province))
        })
        
        return res.send(result);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error getting job`)
        );
    }
}

exports.findAll = async (req,res,next) => {
    try {
        const jobService = new JobService(MongoDB.client);
        const document = await jobService.find({});
        if(document.length==0){
            return next(new ApiError(404, "Job not found"));
        }
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

exports.getListJobFavorite = async (req, res, next) => {
    try {
        // B1: Kiểm tra JWT lấy id account
        // B2: Lấy danh sách favorite job 
        const userService = new UserService(MongoDB.client);
        const user = (await userService.findByAccountId(req.user._id));
        // B3: Kiểm tra và trả về cho người dùng
        if(user.listUserFavoriteJob === undefined){
            return res.send([]);
        }
        const jobService = new JobService(MongoDB.client);
        const result = [];
        for(let index in user.listUserFavoriteJob){
            const job = await jobService.findById(user.listUserFavoriteJob[index]);
            result.push(job);
        }
        return res.send(result);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Something wrong when get list favorite jobs`)
        );
    }
}

exports.getJobFilter = async (req, res, next) => {
    try {
        let result = {};
        const jobTypeService = new JobTypeService(MongoDB.client);
        const list = await jobTypeService.find({});
        const careerLevelService = new CareerLevelService(MongoDB.client);
        const careerLevel = await careerLevelService.find({});
        const educationLevelService = new EducationLevelService(MongoDB.client);
        const educationLevel = await educationLevelService.find({});
        result.jobType = list;
        result.careerLevel = careerLevel;
        result.educationLevel = educationLevel;
        return res.send(result);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Something wrong when get the list job type`)
        );
    }
}

exports.addJobFavorite = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const result = await userService.addJobFavorite(req.user._id, req.body.jobId);
        if(!result){
            return next(new ApiError(404, "Không tìm thấy người dùng"))
        }
        return res.send({
            result: true,
        })
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "Có lỗi trongg khi lưu trữ công việc")
        );
    }
}

exports.deleteJobFavorite = async (req, res, next) => {
    try {
        console.log(req.params.jobId);
        const userService = new UserService(MongoDB.client);
        const result = await userService.deleteJobFavorite(req.user._id, req.params.jobId);
        console.log(result);
        if(!result){
            return next(new ApiError(404, "Không tìm thấy người dùng"))
        }
        return res.send({
            result: true,
        })
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "Có lỗi trongg khi lưu trữ công việc")
        );
    }
}