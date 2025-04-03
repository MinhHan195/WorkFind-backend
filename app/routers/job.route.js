const express = require("express");
const job = require("../controllers/job.controller");
const middleware = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
    .post(middleware.verifyToken,job.create)
    .get(job.findAll);

router.route("/favorite")
    .get(middleware.verifyToken, job.getListJobFavorite);

router.route("/fetch")
    .post(job.findByFilter);

router.route("/fetch/total/:userId")
    .get(job.getTotalByUserId);

router.route("/fetch/:key?/:province?")
    .get(job.findByKey);

// router.route("/fetch/:userId")
//     .get(job.findByUserId);

router.route("/filter")
    .get(job.getJobFilter);

router.route("/:id")
    .post(middleware.verifyToken, job.update)
    .get(job.findOne)
    .delete(middleware.verifyToken, job.delete);


module.exports = router;