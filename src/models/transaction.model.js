// transaction model for the ammount user will send to others accounts
const mongoose = require("mongoose")


const transactionSchema = new mongoose.Schema({

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account", // referes to account Schema
        requires: [true, "Transaction must be assocated with a from account"],
        index: true // index for fast retrival of data
    },
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        requires: [true, "Transaction must be assocated with a to account"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: [ "PENDING", "COMPLETED", "FAILTED", "REVERSED"],
            message: "Status can be either PENDING, COMPLETED, FAILED or REVERSED"
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [ true, "Amount is required for ccrating a transaction" ],
        min: [ 0, "Transaction amount cannot be negative" ]
    },
    idempotencyKey: { // genrated on client side not backend 
        type: String,
        required: [true , "Idempotency Key is required for creating a transaction "],
        index: true,
        unique: true
    }
}, {
    timestamps: true
})



const transactionModel = mongoose.model("transaction", transactionSchema)


module.exports = transactionModel