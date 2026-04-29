const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const emailService = require("../services/email.service")

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

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body; // validate if accounts even exists or not, the user is using his account or not ( not others users account )
    // and creating intial funding to an acc ount from system account
}

async function createInitailFundsTransaction(req, res){
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
            message: "System user account not foundt"
        })
    }


    //  transaction

    const transaction = await transactionModel.create({
        fromAccount: fromAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    }, { session })

    // ledger entry debit
    const debitLedgerEntry = await ledgerModel.create({
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
    }, { session })

    const creditLedgerEntry = await ledgerModel.create({
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }, { session })

}




module.exports = {
    createTransaction,
    createInitailFundsTransaction
}