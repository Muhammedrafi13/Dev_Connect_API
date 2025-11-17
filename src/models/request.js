const mongoose = require('mongoose');

const request = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`,
            }
        }
    }
    , {
        timestamps: true,
    }
);

request.index({ fromUserId: 1, toUserId: 1 })

request.pre('save', async function (next) {
    const request = this;
    if (request.fromUserId.equals(request.toUserId)) {
        throw new Error("Cannot send connection request to yourself")
    }
    next();
})

module.exports = mongoose.model("Request", request);
