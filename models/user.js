/*const mongoose = require('mongoose');
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
    role:{
        type:String,
        required:true,
        default:"NORMAL",
    },
    password:{
        type:String,
        Required:true,
    },


},{timestamps:true});

const User= mongoose.model('User',userSchema);
module.exports=User;
*/

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    role: {
        type: String,
        required: true,
        default: "NORMAL",
    },

    password: {
        type: String,
        required: false,   // OAuth users may not have password
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true,      // allows null values
    },

    profileImage: {
        type: String,
    }
},
{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;