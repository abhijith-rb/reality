const User = require('../models/UserModel');
const Property = require('../models/PropModel')
const adminCtrl = {};
const jwt = require('jsonwebtoken');
const Subscription = require('../models/SubscribeModel');
const Banner = require('../models/BannerModel');
const multer = require('multer');


const singleStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

adminCtrl.uploadSingle = multer({ storage: singleStorage });

adminCtrl.authenticateToken = (req,res,next)=>{
    const token = req.cookies.access_token;
    console.log(token)
    console.log("##########################")

    if(!token){
        console.log("Unauthorized: Token not provided")
        return res.status(401).json({msg:"Unauthorized: Token not provided"})
    }

    try {
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user = decodedToken;
        console.log("---------------------------")
        console.log(decodedToken)
        console.log("---------------------------")

        if(decodedToken.role !== "admin"){
            console.log("The user is not an Admin")
            return res.status(401).json({msg:"Unauthorized: The user is not an Admin"})
        }

        next();
    } catch (error) {
        console.log(error)
        console.log("Unauthorized: Invalid token")
        return res.status(401).json({msg:"Unauthorized: Invalid token"})
    }
} 


adminCtrl.addUser = async (req, res) => {
    const { username, email, password, phone } = req.body;
    try {
        const newUser = new User({ username, email, password, phone });
        await newUser.save();
        console.log("New User Saved to db")
        res.status(200).json({ msg: "New User Saved to db" })

    } catch (error) {
        console.log(err)
        res.status(500).json({ msg: "Something went wrong" })

    }
}

adminCtrl.getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(200).json(allUsers);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something went wrong" })
    }
}

adminCtrl.getSpecificUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Something went wrong" })
    }
}

adminCtrl.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(req)
        console.log("-------------")
        const { username, email, phone } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: {
                username,
                email,
                phone
            }
        }, { new: true })
        console.log(updatedUser)
        res.status(200).json({ msg: "User updated successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something went wrong" })
    }
}

adminCtrl.blockUser= async(req,res)=>{
    const userId = req.params.id
    try {
        const updatedUser = await User.findByIdAndUpdate(userId,{
            $set:{isBlocked:true}
        },{new:true})
        res.status(200).json({msg:"User Blocked Successfully",updatedUser:updatedUser})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Failed to block user"})
    }
}

adminCtrl.unblockUser= async(req,res)=>{
    const userId = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(userId,{
            $set:{isBlocked:false}
        },{new:true})
        res.status(200).json({msg:"User Unblocked Successfully",updatedUser:updatedUser})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Failed to Unblock user"})

    }
}

