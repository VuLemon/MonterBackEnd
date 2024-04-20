const express = require('express')
const router = express.Router()

const {register, login, sendOTP} = require('../controllers/controller')


router.post('/register', register)
router.post('/login', login)
router.post('/sendOTP', sendOTP)

module.exports = router

