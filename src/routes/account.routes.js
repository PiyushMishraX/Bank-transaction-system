const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")

const router = express.Router()


// protected route means we need a token in cookies or header before creating account ( not like normal account creation where token is generated after registration )

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post("/",authMiddleware.authMiddleware, accountController.createAccountController)




module.exports = router;