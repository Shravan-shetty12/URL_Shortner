const sessionIdToUserIdMap = new Map();

function setUser(id,user){
    sessionIdToUserIdMap.set(id,user);
}

function getUser(id){
    return sessionIdToUserIdMap.get(id);
}

module.exports={
    setUser,
    getUser
}