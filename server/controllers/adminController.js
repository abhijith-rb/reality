const User = require('../models/UserModel');
const Property = require('../models/PropModel')
const adminCtrl = {};
const jwt = require('jsonwebtoken')

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




module.exports = adminCtrl;