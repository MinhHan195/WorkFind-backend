const express = require("express");
const job = require("../controllers/job.controller");
const middleware = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
    .post(middleware.verifyToken,job.create);

router.route("/fetch")
    .get(job.findByFilter);

router.route("/fetch/location/:province")
    .get(job.findByProvince);

router.route("/fetch/:key")
    .get(job.findByKey);

router.route("/fetch/total/:userId")
    .get(job.getTotalByUserId);


router.route("/fetch/:userId")
    .get(job.findByUserId);

router.route("/:id")
    .post(middleware.verifyToken, job.update)
    .get(job.findOne)
    .delete(middleware.verifyToken, job.delete);


module.exports = router;