const mongoose = require("mongoose")

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, "TOken is required to blacklist" ],
        unique: [ true, "Token is already blacklisted"]
    },
    blacklistedAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {
    timestamps: true
}) 

