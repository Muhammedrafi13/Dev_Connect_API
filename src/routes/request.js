const express = require("express");
const router = express.Router();
const { userAuth } = require('../middlewares/auth');
const Request = require("../models/request");
const User = require("../models/user");

router.post("/send/:status/:toUserId", userAuth, async (req, res) => {
    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const isUserIdValid = await User.findById(toUserId)
        if (!isUserIdValid) {
            return res.status(400).send("invalid user");
        }
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("status is invalid");
        }

        const existingConnectionRequest = await Request.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        });

        if (existingConnectionRequest) {
            return res.status(400).send({ message: "Connection Request Already Existed" })
        }

        const request = new Request({
            fromUserId,
            toUserId,
            status,
        });

        const data = await request.save();

        res.json({
            message: "Connection status sent successfully",
            data,
        })


    } catch (err) {
        res.status(400).send("Error" + err.message);
    }
});

router.post("/review/:status/:requestId",userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("status is invalid")
        }

        const connectionRequst = await Request.findOne({
            _id: requestId,
            status: 'interested',
            toUserId: loggedInUser._id
        })

        if (!connectionRequst) {
            return res.status(400).send("connection is invalid")
        }

        connectionRequst.status = status;
        const data = await connectionRequst.save();
        res.json({ message: "request" + status, data })


    } catch (err) {
        res.status(400).send("error " + err.message)
    }
});

router.get('/sent/interested', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const sentRequests = await Request.find({
            fromUserId: loggedInUserId,
            status: 'interested'
        })
        .populate('toUserId', 'firstName lastName photoUrl age gender about'); 

        if (!sentRequests || sentRequests.length === 0) {
            return res.status(200).json({ 
                message: "No pending requests sent by you.",
                data: []
            });
        }
        res.json({ 
            message: "Sent connection requests retrieved successfully.",
            data: sentRequests
        });

    } catch (err) {
        res.status(500).json({ message: "Server error occurred while fetching sent requests." });
    }
});

module.exports = router;