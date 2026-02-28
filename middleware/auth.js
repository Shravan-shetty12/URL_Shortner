const {getUser}=require('../service/auth');

function restrictTologgedInUsers(req,res,next){

    //const sessionId=req.cookies?.uid;
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
module.exports={
    restrictTologgedInUsers,
    checkAuth,
}   