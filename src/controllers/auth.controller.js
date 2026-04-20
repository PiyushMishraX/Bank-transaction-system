const userModel = require("../models/user.model")
const jwt = require

/** 
* - user register controller
* - POST /api/auth/register
*/


async function userRegisterController(req,res) {

    const {email, password , name} = req.userModel

    const isExist = await userModel.findOne({
        email: email
    })

    if(isExists){
        return res.status(422).json({
            message: "User already exists with email.",
            status: "failer"
        })
    }

    const user = await userModel.create({
        email, password, name
    })

    // payload , jwtSecret and expary time ( 3 days )
    const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, { expiresIn:"3d"}) 

    
}

module.exports = {
    userRegisterController
}