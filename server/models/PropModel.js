const mongoose = require('mongoose');

const propSchema = new mongoose.Schema({
    title:{type:String,required:true},
    type:{type:String,required:true},
    purpose:{type:String,required:true},
    location:{type:String,required:true},
    price:{type:Number},
    area:{type:String},
    description:{type:String},
    images:{type:Array},
    ownerId:{type:String},
    createdAt:{type:Date,default:Date.now()},
})

const Property = mongoose.model('Property',propSchema);

module.exports = Property;