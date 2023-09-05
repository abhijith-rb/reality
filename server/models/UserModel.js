const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{type:String,unique:true},
    email:{type:String,unique:true},
    phone:{type:Number},
    password:{type:String},
    image:{type:String},
    role:{type:String,default:"user"},
    isBlocked:{type:Boolean,default:false},
    subscribed:{type:Boolean,default:false},
})

const User = mongoose.model('User',userSchema)

module.exports = User;