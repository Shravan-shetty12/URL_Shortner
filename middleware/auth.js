const {getUser}=require('../service/auth');



function checkForAuthentication(req,res,next){

    if(req.user){
        return next();
    }
    const tokenCookie=req.cookies?.token;
    req.user=null;
    if(!tokenCookie){
        return next();
    }
    const token=tokenCookie;

    const user=getUser(token);
    req.user=user;
    return next();
}


function restrictTo(roles){
    return function(req,res,next){
        if(!req.user ) return res.redirect("/login");
        if(!roles.includes(req.user.role)) return res.end("Unauthorized");
        return next();

}
}




/*
 function restrictTologgedInUsers(req,res,next){
    const sessionId=req.cookies?.uid;
    const userId=req.headers["authorization"];
    if(!userId){
        return res.redirect("/login");
    }
    
    
    const token=userId.split('Bearer ')[1];
    const user=getUser(token);
    if(!user){
        return res.redirect("/login");
    }
    req.user=user;
    next();
}


function checkAuth(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        return next();   // don't crash
    }

    const token = authHeader.split(" ")[1];
    const user = getUser(token);

    req.user = user || null;
    next();
}
*/

module.exports={
    checkForAuthentication,
    restrictTo,
}   