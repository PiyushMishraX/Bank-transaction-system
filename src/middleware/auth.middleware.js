const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function authMiddleware(req, res, next) {

    // console.log("authMidd 1");
    

    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]
    // The Authorization header is a standard HTTP header used to carry credentials (like a Bearer Token) to authenticate a client with a server

    if(!token){
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    try {

        // console.log("authmiddleware");
        

        const decodedd = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decodedd.userId)

        req.user = user // request now have user which we can use in the controller after the next()

        return next() 
        
    } catch (err) {

        // console.log("authMidd err");
        

        return res.status(401).json({
            message: "unauthorized access, token is invalid"
        })
        
    }
    
    
}

module.exports = {
    authMiddleware
}