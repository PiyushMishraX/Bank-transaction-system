const accountModel = require("../models/account.model");

// creating auth middleware first to check wheather a use r is logged in or not ( request comming from valid logged in user)


// the logic of account cration -->>>

async function createAccountController(req,res) {
    
    // we need only userId because everything else have a default value

    const user = req.user;

    const account = await accountModel.create({
        user: user._id
    })// an account created with user id 

    // outcome sent in response
    res.status(201).json({
        account
    })

}

async function getUserAccountController(req, res){

    const accounts = await accountModel.find({user: req.user._id });

    res.status(200).json({
        accounts
    })


}

async function getAccountBalanceController(req, res) {

    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId, //find the account matching th Id
        user: req.user._id // match if the user of that account the one checking balnce
    })


    // two cases - first id not found , second the user isn't the one searching
    if(!account) { 
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}

module.exports = {
    createAccountController,
    getUserAccountController,
    getAccountBalanceController
}