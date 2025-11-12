const ApiError = require("../api-error");
const ApplicationService = require("../services/application.service ");
const MongoDB = require("../utils/mongodb.util");
exports.create = async (req, res, next) => {
    try {
        // Lấy user id từ JWT chèn vào payload
        const payload = req.body;
        payload.userId = req.user._id;
        // Tạo application
        const application = new ApplicationService(MongoDB.client)
        const result = application.create(payload);
        if (result) {
            return res.send({
                result: true,
                message: "Nộp đơn thành công"
            })
        }
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Có lỗi trong quá trình nộp đơn"));
    }
}

exports.fetchUserList = async (req, res, next) => {
    try {
        const application = new ApplicationService(MongoDB.client)
        const result = await application.find({ userId: req.user._id });
        console.log(result)
        return res.send(result)
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Có lỗi trong quá trình lấy danh sách"));
    }
}

exports.fetchCompanyList = async (req, res, next) => {
    try {
        const application = new ApplicationService(MongoDB.client)
        const result = await application.find({
            companyId: req.user._id
        });
        console.log(result)
        return res.send(result)
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Có lỗi trong quá trình lấy danh sách"));
    }
}