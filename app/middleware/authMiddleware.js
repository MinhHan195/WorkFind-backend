const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");
const AccountService = require("../services/account.service");
const MongoDB = require("../utils/mongodb.util");
require("dotenv").config();


exports.verifyToken = async (req, res, next) => {
    // B1: Kiểm tra xem header có token hay không
    const token = req.cookies.JWT;
    // B2: kiểm tra token
    try {
        const decoded = jwt.verify(token, process.env.SECRET_CODE);
        const accountService = new AccountService(MongoDB.client);
        const user = await accountService.findById(decoded._id);
        if(!user){
            return next(new ApiError(404, "User not found"));
        }
        // B3: Lưu thông tin trong token vào req.user
        console.log(decoded);
        req.user = decoded;
        // B4: Chuyển đến controller
        next();
    } catch (error) {
        console.log("Loi: ",error);
        return next(new ApiError(403,"Token khong hop le"));
    }
}; 