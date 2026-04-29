const { Router } = require('express')
const authMiddleware = require("../middleware/auth.middleware")
const transactionController = require("../controllers/transaction.controller")

const transactionRoutes = Router();


/**
 * - POST /api/transactions/
 * - Create a new transaction
 */

transactionRoutes.post("/", authMiddleware.authMiddleware, transactionController.createTransaction )

// creating account for system user
/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transacion from system user
 */
transactionRoutes.post("/system/inital-funds", authMiddleware.authSystemUserMiddleware , transactionController.createInitialFundsTransaction)




module.exports = transactionRoutes