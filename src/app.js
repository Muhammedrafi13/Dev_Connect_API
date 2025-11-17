const express = require('express');
const connectDB = require("./config/database");
const CookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const app = express();
require('dotenv').config();

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
}))
app.use(express.json());
app.use(CookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat")
const initializeSocket = require('./utils/socket');

app.use("/",authRouter);
app.use("/profile",profileRouter);
app.use("/request",requestRouter);
app.use("/user",userRouter);
app.use("/chat",chatRouter)

const server = http.createServer(app);
initializeSocket(server);


connectDB().then(() => {
    server.listen(7777, () => {
        console.log("Server is Successfully lisitening on port 7777");
    })
}).catch(err => {
    console.error("something went wrong", err)
})

