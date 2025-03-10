const express = require("express");
const profile = require("../controllers/profile.controller");
const authMiddleWare = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
    .post(authMiddleWare.verifyToken,profile.create)
    .get(authMiddleWare.verifyToken,profile.findAll);

router.route("/:id")
    .post(authMiddleWare.verifyToken, profile.update)
    .delete(authMiddleWare.verifyToken, profile.delete);


module.exports = router;