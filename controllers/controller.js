const mongoose = require('mongoose')
const user = require("../models/user")



exports.register = async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body)
    if (!email || !password) {
        return res.status(400).json({
            message: "Please fill in the required fields"
        })
    }
    try{
        const existingUser = await user.findOne({email})
        if (existingUser){
            return res.status(409).json({
                message: "Email already registered"
            })
        }
        const newUser = await user.create({
            email, password
        })
        return res.status(200).json({
            message: "Email registered successfully"
        })

    } catch (error) {
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
        const currentUser = await user.findOne({email})
        if (!currentUser){
            return res.status(404).json({
                message: "Account does not exist"
            })
        }
        if (currentUser.password != password) {
            return res.status(401).json({
                message: "Wrong password"
            })
        }

        return res.status(200).json({
            message: "Log in successful"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Error in login process"
        })
    }
}