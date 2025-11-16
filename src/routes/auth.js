const express = require("express");
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { validateSignUpData } = require("../utils/validation");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {

        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });


        await user.save();
        res.send("User Added Succesfully")
    } catch (error) {
        res.send("something went wrong", error)
    }


})

router.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid Credentials");

        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();

            res.cookie("token", token,{
                expires: new Date(Date.now() + 8 * 36000000)
            });
            res.send(user);
        } else {
            throw new Error('Invalid Credentials')
        }
    } catch (err) {
        res.status(400).send("Error" + err.message)
    }
})

router.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    }).send("Logout Sucessfull");
})




module.exports = router;