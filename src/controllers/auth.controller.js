const userModel = require("../models/user.model")

/** 
* - user register controller
* - POST /api/auth/register
*/


function userRegisterController(req,res) {

    const {email, password , name} = req.userModel


    
    
}

module.exports = {
    userRegisterController
}