const mongoose = require('mongoose');


const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MongoURI);
        console.log('Connected to Mongodb')
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;