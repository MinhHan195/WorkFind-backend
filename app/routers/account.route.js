const express = require("express");
const account = require("../controllers/account.controller")
const register = require("../controllers/register.controller")

const router = express.Router();

router.route("/")
    .post(register.create);

router.route("/verify")
    .get(register.verify);

router.route("/:id")
    .get(account.findOne)
    .delete(account.delete)
    .put(account.update);



module.exports = router;
