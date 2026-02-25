const express = require('express');
const { handleUserRegistration,handleUserlogin } = require('../controllers/user');
const router = express.Router();

router.post("/",handleUserRegistration);

router.post("/login",handleUserlogin);


module.exports=router;