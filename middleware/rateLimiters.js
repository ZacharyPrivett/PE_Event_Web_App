const rateLimit = require("express-rate-limit");

exports.logInLimiter = rateLimit({
    windowMs: 2* 60 * 1000, // 2 min time window
    max: 4,
    handler: (req, res, next) => {
        let err = new Error('Too many login, Try again later');
        err.status = 429;
        return next(err);
    }
});