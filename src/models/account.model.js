// one person can have multiple transaction accounts so creating seperate account model in better

const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, // here we enter the objectid of the usermodel
        ref: "user", // name of usermodel,
        required: [true, "Account must be associated with a user"]

    },
    status: { // account uis working , froxen or closed
        enum: {
            value: [ "ACTIVE", "FROZEN", "CLOSED"],
            message: "Status can be either ACTIVE, FROZEN OR CLOSED" 
        }
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    },
    

})