const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    loginCount: {
        type: Number,
        default: 0
    },
    lockTime: {
        type: Date,
        default: null
    },
    otp: {
        type: String,
        default: null
    },
    admin: {
        type: Boolean,
        default: false
    }
});

const UserData = mongoose.model("UserData", userSchema);

module.exports = UserData;