const mongoose = require("mongoose")

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, "TOken is required to blacklist" ],
        unique: [ true, "Token is already blacklisted"]
    }
}, {
    timestamps: true
}) 

// token aren't valid for everytime they have some time frame , so we can remove the balcklist after that time frame too
tokenBlacklistSchema.index({ createdAt:1},{
    expireAfterSeconds: 60* 60* 24* 3 // 3 days
}) // delete from db after 3 days of black list

const tokenBlackListModel = mongoose.model("tokenBlacklist", tokenBlacklistSchema);

module.exports = tokenBlackListModel;