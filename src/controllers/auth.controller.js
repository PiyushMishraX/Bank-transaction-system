const userModel = require("../models/user.model")
const jwt = require

// can see this info if hover ove the router
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
    
    res.cookies("token", token)

    res.status(201).json({
        user:{
            _id: user_id,
            email: user.email,
            name: user.name,
        },
        token
    })

    
}

module.exports = {
    userRegisterController
}