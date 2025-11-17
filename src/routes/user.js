const express = require("express");
const { userAuth } = require('../middlewares/auth');
const Request = require("../models/request");
const User = require("../models/user");

const router = express.Router();


router.get("/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await Request.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "about", "skills"])

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        })
    } catch (err) {
        req.statusCode(400).send("Error " + err.message);
    }
});

router.get("/connections", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const connectionRequests = await Request.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "about", "skills","photoUrl"])
            .populate("toUserId", ["firstName", "lastName", "age", "gender", "about", "skills","photoUrl"]);
        const connections = connectionRequests.map((request) => {
            if (request.toUserId._id.equals(loggedInUser._id)) {
                return request.fromUserId;
            } else {
                return request.toUserId;
            }
        });
        res.json({ connections });
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})

router.get("/feed", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = limit * (page-1);

        const connectionRequest = await Request.find({
            $or: [
                {
                    fromUserId: loggedInUser._id
                },
                {
                    toUserId: loggedInUser._id
                }
            ],
        }).select("fromUserId toUserId").skip(skip).limit(limit);

        const hideUsersFromFeed = new Set();

        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId._id.toString()),
                hideUsersFromFeed.add(req.toUserId._id.toString())
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ],

        }).select("firstName lastName photoUrl age gender about skills")


        res.json({
            message: 'feed data',
            data: users,
        })

    } catch (err) {
        res.status(400).send("Error " + err.message);
    }
})

module.exports = router;



