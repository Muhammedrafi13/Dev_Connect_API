const jwt = require('jsonwebtoken');
const User = require("../models/user");

const userAuth = async (req, res, next) => {

    try {
        const cookies = req.cookies;
        const { token } = cookies;

        if (!token) {
            throw new Error("Invalid Token");
        }

        const decodeMessage = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodeMessage;
        const user = await User.findById(_id).select('-password');
        if (!user) {
            throw new Error("User doesn't exist");
        } 
        req.user= user;
        next();
    } catch (err) {
        res.status(401).send("User is invalid");
    }

}

module.exports = {
    userAuth,
};