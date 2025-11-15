require('dotenv').config();
const express = require('express');
const connectDB = require("./config/database");
const CookieParser = require("cookie-parser");
const app = express();



app.use(express.json());
app.use(CookieParser());

const auth = require("./routes/auth");
const profile = require("./routes/profile");
const request = require("./routes/request");

app.use("/",auth);
app.use("/profile",profile);
app.use("/request",request);





connectDB().then(() => {
    app.listen(7000, () => {
        console.log("Server is Successfully lisitening on port 7000");
    })
}).catch(err => {
    console.error("something went wrong", err)
})

