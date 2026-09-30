const rateLimit = require("express-rate-limit");

const createUrlLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // maximum 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    error: "Too many URL creation requests. Please try again later.",
  },
});

module.exports = {
  createUrlLimiter,
};
