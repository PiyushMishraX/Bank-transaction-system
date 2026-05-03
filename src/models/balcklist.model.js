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


// the process is easy because everytime a token is created is is unique bcz of jwt.sign method which adds issuedAt time by default , so we do not have to check token for uniqueness ,
// we check uniquness only for when one request is being used multiple times


// we have to also check in everyprocess that the blacklisted process isn't being used , which can be done by adding a check in auth middleware functions

// database won't be filled with garbage non-usable values , they will be deleted after their TTL-time to live ends( 3 days )