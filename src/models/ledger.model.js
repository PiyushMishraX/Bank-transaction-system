const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [ true, "Ledger must be associated with an account"],
        index: true,
    },
    amount: {
        type: Number,
        required: [ true, "Amount is reqired for crating a ledger entry"],
    },
    transaction: { // Which transaction is being done will be added in the ledger
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        reuqired: [ true, "Ledger must be associated with a transaction"],
        index: true,
    },

})