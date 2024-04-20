const mongoose = require('mongoose')
const {mailsender} = require('../middleware/mailsender')

// This schema represents the OTPs associated with an email. 
// This makes sure the OTPs are unique, and makes sure you have to use the correct OTP

const OTP = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 15
    }
})


async function verification(email, otp) {
    try {
        const mail = await mailsender(
            email, 
            "OPT code for your verification",
            `<p> here is your OTP code:-> ${otp} </p> 
            `
        ) 
        console.log("Mail sent successfully")

    } catch (error){
        console.log("Issue with sending emails")
    }
}

// Before saving the record, call verification() to automatically send a verification email to user
OTP.pre("save", async function (next) {
    console.log("New document saved to the database");
    // Only send an email when a new document is created
    if (this.isNew) {
      await verification(this.email, this.otp);
    }
    next();
})
module.exports = mongoose.model("OTP", OTP);



