const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log("authHeader",authHeader)
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    console.log("token",token)
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err){
                console.log(err)
                return res.sendStatus(403); //invalid token
            } 
            
            console.log("verifyJWT decoded", decoded)
            req.user = decoded.UserInfo
            next();
        }
    );
}

module.exports = verifyJWT