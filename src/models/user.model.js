const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
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
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    } // create a system user with access tool // change it to true directly in database not by code
}, {
    timestamps: true, // storing user creation and last details changing time
})

// hashing the password on change ( even after creation too )
// .pre("save") // This tells Mongoose to run this function every time a document is about to be saved (either when creating a new user or updating an existing one).

userSchema.pre("save",async function (next) {

    // if(!this.password.isModified){
    if(!this.isModified("password")){
        // return next()
        return 
    }

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    // return next() // use nest only when not using async and await // no async keyword in functiona
    // delete and refresh server at inital faces for comparison etc errors

    return 
    
})


userSchema.methods.comparePassword = async function (password) {

    console.log(password, this.password);

 

    return await bcrypt.compare(password,this.password) // bcrypt.compare returns true or false
    
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel