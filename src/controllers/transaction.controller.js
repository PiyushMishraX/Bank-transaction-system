const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const emailService = require("../services/email.service")
const accountModel = require("../models/account.model")
const mongoose = require("mongoose")


/**
 * - Create new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger ( sufficient balnce on sneder acc)
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */

async function createTransaction(req, res){

    /**
     * 1.Validate request
     */

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body; // validate if accounts even exists or not, the user is using his account or not ( not others users account )
    // and creating intial funding to an acc ount from system account

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,

    })

    if(!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount"
        })
    }

    /**
     * 2. Validate idempotencyKey
     */
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(200).json({
                message: "Transaction is still in processing",
            })
        }

        if(isTransactionAlreadyExists.status === "FAILED"){
            return res.status(500).json({
                message: "Transaction processing failed,please retry"
            })
        }

        if(isTransactionAlreadyExists.status === "REVERSED"){
            return res.status(200).json({
                message: "Transaction was reversed, please retry",
            })
        }
    }

    // transfer ammount only when the accounts aren't frozen
    /**
     * 3. Check account status
     */

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }

    // ( sufficient balnce on sneder acc)
    /**
     * 4. Derive sender balance from ledger 
     */
    const balance = await fromUserAccount.getBalance() // fromUserAccount is derived from accountModel so we can use this function ( if not then  cann't) , we can use it for toUsers account too

    if( balance < amount) {
        return res.status(400).json({
            // message: "Insufficient balance in fromAccount"
            message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount} `
        })
    }

    /**
     * 5. Create transaction (PENDING)
     */

    //creating session // so the step 5-8 will only save when all completed else any one won't be completed and reverted back
    const session = await mongoose.startSession()
    session.startTransaction()

    // create({}, {session})
    // const transaction = new transactionModel({
    //     fromAccount,
    //     toAccount,
    //     amount,
    //     idempotencyKey,
    //     status: "PENDING"
    // })
    // if the same transaction runs twice in small interval and the transaction isn't sasved in db we get two transactions for same idempotecy key so we store it in db and update the status after completion
    const transaction = (await transactionModel.create([ {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    } ] ,{session}))[ 0 ] // at zero position of transaction array

    /**
     *  6. Create DEBIT ledger entry
     */

    // money going -> debit
    // money coming -> credit
    const debitLedgerEntry = await ledgerModel.create( [{
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }]  , { session })
    
    

    /**
     * 7. Create CREDIT ledger entry
     */
    const creditLedgerEntry = await ledgerModel.create( [{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }]  , { session })

    /**
     * 8. Mark transaction COMPLETED
     */ 
    // transaction.status = "COMPLETED"
    // await transaction.save({ session })
   
    // using update method because transaction variable in constant so transaction.status can't be changed this way in db
    await transactionModel.findOneAndUpdate(
        { _id: transaction._id },
        { status: "COMPLETED" },
        { session }
    )
    transaction.status ="COMPLETED"// transaction is being used in response so we have to mark it completed so the response also have complete marked in it  

    /**
     * * 9. Commit MongoDB session
     */

    await session.commitTransaction()
    session.endSession()


    /**
     * * 10. Send email notification
     */

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount,  toAccount)
    // access because of authmiddleware

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction: transaction
    })

        
}

async function createInitialFundsTransaction(req, res){
    const {toAccount, amount, idempotencyKey} = req.body

    // validations
    if(!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        })
    }

    // if account really exists or not check
    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if(!toUserAccount){
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

    // from user account / system
    const fromUserAccount = await accountModel.findOne({
        systemUser: true,
        user: req.user._id
    })

    // fallback if no sytem accounts
    if(!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    //  transaction

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    // ledger entry debit
    const debitLedgerEntry = await ledgerModel.create([ {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
    } ], { session })

    const creditLedgerEntry = await ledgerModel.create([ {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    } ], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: "Inital funds transaction completed successfully",
        transaction: transaction
    })

}




module.exports = {
    createTransaction,
    createInitialFundsTransaction
}