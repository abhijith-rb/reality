const User = require('../models/UserModel');
const jwt = require('jsonwebtoken')
const multer = require('multer');
const Property = require('../models/PropModel');
const Banner = require('../models/BannerModel');
const Razorpay = require('razorpay');
const Subscription = require('../models/SubscribeModel');
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});
const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt')

const userCtrl = {}

const singleStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

userCtrl.uploadSingle = multer({ storage: singleStorage });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
    }
})

userCtrl.upload = multer({ storage })

userCtrl.authenticateToken = (req, res, next) => {
    const token = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if(!refreshToken){
        console.log("No refresh token");
        return res.status(200).json(null)
    }
    
    console.log(token)
    console.log("##########################")

    if (!token) {
        console.log("Unauthorized: Token not provided")
        return res.status(401).json({ msg: "Unauthorized: Token not provided" })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decodedToken;
        console.log("---------------------------")
        console.log(decodedToken)
        console.log("---------------------------")
        next();
    } catch (error) {
        console.log(error)
        console.log("Unauthorized: Invalid token")
        return res.status(401).json({ msg: "Unauthorized: Invalid token" })
    }
}

userCtrl.getDetails = async (req, res) => {
    const username = req.user.name;
    console.log(username)
    const user = await User.findOne({ username });
    try {
        if(user){
            const { password, ...others } = user._doc
            console.log(others)
            console.log(req.user)
            res.status(200).json(others)
        }
        
    } catch (error) {
        res.status(500).json(error)
    }
}

userCtrl.uploadImg = async (req, res) => {
    console.log("-------checkpoint-------------")
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log(req.file)
    const image = req.file.originalname;
    console.log(image)
    const userId = req.params.id;
    console.log(userId)
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: {
                image: image
            }
        }, { new: true })
        console.log(updatedUser)
        const { password, ...userInfo } = updatedUser._doc;
        res.status(200).json(userInfo)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Failed" })
    }
}

