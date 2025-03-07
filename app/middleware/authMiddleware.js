const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");
const AccountService = require("../services/account.service");
const MongoDB = require("../utils/mongodb.util");
require("dotenv").config();


exports.verifyToken = async (req, res, next) => {
    // B1: Kiểm tra xem header có token hay không
    const token = req.header("Authorization");
    // console.log(token);
    if(!token || !token.startsWith("Bearer ")){
        return next(new ApiError(401,"Khong co token"));
    }
    
    // B2: kiểm tra token
    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_CODE);
        const accountService = new AccountService(MongoDB.client);
        const user = await accountService.findById(decoded._id);
        if(!user){
            return next(new ApiError(404, "User not found"));
        }
        // B3: Lưu thông tin trong token vào req.user
        req.user = decoded;
        // B4: Chuyển đến controller
        next();
    } catch (error) {
        console.log("Loi: ",error);
        return next(new ApiError(403,"Token khong hop le"));
    }
}; 