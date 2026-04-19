const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email is require for creating a user" ], // error method
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/] // regex
    }
})