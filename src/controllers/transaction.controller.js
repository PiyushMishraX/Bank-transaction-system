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




module.exports = {
    createTransaction
}