const express = require("express");
const accountController = require("../controllers/account.controller");
const router = express.Router();

router.route("/")
    .get(accountController.fetchListCompany);


module.exports = router;