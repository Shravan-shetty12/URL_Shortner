/*const sessionIdToUserIdMap = new Map();

function setUser(id,user){
    sessionIdToUserIdMap.set(id,user); this set method was used for session based authentication but now we are using token based authentication 
}
*/

const jwt = require('jsonwebtoken');
const secret="shravan@24pass";
function setUser(user){
    return jwt.sign({
        _id:user._id,
        email:user.email,
        role:user.role
    },secret);
}

/*function getUser(id){
    return sessionIdToUserIdMap.get(id);
}*/

function getUser(token){    
 if(!token) return null;
 try{
return jwt.verify(token,secret);
 }catch(err){
    return null;    
    
}
}

module.exports={
    setUser,
    getUser
}