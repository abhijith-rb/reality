const mongoose = require('mongoose');

const connectDB = async(MongoURI)=>{
    try {
        await mongoose.connect(MongoURI);
        console.log('Connected to Mongodb')
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;