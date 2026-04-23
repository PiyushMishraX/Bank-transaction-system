// one person can have multiple transaction accounts so creating seperate account model in better

const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // name of usermodel,
        required: [true, "Account must be associated with a user"]

    },
})