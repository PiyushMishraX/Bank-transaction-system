const userModel = require("../models/user.model")

/** 
* - user register controller
* - POST /api/auth/register
*/


function userRegisterController(req,res) {

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


    
    
}

module.exports = {
    userRegisterController
}