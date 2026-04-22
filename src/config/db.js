const mongoose = require("mongoose")

function connectToDB(){

    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Server is connected to DB");
        
    })
    .catch(err=>{
        console.log("Error connecting to DB");
        console.log(err);
        
        process.exit(1)
        
    })
}

async function sendRegistrationEmail(userEmail, name){
    const subject = 'Welcome to Backend Ledger!';
    const text = `Hello ${name},\n\nThank you for registering at Backend Ledger. We're excited to have you on board!,\n\nBest regards,\nThe Backend Ledger team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger team</p>`;

    await sendEmail(userEmail, subject, text , html);
}

module.exports = {
    sendRegistrationEmail
};