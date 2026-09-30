const express = require("express");
const URL = require("../models/url");
const User = require("../models/user");
const { restrictTo } = require("../middleware/auth");
const redis = require("../config/redis");

const { handleAdminDeleteShortUrl } = require("../controllers/url");
const router = express.Router();

router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
  try {
    const allurls = await URL.find().populate("createdBy", "name email").lean();

    const allusers = await User.find({}, "name email role createdAt").lean();

    // Redis keys corresponding to every URL
    const redisKeys = allurls.map((url) => `url:${url.shortId}`);

    let cachedValues = [];

    if (redisKeys.length > 0) {
      cachedValues = await redis.mget(redisKeys);
    }

    // Add Redis cache status to every URL
    const urlsWithCacheStatus = allurls.map((url, index) => ({
      ...url,
      isCached: Boolean(cachedValues[index]),
    }));

    // Optional cached-only filter
    const cachedOnly = req.query.cache === "cached";

    const urls = cachedOnly
      ? urlsWithCacheStatus.filter((url) => url.isCached)
      : urlsWithCacheStatus;

    const cachedCount = urlsWithCacheStatus.filter(
      (url) => url.isCached,
    ).length;

    res.render("admin", {
      urls,
      users: allusers,
      user: req.user,
      cachedCount,
      totalUrlCount: allurls.length,
      cachedOnly,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).send("Unable to load admin dashboard");
  }
});

router.post(
  "/admin/urls/:shortId/delete",
  restrictTo(["ADMIN"]),
  handleAdminDeleteShortUrl,
);

router.get("/", restrictTo(["NORMAL", "ADMIN"]), async (req, res) => {
  const allurls = await URL.find({ createdBy: req.user._id });
  res.render("home", {
    urls: allurls,
    user: req.user,
    id: req.query.id || null,
  });
});

router.get("/signup", (req, res) => res.render("signup"));

router.get("/login", (req, res) => res.render("login"));

module.exports = router;
