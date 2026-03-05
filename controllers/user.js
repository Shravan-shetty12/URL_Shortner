const User = require('../models/user');
const {setUser}=require('../service/auth');
const {v4:uuidv4}=require('uuid');
const sendLoginEmail=require('../utils/sendEmail');


async function handleUserRegistration(req,res) {
    const {name,email,password}=req.body;
    await User.create({
        name,email,password
    });
    return  res.render("home");
}

async function handleUserlogin(req,res) {
    const {email,password}=req.body;
    const user=await User.findOne({
        email,password
    });

    if(!user) 
        return res.render("login",{
            error:"Invalid credentials"
        });
    await sendLoginEmail(email,user.name);
    /*const sessionId=uuidv4();
    setUser(sessionId,user);*/
    const token=setUser(user);
    res.cookie("token",token);
    return  res.redirect("/");
    
}



module.exports={
    handleUserRegistration,
    handleUserlogin
}  ; 
