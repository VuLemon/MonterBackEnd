const nodemailer = require('nodemailer')
require('dotenv').config()

const HOST = process.env.MAIL_HOST
const USER = process.env.MAIL_USERNAME
const PASSWORD = process.env.MAIL_PASSWORD


exports.mailsender = async (recipients, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: HOST,
        auth: {
          user: USER,
          pass: PASSWORD
        }
      });
    
    const mailOptions = {
        from: USER,
        to: recipients,
        subject: subject,
        text: text
    }
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message)
        }
    })
}
