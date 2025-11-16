const express = require('express');
const { userAuth } = require('../middlewares/auth');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt')



router.get("/view", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send("Error" + err.message);
    }
})


router.patch("/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();

        res.send("Edit was successfull")

    } catch (err) {
        res.status(400).send("Error" + err.message);
    }
})


router.patch("/password", userAuth, async (req, res) => {
    try {
        const { existingPassword, newPassword } = req.body;
        const user = await User.findOne({ emailId: req.user.emailId })
        if (!user) {
            throw new Error("Invalid Credentials");

        }
        const isPasswordValid = await user.validatePassword(existingPassword);
        const passwordHash = await bcrypt.hash(newPassword, 10)
        if (isPasswordValid) {
            await User.updateOne({ _id: user._id }, {
                $set: {
                    password: passwordHash
                }
            });

            res.send("password has udpated succesfully")
        } else{
            throw new Error("passowrd is wrong")
        }

    } catch (err) {
        res.status(400).send("Error" + err.message);
    }
})

module.exports = router;