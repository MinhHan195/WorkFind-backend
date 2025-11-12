const express = require("express");
const applicationController = require("../controllers/application.controller")
const middleware = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
    .post(middleware.verifyToken, applicationController.create)
    .get(middleware.verifyToken, applicationController.fetchUserList);

router.route("/company/:id")
    .get(middleware.verifyToken, applicationController.fetchCompanyList);


module.exports = router;
