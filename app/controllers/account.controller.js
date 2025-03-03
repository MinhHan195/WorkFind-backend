const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");



exports.findOne = async (req, res) => {
    res.send({message: "Tim tai khoan nguoi dung"});
}

exports.update = async (req, res) => {
    res.send({message: "Cap nhat tai khoan nguoi dung"});
}

exports.delete = async (req, res) => {
    res.send({message: "Xoa tai khoan nguoi dung"});
}

exports.authenticate = async (req, res) => {
    
}
                                                                           