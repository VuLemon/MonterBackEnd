const mongoose = require('mongoose');

require('dotenv').config()

const URL = process.env.DB_URL;

exports.connect = () => {
    try{
        const db = mongoose.connect(URL)
        console.log("Connecting to DB successful")
    } catch (error) {
        console.log("error in connection to DB")
    }
}