userCtrl.addProperty = async (req, res) => {
    const { title, type, purpose, location, price, area, description, ownerId } = req.body;
    const coordinates = JSON.parse(req.body.coordinates)
    console.log(coordinates)
    let propObj = { title, type, purpose, location, price, area, 
        description, ownerId, coordinates}
    try {

        if(type === "Residential"){
            const {bed,bath,tfloors,age} = req.body;
            propObj = {...propObj,bed,bath,tfloors,age}
        }
        else if(type === "Commercial"){
            const {floor,wash,lift} = req.body;
            propObj = {...propObj,floor,wash,lift}
        }
        else if(type === "Plot"){
            const {wall,built,opens} = req.body;
            propObj = {...propObj,wall,built,opens}
        }

        if (req.files.length) {
            propObj.images = req.files;
            console.log("img Present")
        }

        const newProperty = new Property(propObj);
        await newProperty.save();

        console.log("New Property saved");
        res.status(200).json({ msg: "New Property saved" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Something went wrong" })
    }
};

userCtrl.getAllProps = async (req, res) => {
    try {
        const allProps = await Property.find();
        res.status(200).json(allProps)
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something went wrong" })
    }
}

userCtrl.getFavorites = async (req, res) => {
    const userId = req.params.id;
    try {
        const favProps = await Property.find({likedBy:{$in:[userId]}});
        console.log(userId)
        res.status(200).json(favProps)
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something went wrong" })
    }
}

userCtrl.getSpecificProperty = async (req, res) => {
    const propId = req.params.id;
    try {
        const property = await Property.findById(propId);
        res.status(200).json(property);
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Something went wrong" })
    }
}

userCtrl.updateProperty = async (req, res) => {
    console.log("checkpoint 3125")
    const propId = req.params.id;
    console.log(propId)
    console.log(req.body)
    const { title, type, purpose, location, price, area, description } = req.body;
    const coordinates = JSON.parse(req.body.coordinates)
    let propObj = { title, type, purpose, location, price, area, 
        description, coordinates}
    try {

        if(type === "Residential"){
            const {bed,bath,tfloors,age} = req.body;
            propObj = {...propObj,bed,bath,tfloors,age}
        }
        else if(type === "Commercial"){
            const {floor,wash,lift} = req.body;
            propObj = {...propObj,floor,wash,lift}
        }
        else if(type === "Plot"){
            const {wall,built,opens} = req.body;
            propObj = {...propObj,wall,built,opens}
        }

        if (req.files.length) {
            const images = req.files;
            console.log("img Present")
            
            const updatedProperty = await Property.findByIdAndUpdate(propId, {
                $set: propObj,
                $push: { images: { $each: images } }
            }, { new: true })
            res.status(200).json(updatedProperty)
        }
        else {
            console.log("checkpoint 3125 no img")
            const updatedProperty = await Property.findByIdAndUpdate(propId, {
                $set: propObj
            }, { new: true })
            res.status(200).json(updatedProperty)
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something went wrong" })
    }
}

userCtrl.deleteProperty = async (req, res) => {
    const propId = req.params.id;
    try {
        await Property.findByIdAndDelete(propId);
        res.status(200).json({ msg: "Deleted Successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Something went wrong" })
    }
}



userCtrl.searchProperties = async (req, res) => {
    console.log(req.query)
    const squery = req.query.squery;
    const nav = req.query.nav;
    const type = req.query.type;
    const min = req.query.min;
    const max = req.query.max;

    try {
      if (squery) {
        console.log(squery)
        
        const regex = new RegExp(squery, 'i');
        const properties = await Property.find(
            { 
             $or:[{title: {$regex:regex}} ,{location: {$regex:regex}}],
             type:type,
             price:{$gte:min,$lte:max}
            });
        console.log(properties);
        res.status(200).json(properties);
      }
      else if(nav){
        const properties = await Property.find({
              purpose : nav,
              type:type,
              price:{$gte:min,$lte:max}
          });

        console.log(properties);
          res.status(200).json(properties);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Something went wrong" });
    }
  };

userCtrl.propSearch = async (req, res) => {
    console.log(req.query)
    const squery = req.query.squery;
    try {
      if (squery) {
        console.log(squery)
        
        const regex = new RegExp(squery, 'i');
        const properties = await Property.find(
            { 
             $or:[{title: {$regex:regex}} ,{location: {$regex:regex}}],
            });
        console.log(properties);
        res.status(200).json(properties);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Something went wrong" });
    }
  };

userCtrl.deleteImg = async (req, res) => {
    const propId = req.params.id;
    const filename = req.query.filename;
    try {
        const updatedProperty = await Property.findByIdAndUpdate(propId, {
            $pull: { images: { filename: filename } }
        }, { new: true })

        console.log(updatedProperty)
        res.status(200).json({ msg: "Image Deleted Successfully", updatedArray: updatedProperty.images })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server error" })
    }

}

userCtrl.getUserProps = async (req, res) => {
    const userId = req.params.id;
    const search = req.query.squery;
    try {
        if (search) {
            const regex = new RegExp(search, 'i')
            const properties = await Property.find(
                {$and:[{ ownerId: userId},
                    { 
                        $or:[{title: {$regex:regex}} ,{location: {$regex:regex}}],
                       }
                ]}
                );
            // console.log(properties)
            res.status(200).json(properties)
        }
        else {
            const properties = await Property.find({ ownerId: userId });
            // console.log(properties)
            res.status(200).json(properties)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Something went wrong" })
    }

}

userCtrl.findUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const response = {username: user.username, image: user.image, googleUser: user.googleUser}
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteSubsDoc = async(orderId)=>{
    try {
        const orderid = new objectId(orderId);
        const docExists = await Subscription.findOne({_id:orderid});
        if(!docExists) return;
        
        await Subscription.deleteOne({_id:orderid});
        console.log("failed subdoc deleted")
    } catch (error) {
        console.log(error)
    }
}

const changePaymentStatus = (orderId) => {
    return new Promise((resolve, reject) => {
        const orderid = new objectId(orderId);
        Subscription.updateOne({ _id: orderid },
            {
                $set: {
                    paymentStatus: 'Success',
                    status: 'active',
                }
            }).then(() => {
                resolve()
            })
    })
}

const verifyPayment = (payment) => {
    return new Promise((resolve, reject) => {
        const crypto = require('crypto');
        let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);

        hmac.update(payment['razorpay_order_id'] + '|' + payment['razorpay_payment_id']);
        hmac = hmac.digest('hex');

        if (hmac === payment['razorpay_signature']) {
            resolve();
        } else {
            reject();
        }
    });
};

userCtrl.checkVerified = async (req, res) => {
    const {payment,order,userId} = req.body;

    verifyPayment(payment)
        .then(() => {
            changePaymentStatus(order.receipt).then(async () => {
                try {
                    console.log(userId)
                    const user = await User.findOneAndUpdate({ _id: userId }, {
                        $set: { subscribed: true }
                    }, { new: true });

                    res.json({ msg: "Payment Successful", user });

                } catch (error) {
                    console.error(error);
                    res.json({ msg: 'User update failed' });
                }

            })
        }).catch((err) => {
            deleteSubsDoc(order.receipt)
            res.json({ status: false, msg: 'Failed Payment' })
        })
}


const generateRazorpay = (orderId, total) => {
    return new Promise((resolve, reject) => {

        const options = {
            amount: (total) * 100,
            currency: "INR",
            receipt: '' + orderId
        };

        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log(err)
            } else {
                console.log(order)
                resolve(order)
            }

        })
    })
}

userCtrl.createSubscription = async (req, res) => {
    const userId = req.params.id;

    const subActive = await Subscription.findOne({userId,status:'active'});
    if(subActive){
        res.status(403).json({msg:"User already has an active subscription"})
    }
    const plan = req.query.plan;
    let price;
    let startDate = Date.now();
    let endDate;

    if (plan === "monthly") {
        price = 500;
        const currentTimestamp = Date.now();
        const currentDate = new Date(currentTimestamp);
        currentDate.setDate(currentDate.getDate() + 30);
        console.log(currentDate);
        endDate = currentDate;
        
    } else if (plan === "yearly") {
        price = 6000;
        const currentTimestamp = Date.now();
        const currentDate = new Date(currentTimestamp);
        currentDate.setDate(currentDate.getDate() + 365);
        console.log(currentDate);
        endDate = currentDate;
    }

    const newSub = new Subscription({
        userId: userId,
        plan: plan,
        price: price,
        startDate,
        endDate
    })
    
    try {
        const savedSub = await newSub.save()
        const subId = savedSub._id;

        const order = await generateRazorpay(subId, price)
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json(error)
    }
}

userCtrl.FailedPayment = async(req,res)=>{
    const docId = req.body.docId;
    try {
        deleteSubsDoc(docId);
        res.status(200).json({msg:"Payment failed"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Something went wrong"})
    }
}

userCtrl.unsubscribe = async(req,res)=>{
    const userId = req.params.id;
    try {
        await Subscription.updateOne({userId,status:'active'},{
            $set:{status:'canceled'}
        })
    
        const user = await User.findOneAndUpdate({_id:userId},{
            $set:{subscribed:false}
        },{new:true})
        res.status(200).json({msg:"Unsubscribed the app",user})
        
    } catch (error) {
        res.status(500).json({msg:"Something went wrong"})
    }
}

userCtrl.likeProp = async(req,res)=>{
    const propId = req.body.propId;
    const userId = req.body.userId;
    const property = await Property.findById(propId)
    try {
        if(property.likedBy.includes(userId)){
            const updProp = await Property.findByIdAndUpdate(propId,{
                $pull:{likedBy:userId}
            },{new:true})
            res.status(200).json({updProp,msg:"Property removed from Favorite list"})
        }
        else{
            const updProp = await Property.findByIdAndUpdate(propId,{
                $push:{likedBy:userId}
            },{new:true})
            res.status(200).json({updProp,msg:"Property added to Favorite list"})
        }
    } catch (error) {
        res.status(500).json({msg:"Something went wrong"})
    }
}

userCtrl.editProfile = async(req,res)=>{
    const userId = req.params.id;
    const updateObj = req.body;
    console.log(updateObj)

    if(req.file){
        updateObj.image = req.file.originalname
    }
    console.log(updateObj)

    try {
       const updatedUser = await User.findByIdAndUpdate(userId,{
            $set:updateObj
       },{new:true})
       console.log(updatedUser)

       const {password, ...userInfo} = updatedUser._doc;
       console.log(userInfo)
       res.status(200).json({userInfo,msg:"Profile Updated Successfully"})
    } catch (err) {
        res.status(500).json({msg:"Something went wrong"})
    }
}

userCtrl.changePwd = async(req,res)=>{
    const userId = req.params.id;
    const {oldPassword,newPassword} = req.body;
    console.log({oldPassword,newPassword})
    const user = await User.findById(userId);
    console.log(user)
    try {
        const validPwd = await bcrypt.compare(oldPassword,user.password)
        if(!validPwd){
            return res.status(400).json({msg:"Incorrect Password"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        await User.findByIdAndUpdate(userId,{
            $set:{password:hashedPassword}
        })
        res.status(200).json({msg:"Password Changed Successfully"})
    } catch (error) {
        res.status(500).json({msg:"Something went wrong"})
    }
}
 
userCtrl.getBanner = async(req,res)=>{
    try {
        const banner = await Banner.findOne()
        res.status(200).json(banner)
    } catch (error) {
        res.status(500).json({msg:"Something went wrong"})
    }
}

userCtrl.addView = async(req,res)=>{
    const {userId, postId} = req.body;
    const property = await Property.findById(postId)
    console.log(property)

    if(property.views.includes(userId)){
       return res.status(204).json({msg:"Already viewed"})
    }

    try {
        await Property.findByIdAndUpdate(property._id,{
            $push:{views:userId}
        })

        res.status(200).json({msg:"View added"})
    } catch (error) {
        res.status(500).json({msg:"Something went wrong"})
    }
}

userCtrl.getOwnerPropDeets = async(req,res)=>{
    const userId = req.params.id;
    console.log("userid",userId)
    try {

        const viewAgt = await Property.aggregate([
            {
              $match: { ownerId: userId }
            },
            {
              $addFields: {
                viewsExist: { $gt: [{ $size: "$views" }, 0] } 
              }
            },
            {
              $match: { viewsExist: true } 
            },
            {
              $unwind: "$views"
            },
            {
              $group: {
                _id: null,
                viewArray: {
                  $push: "$views"
                },
              }
            },
            {
              $project: {
                _id: 0,
                viewCount: {
                  $size: "$viewArray"
                }
              }
            }
          ]);
          
   
        const views = viewAgt.length === 0 ? 0 :  viewAgt[0].viewCount;
        const ownerProps = await Property.find({ownerId:userId}).countDocuments().exec();
        const subDoc = await Subscription.findOne({userId,status:'active'})

        console.log({views,ownerProps,subDoc})
        res.status(200).json({views,ownerProps,subDoc})
    } catch (error) {
        res.status(500).json({msg:"Something went wrong"})
    }
}

userCtrl.getSubscriptionData = async(req,res)=>{
    const userId = req.params.id;
    try{
        const subDoc = await Subscription.findOne({userId,status:'active'});
        res.status(200).json(subDoc)
    }catch(err){
        console.log(err)
        res.status(500).json({msg:"Something went wrong"})
    }
}

module.exports = userCtrl;