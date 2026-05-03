const express = require("express")
const cookieParser = require("cookie-parser")


const app = express()

app.use(express.json()) // app can read data under req.body
app.use(cookieParser())


/**
 * - Routes required
 */
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")

/**
 * - use Routes
 */

app.get("/",(req, res)=> {
    res.send("Ledger Service is up and running") // demo api to test if server is running in depolyment, and isn't down
})

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)


module.exports = app;