const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            unique:true
        },
        description:{
            type:String,
            required:true,
        },
        
        image:{
            type:String,
            required:false,
        },
        username:{
            type:String,
            required:true,
        },
        tags:{
            type:Array,
        },
        userId:{
            type:String,
            required:true,
        }
    }
       
    ,{timestamps:true}
);

module.exports = mongoose.model("Blog",BlogSchema);