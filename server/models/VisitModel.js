const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
    sellerId:{type:String},
    visitorId:{type:mongoose.Types.ObjectId},
    propertyId:{type:mongoose.Types.ObjectId},
    day:{type:String},
    date:{type:Date},
    timeSlot:{type:String},
})

const Visit = mongoose.model("Visit",VisitSchema);

module.exports = Visit;