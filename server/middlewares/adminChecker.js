const adminChecker = async(req,res,next)=>{
    if(req.user.role !== "admin"){
        return res.status(401).json({msg:"Unauthorized: to admin route"})
    }else{
        next()
    }
    // if(!req.roles.includes("admin")){
    //     return res.status(401).json({msg:"Unauthorized"})
    // }else{
    //     next()
    // }
}

module.exports = adminChecker;