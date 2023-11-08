const mongoose = require('mongoose');

const propSchema = new mongoose.Schema({
    title:{type:String,required:true},
    type:{type:String,required:true},
    purpose:{type:String,required:true},
    location:{type:String,required:true},
    price:{type:Number},
    area:{type:String},
    description:{type:String},
    bed:{type:Number},
    bath:{type:Number},
    tfloors:{type:Number},
    age:{type:Number},
    floor:{type:Number},
    wash:{type:Number},
    lift:{type:Number},
    wall:{type:Boolean},
    built:{type:Boolean},
    opens:{type:Number},
    images:{type:Array},
    ownerId:{type:String},
    coordinates:{type:{lat:{type:Number}, lng:{type:Number}}, _id:false},
    createdAt:{type:Date, default:Date.now()},
    likedBy:{type:Array, default:[]},
    views:{type:Array, default: []}
})

const Property = mongoose.model('Property',propSchema);

module.exports = Property;