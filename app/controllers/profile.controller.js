const MongoDB = require("../utils/mongodb.util");
const ProfileService = require("../services/profile.service");
const ApiError = require("../api-error");
const Joi = require("../validation/profile.validate");


exports.create = async (req, res, next) => {
    try {
        // B1: Xác thực JWT để lấy thông tin user bằng middleware
        // B2: Validate thông tin truyền vào
        const {value, error} = Joi.profileValidate.validate(req.body);
        if(error){
            return next(new ApiError(400,error.details[0].message));
        }
        // B3: Gọi dịch vụ tạo profile
        const profileService = new ProfileService(MongoDB.client);
        const document = await profileService.create(req.body, req.user._id);
        // B4: Thông báo cho người dùng
        return res.send({
            message: "Create profile successfuly",
            document
        })
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Something wrong when creating profile"));
    }
}

exports.update = async (req, res, next) => {
    try {
        // B1: Xác thực JWT để lấy thông tin user bằng middleware
        // B2: Validate thông tin truyền vào
        const {value, error} = Joi.profileValidate.validate(req.body);
        if(error){
            return next(new ApiError(400,error.details[0].message));
        }
        // B3: Gọi dịch vụ cập nhật profile
        const profileService = new ProfileService(MongoDB.client);
        const document = await profileService.update(req.body, req.params.id);
        // B4: Thông báo cho người dùng
        return res.send({
            message: "Update profile successfuly",
            document
        })
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Something wrong when updating profile"));
    }
}

exports.delete = async (req,res,next) => {
    try {
        // B1: Xác thực JWT để lấy thông tin user bằng middleware
        // B2: Gọi dịch vụ xóa
        const profileService = new ProfileService(MongoDB.client);
        const result = await profileService.delete(req.params.id, req.user._id);
        if(!result) {
            return next(new ApiError(404, "Profile not found"));
        }
        // B3: Thông báo cho người dùng
        return res.send({
            message: "Delete profile successfuly",
        })
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Something wrong when deleting profile"));
    }
}

exports.findAll = async (req, res, next) => {
    try {
        // B1: Xác thực JWT để lấy thông tin user bằng middleware
        // B2: Gọi dịch vụ tìm
        const profileService = new ProfileService(MongoDB.client);
        const document = await profileService.findByUserId(req.user._id);
        if(document.length==0) {
            return res.send({message: "Profile not found"});
        }
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Something wrong when finding profile"));
    }
}