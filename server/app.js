const express = require('express');
const connectDB = require('./db.js');
require('dotenv').config();
const app = express();
const authRouter = require('./routes/authRoute.js')
const userRouter = require('./routes/userRoute.js')
const adminRouter = require('./routes/adminRoute.js')
const chatRouter = require('./routes/chatRoute.js')
const blogRouter = require('./routes/blogRoute.js')
const cookieParser = require('cookie-parser')
const path = require("path");
const cors = require("cors");
const socketConnect = require('./socket/socket.js');
const cron = require('node-cron');
const Subscription = require('./models/SubscribeModel.js');
const User = require('./models/UserModel.js')

const PORT = process.env.PORT || 8800;
const MongoURI = process.env.MongoURI;
console.log(MongoURI)
const ClientUrl = process.env.ClientUrl;

cron.schedule('0 0 * * *',async()=>{
    console.log("Cron running successfully")
    const currentDate = Date.now();
    const query = {endDate:{$lt:currentDate}};

    try {
        const expiredSubs = await Subscription.find(query);
        console.log(expiredSubs)
    
        await Subscription.updateMany(query,
                {$set:{status:'expired'}},{new:true}
            )
    
        const userIds = expiredSubs.map((sub=>sub.userId));
    
        const userFindQuery = {_id:{$in:userIds}};
    
        await User.updateMany(userFindQuery,{
            $set:{subscribed:false}
        })
        
    } catch (error) {
        console.log(error)
    }
})

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', ClientUrl);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(cors({ origin: ClientUrl, credentials: true }))

app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/images", express.static(path.join(__dirname, "/public/images")))

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter)
app.use('/api/chat', chatRouter)
app.use('/api/blog', blogRouter)
app.use('/api', userRouter)

const connect = async () => {
    try {
        await connectDB();

        let server = app.listen(PORT, () => {
            console.log('Server running on port:', PORT)
        })

        return server

    } catch (error) {
        console.log(error)
    }
}

connect()
    .then((server) => {
        socketConnect(server)
    })
    .catch((err) => {
        console.log(err)
    })





