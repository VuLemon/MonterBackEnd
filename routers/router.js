const express = require('express')
const router = express.Router()

const user = require('../models/user')

const {register, login, sendOTP} = require('../controllers/controller')
const {auth} = require('../middleware/auth')



router.post('/register', register)
router.post('/login', login)
router.post('/sendOTP', sendOTP)

router.get('/info', auth, async (req, res) => {
    console.log(req.body)
    const email = req.body.email
    console.log(email)
    const result = await user.findOne({email})
    console.log(result)
    console.log(result)
    res.json({
        user: result,
        message: "Successfully validate JWT"
    })

})

module.exports = router

