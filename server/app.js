const express = require('express');
const connectDB = require('./db.js');
require('dotenv').config();
const app = express();
const authRouter = require('./routes/authRoute.js')
const userRouter = require('./routes/userRoute.js')
const adminRouter = require('./routes/adminRoute.js')
const chatRouter = require('./routes/chatRoute.js')
const cookieParser = require('cookie-parser')
const path = require("path");
const cors = require("cors")

const PORT = process.env.PORT || 8800;
const MongoURI = process.env.MongoURI;
console.log(MongoURI)

connectDB(MongoURI);

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(cors({origin:"http://localhost:3000",credentials:true}))

app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/images", express.static(path.join(__dirname,"/public/images")))

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter)
app.use('/api/chat', chatRouter)
app.use('/api',userRouter)

app.listen(PORT, () => {
    console.log('Server running on port:', PORT)
})




