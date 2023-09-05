const mongoose = require('mongoose');

const propSchema = new mongoose.Schema({
    title:{type:String,required:true},
    type:{type:String,required:true},
    location:{type:String,required:true},
    price:{type:String},
    area:{type:String},
    description:{type:String},
    images:{type:Array},
    ownerId:{type:String}
})

const Property = mongoose.model('Property',propSchema);

module.exports = Property;