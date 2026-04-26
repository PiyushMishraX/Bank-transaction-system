const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [ true, "Ledger must be associated with an account"],
        index: true,
        immutable: true // no change , because a ledger entry cannot be changed after creation bcz it is the true value
    },
    amount: {
        type: Number,
        required: [ true, "Amount is reqired for crating a ledger entry"],
        immutable: true
    },
    transaction: { // Which transaction is being done will be added in the ledger
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        reuqired: [ true, "Ledger must be associated with a transaction"],
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: ["CREDIT", "DEBIT"],
            message: "Type can be either CREDIT or DEBIT",
        },
        required: [ true, "Ledger type is required"],
        immutable: true
    }
})


// A ledger entry is single source of truth for as 
// SO we let an entry be created but do not allow it to be changed at any time in future
//  for prevension we create some hooks

// error if someone tries to modify our ledger entries
function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified");
}

