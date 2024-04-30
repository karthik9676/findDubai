const mongoose = require("mongoose");

const mobileOtpSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    }
});
const MobileOtpData = mongoose.model("MobileOtpData", mobileOtpSchema);

module.exports = MobileOtpData;