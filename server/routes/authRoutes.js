const express = require("express");
const { SignupController, loginController, OtpController, verifyOtpController, MobileOtpGenerator, MobileOtpVerify, SigninController, SigninVerifyController, SigninPasswordController, UserController,  } = require("../controllers/authController");
const jwtAuth = require("../middlewares/jwtAuth");

const router = express.Router();

// Register Route
router.route("/signup").post(SignupController);

// login Route
router.route("/login").post(loginController);

// send otp to mail
router.route("/sendotp").post(OtpController);

// verifying otp
router.route("/verifyotp").post(verifyOtpController);

// send mobile otp
router.route("/send-otp").post(MobileOtpGenerator);
// verify mobile otp
router.route("/verify-otp").post(MobileOtpVerify);


// testing signing route
router.route("/signin").post(SigninController);

router.route("/signinverify").post(SigninVerifyController);

router.route("/login2").post(SigninPasswordController);

router.route("/user").get(jwtAuth, UserController);
    
    


module.exports = router;