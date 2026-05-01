// one person can have multiple transaction accounts so creating seperate account model in better

const mongoose = require("mongoose")
const ledgerModel = require("./ledger.model")

const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, // here we enter the objectid of the usermodel
        ref: "user", // name of usermodel,
        required: [true, "Account must be associated with a user"],
        index: true // (optimise) when we search for a users account the can be easily and efficiently searched with this feature ( B+ tree data structure is used in mongodb for this )

    },
    status: { // account uis working , froxen or closed
        type: String, // message needs to be string 
        enum: {
            values: [ "ACTIVE", "FROZEN", "CLOSED"],
            message: "Status can be either ACTIVE, FROZEN OR CLOSED",
        },
        // An enum is a validation constraint that restricts a field's value to a specific, predefined set of allowed options.

        default: "ACTIVE" // account by deafult active at time of cration
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    },
    //  we do not hardcode(directly store) balance in the databse we use cache , ledger etc

    // to identify account of system user
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }

}, {
    timestamps:true
})


// (optimise) another index ( compount index ) // we can find using status too // compund index , searching based on both -> id and status
accountSchema.index({user:1, status:1})

// this method can be directly called fromt the file which uses the accountSchema 
accountSchema.methods.getBalance = async function () {

    // aggregation pipelines helps to run custom queries on db
    // the pipe line accepts and array with steps written in it
    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id}}, // find all ledger entries

        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond:[
                            {$eq: ["$type", "DEBIT"] },
                            "amount", // type debit than add amount else zero
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond:[
                            {$eq: ["$type", "CREDIT"] },
                            "amount", // type debit than add amount else zero
                            0
                        ]
                    }
                }
            }
        }
    ])
    
}


const accountModel = mongoose.model("account", accountSchema)

module.exports = accountModel;