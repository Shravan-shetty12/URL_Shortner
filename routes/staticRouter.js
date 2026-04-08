const express = require('express');
const URL = require('../models/url');
const { restrictTo } = require('../middleware/auth');
const router = express.Router();

router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
    const allurls = await URL.find().populate("createdBy", "name email");
    res.render("admin", { urls: allurls, user: req.user });
});

router.get("/", restrictTo(["NORMAL", "ADMIN"]), async (req, res) => {
    const allurls = await URL.find({ createdBy: req.user._id });
    res.render("home", { urls: allurls, user: req.user, id: req.query.id || null });
});

router.get("/signup", (req, res) => res.render("signup"));

router.get("/login", (req, res) => res.render("login"));

module.exports = router;