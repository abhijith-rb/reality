const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    sellerId:{type:String},
    day:{type:String},
    date:{type:Date},
    timeSlots:{type:Array},
})

const Slot = mongoose.model("Slot",SlotSchema);

module.exports = Slot;