const express = require('express');
const { handleUserRegistration, handleUserlogin } = require('../controllers/user');
const router = express.Router();

router.post("/", handleUserRegistration);

router.post("/login", handleUserlogin);

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    req.logout && req.logout(() => {});
    res.redirect("/login");
});

module.exports = router;