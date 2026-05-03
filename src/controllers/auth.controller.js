const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
const tokenBlackListModel = require("../models/balcklist.model")

// can see this info if hover ove the router ( NOT FUNCTIONALITY BUT IS JS DOC COMMENT ) ----->>>>

/** 
* - user register controller
* - POST /api/auth/register
*/

async function userRegisterController(req,res) {

    // const { email, password , name} = req.userModel
    const { email, password , name} = req.body

    const isExists = await userModel.findOne({
        email: email
    })

    if(isExists){
        return res.status(422).json({
            message: "User already exists with email.",
            status: "failure"
        })
    }


    const user = await userModel.create({
        email, password, name
    })

    // payload , jwtSecret and expiary time ( 3 days )
    const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, { expiresIn:"3d"})
    
    res.cookie("token", token)

    res.status(201).json({
        user:{
            _id: user.  _id,
            email: user.email,
            name: user.name,
        },
        token
    })

    // create after sending response so await can take time needed

    await emailService.sendRegistrationEmail(user.email, user.name)
    
}


/** 
* - user Login controller
* - POST /api/auth/login
*/

async function userLoginController(req,res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({email}).select("+password") // password value do not fetch at default

    if(!user) {
        return res.status(401).json({
            message: "Email or Password is incorrect"
        })
    }

    const isValidPassword = await  user.comparePassword(password)

    console.log(isValidPassword);
    


    if(!isValidPassword) {
        return res.status(401).json({
            message: "Email or Password is incorrect"
        })
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"})

    res.cookie("token",token)

    res.status(200).json({
            _id: user._id,
            email: email,
            name: user.name,        
        },
        token
    )
    
    
}


/**
 * - user Logout controller
 * - POST /api/auth/logout
 */

async function userLogoutController(req, res) {

    const token = req.cookies.token || req.header.authorization?.split(" ")[ 1 ]

    if(!token){
        // return res.status(400).json({}) // can send 400 bcz user wants to logout but do not have token or can send 200 ->
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }

    res.cookie("token", "") // clear token

    await tokenBlackListModel.create({
        token: token
    })

    res.status(200).json({
        messsage: "User logged out successfully"
    })
    
}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}

