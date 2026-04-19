const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email is require for creating a user" ], // error method
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"], // regex
        unique: [ true, "Email already exists."]
    },
    name: {
        type: String,
        required:[true, "Name is required to create an accoutnt"]
    },
    password: {
        type: String,
        required: [true, "Password is required for creating an account"],
        minlength: [6, "password should contain more than 6 characters" ],
        select: false // so when we fetch the user the password will not be fetched by default wwe have to tell server to fetch it too ( the password isn't show by default )
    }
})