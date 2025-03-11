const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const accountsRouter = require("./app/routers/account.route");
const jobsRouter = require("./app/routers/job.route");
const profileRouter = require("./app/routers/profile.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.json({message: "Welcome to contact book application."});
});

app.use("/api/accounts", accountsRouter);

app.use("/api/jobs", jobsRouter);

app.use("/api/profiles", profileRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});


module.exports = app;