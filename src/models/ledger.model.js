const mongoose = require("mongoose")

/** <<<---- LEDGER SCHEMA ---->>> */

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


//     <<<----- MODIFICATION / DELETION PROVENTION ----->>>

// A ledger entry is single source of truth for as 
// SO we let an entry be created but do not allow it to be changed at any time in future
//  for prevension we create some hooks

// error if someone tries to modify our ledger entries
function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified");
}

// PREVENTIONS ---->>>
// Prevent ledger modification ( stopping and gving error for these modification(updation/deletion) operations)
ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('remove',preventLedgerModification);
ledgerSchema.pre('deleteMay',preventLedgerModification);
ledgerSchema.pre('updateMany',preventLedgerModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerModification);
ledgerSchema.pre('findOneAndReplace',preventLedgerModification);




const ledgerModel = mongoose.model("ledger", ledgerSchema);


module.exports = ledgerModel;