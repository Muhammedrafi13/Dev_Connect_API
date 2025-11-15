const express = require('express');
const { userAuth } = require('../middlewares/auth');
const router = express.Router();



router.get("/", userAuth, async (req, res) => {
    try {

        res.send("profile is sendnig back");


    } catch (err) {
        res.status(400).send("Error" + err.message);
    }
})

module.exports = router;