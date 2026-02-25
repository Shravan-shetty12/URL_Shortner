const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        Required:true,
    },

    email:{
        type:String,
        Required:true,
        unique:true,
    },
    password:{
        type:String,
        Required:true,
    },


},{timestamps:true});

const User= mongoose.model('User',userSchema);
module.exports=User;