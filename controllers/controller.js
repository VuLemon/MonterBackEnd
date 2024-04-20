// Controllers file. Determine what actions to be taken at endpoints, specified by routers.

const mongoose = require('mongoose')
const user = require("../models/user")
const OTP = require("../models/OTP")
const otp_generator = require('otp-generator')
const jwt = require('jsonwebtoken')

require('dotenv').config // pulls data from .env file. Avoids hardcoding and potential data leak 

const JWT = process.env.JWT_SECRET

exports.register = async (req, res) => {
    const {email, password, work, age, location, otp} = req.body;
    console.log(req.body)
    if (!email || !password || !work || !age || !location || !otp) {
        return res.status(400).json({
            message: "Please fill in the required fields"
        })
    }
    try{
        const existingUser = await user.findOne({email}) // Check if the user is already registered
        if (existingUser){
            return res.status(409).json({
                message: "Email already registered"
            })
        }
        const result = await OTP.find({email}).sort({ createdAt: -1 }).limit(1); // Finds the latest OTP associated with the email
        if (result.length ===0) {
            return res.status(400).json({
                message: 'The email does not exist',
              });
        }
        if (otp !== result[0].otp) { // Check if the provided OTP is correct
            return res.status(400).json({
              message: 'The OTP is not valid',
            });
          }
        const newUser = await user.create({ 
            email, password, work, age, location, otp
        })
        return res.status(200).json({
            message: "Email registered successfully"
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message: "Error in registration process"
        })
    }
}

exports.login = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({
            message: "Please fill in the required fields"
        })
    }
    try{
        const currentUser = await user.findOne({email}) // Check if the user is registered or not
        if (!currentUser){
            return res.status(404).json({
                message: "Account does not exist"
            })
        }
        if (currentUser.password != password) { // Check if password matches
            return res.status(401).json({
                message: "Wrong password"
            })
        }
        const signature = {
            email : user.email,
            id: user._id
        }
        
        let token = jwt.sign(signature, JWT); // Generate jwt signature for logging in
        return res.status(200).json({
            message: "Log in successful",
            token: token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Error in login process"
        })
    }
}

exports.sendOTP = async (req, res) => {
    const {email} = req.body;
    if (!email) {
        return res.status(400).json({
            message: "Please fill in the required fields"
        })
    }
    try {
        const existingUser = await user.findOne({email}) 
        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            })
        }
        let otp = otp_generator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
          })
        
        console.log("generated OTP")

        let duplicate = await OTP.findOne({otp: otp}); // Try to generate a unique OTP. Avoids reusing OTP for multiple accounts
        while (duplicate) {
            console.log("generating OTP")
            otp = otp_generator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
            let duplicate = await OTP.findOne({otp: otp});
        }
        const record = OTP.create({email, otp}) // Creates a record associating an email with a unique OTP
        return res.status(200).json({
            message: "OTP record registered",
            otp: otp
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Error in OTP generation"
        })
    }
    
}