adminCtrl.searchUsers = async (req, res) => {
    try {
        const squery = req.query.squery;
        if (squery) {
            const regex = new RegExp(squery, 'i');
            const Users = await User.find({ username: { $regex: regex } })
            res.status(200).json(Users);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Something went wrong" })
    }
}

adminCtrl.getCardDeets= async(req,res)=>{
    try {
        const props = await Property.countDocuments()
        const revenueAgt = await Subscription.aggregate([{$group:{
            _id:null,
            totalPrice:{$sum:"$price"}
        }}])
        
        const revenue = revenueAgt[0].totalPrice;
        const subscribers = await Subscription.countDocuments();
    
        res.status(200).json({props,revenue,subscribers})
        
    } catch (error) {
        res.status(500).json({msg:"Something went wrong"})
    }
}

adminCtrl.getPieDeets = async(req,res)=>{
    try {
        const residential = await Property.find({type:"Residential"}).countDocuments().exec()
        const commercial = await Property.find({type:"Commercial"}).countDocuments().exec()
        const plot = await Property.find({type:"Plot"}).countDocuments().exec()
        
        res.status(200).json({residential,commercial,plot})
    } catch (error) {
        res.status(500).json({msg:"Something went wrong"})
    }

}

adminCtrl.getListChart = async(req,res)=>{
    let names=[];
    let values=[];
    const graphData = [];
    const currentTime = Date.now();
    const date = new Date(currentTime);
    const currentYear = parseInt(date.toDateString().split(' ')[3]);
    const currentMonth = date.toDateString().split(' ')[1];
    const currentDay = date.toDateString().split(' ')[0];
    
    const interval = "month";

    if(interval === "year"){
        values = [0, 0, 0, 0, 0, 0];
        let startYear = currentYear - 6;
        for(let i=1; i<= 6; i++){
            names.push((startYear+i).toString());
        }
    }
    else if(interval === "month"){
        const monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'];
        const indexOfMonth = monthsArray.indexOf(currentMonth);  
        for(let i=0; i<= indexOfMonth; i++){
            names.push(monthsArray[i]);
            values.push(0);
        }  
    }
    else if(interval === "week"){
        values = [0, 0, 0, 0, 0, 0, 0];
        const weekArray = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const indexOfDay = weekArray.indexOf(currentDay);
        for(let j=indexOfDay+1; j<weekArray.length; j++){
            names.push(weekArray[j])
        }

        for(let k=0; k<=indexOfDay; k++){
            names.push(weekArray[k])
        }
    }
    const properties = await Property.find();
    try {
        properties.forEach(property=>{
            const year = property.createdAt.toDateString().split('-')[0].split(' ')[3];
            const month = property.createdAt.toDateString().split('-')[0].split(' ')[1];
            const week = property.createdAt.toDateString().split('-')[0].split(' ')[0];

            if(interval === "year"){
                for(let i=0; i<names.length; i++){
                    if(year === names[i]){
                        values[i] += 1;
                    }
                }
            }else if(interval === "month"){
                for(let i=0; i<names.length; i++){
                    if(month === names[i]){
                        values[i] += 1;
                    }
                }
            }else if(interval === "week"){
                for(let i=0; i<names.length; i++){
                    if(week === names[i]){
                        values[i] += 1;
                    }
                }
            }
        })
        
        console.log({names,values})

        for(let i=0; i<names.length; i++){
            graphData.push({name:names[i],value:values[i]})
        }

        console.log(graphData)
        res.status(200).json(graphData)

    } catch (error) {
        console.log(error)
        res.status(200).json({})
    }
    
}

adminCtrl.getAllBanners = async(req,res)=>{
    try {
        const banners = await Banner.find()
        res.status(200).json(banners)
    } catch (error) {
        res.status(500).json({msg:"Something went wrong"})
    }
}

adminCtrl.searchBanners = async (req, res) => {
    try {
        const squery = req.query.squery;
        if (squery) {
            const regex = new RegExp(squery, 'i');
            const Banners = await Banner.find({ title: { $regex: regex } })
            res.status(200).json(Banners);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Something went wrong" })
    }
}

adminCtrl.getSpecificBanner = async (req, res) => {
    try {
        const bannerId = req.params.id;
        const banner = await Banner.findById(bannerId);
        res.status(200).json(banner);
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Something went wrong" })
    }
}

adminCtrl.addBanner = async (req, res) => {
    const { title, description } = req.body;
    console.log(req.body)
    try {
        if (req.file) {
            const image = req.file.originalname;
            const newBanner = new Banner({image, title, description,  })
            await newBanner.save();
        }
        else {
            console.log('Here is no req.file')
            const newBanner = new Banner({ title, description, })
            await newBanner.save();
        }
        res.status(200).json({msg:""})
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Something went wrong' })
    }

}

adminCtrl.updateBanner = async (req, res) => {
    const bannerid = req.params.id;
    const { title, description, } = req.body;
    
    try {
        if (req.file) {
            const image = req.file.originalname;
            await Banner.findByIdAndUpdate(bannerid,
                {$set:{image, title, description,  }})
            
        }
        else {
            console.log('Here is no req.file')
            await Banner.findByIdAndUpdate(bannerid,
                {$set:{title, description,  }})
            
        }
        res.status(200).json({msg:""})
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Something went wrong' })
    }

}

adminCtrl.deleteBanner = async(req,res)=>{
    const bannerId = req.params.id;
    try {
        await Banner.findByIdAndDelete(bannerId)
        res.status(200).json({msg:"Banner deleted successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


module.exports = adminCtrl;