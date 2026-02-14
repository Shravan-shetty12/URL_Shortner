const mangoose = require('mongoose');
async function connectToMongoDB(url) {
    return  mangoose.connect(url);
}
module.exports=connectToMongoDB;