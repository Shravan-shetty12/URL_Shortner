const express = require("express");
const { handleGenerateNewShortUrl } = require("../controllers/url");
const { getAnalyticsForShortUrl } = require("../controllers/url");
const { handleDeleteShortUrl } = require("../controllers/url");
const { createUrlLimiter } = require("../middleware/rateLimiter");
const router = express.Router();

router.post("/", createUrlLimiter, handleGenerateNewShortUrl);

router.get("/analytics/:shortId", getAnalyticsForShortUrl);
router.post("/:shortId/delete", handleDeleteShortUrl);

module.exports = router;
