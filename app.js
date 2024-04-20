const express = require('express');
const app = express();
const PORT = 8000;

app.use(express.json())

require('dotenv').config();

const db = require("./config/db").connect();

const router = require("./routers/router")

app.use("/", router)

app.listen(PORT, () => {
    console.log('app is running on port %d', PORT);
})


