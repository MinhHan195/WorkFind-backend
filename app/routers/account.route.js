const express = require("express");
const account = require("../controllers/account.controller")
const register = require("../controllers/register.controller")
const auth = require("../controllers/auth.controllers");
const middleware = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
    .post(register.create);

router.route("/login")
    .post(auth.logIn)
    .get(middleware.verifyToken,auth.getUserData);
    
router.route("/login/check")
    .get(auth.checkLogin);

router.route("/changePassword")
    .post(middleware.verifyToken,account.changePassword);

router.route("/reset/reset_request")
    .post(account.sendRequest)      
    .get(account.getUserId);  

router.route("/reset/password")
    .post(account.resetPassword);

router.route("/verify")
    .get(register.verify);

router.route("/:id")
    .delete(middleware.verifyToken,account.delete);



module.exports = router;
