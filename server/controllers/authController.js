const UserData = require("../models/userModel");
const OtpData = require("../models/loginOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const generateOtp = require("../utils/generateOtp");
const session = require("express-session");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const axios = require("axios");
const MobileOtpData = require("../models/mobileOtpModel");

// oauth
const clientId = "1075241414891-u3nmrc4kerssepargjcvcdqmjg3h5mcg.apps.googleusercontent.com";
const clientSecret = "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";

// Api key for fast2sma
const apiKey = 'gabhWOpUn94ri3fE2PqFt7mTIjoAle8HkxKS0VzNJQwvRGLsM6jZLT9kamqK7WzSGA3sorN2ypl0D8tu';

///// Signup controller
exports.SignupController = async (req, res) => { 
    try {
        // console.log(req.body)
        const { name, email, phoneNumber, password } = req.body;
        const isExist = await UserData.findOne({ email: email })
        if (!isExist) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new UserData({ name, email, phoneNumber, password:hashedPassword });
            user.save();
            return res.status(201).send({ success: true, message: "User Registered Successfully"});
        }
        else {
            return res.status(200).send({ success: false, message: "User Already Registered, Please Login" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};


// login with password controller
exports.loginController = async (req, res) => { 
  try {
      // console.log(req.body)
    const { email, password, rememberMe } = req.body;
    // console.log(rememberMe)
    const user = await UserData.findOne({ email });
    // if user not found
    if (!user) {
      return res.status(400).send({success:false, message:"Invalid credentials"})
    }
    // locking user for 24 hrs
    if (user.lockTime > new Date()) {
      return res.status(401).send({ success: false, message: `Your account is locked try after 24 Hours`, time: user.lockTime.toLocaleTimeString() });
    }
    // password check
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    // console.log(isPasswordMatched)
    if (isPasswordMatched) {
      user.loginCount = 0;
      // console.log(user.loginCount)
      let payload = {
        id: user._id
      };
      let token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: rememberMe ? "2d" : "1hrs" });
      await user.save();
      return res.status(200).send({ success: true, message: "Login Success", token: token });
    } else {
      user.loginCount++;
      if (user.loginCount === 3) {
        user.lockTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
      res.status(400).send({success:false, message:"Wrong password", failedAttempts: user.loginCount})
    }
    await user.save();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal server Error" });
  }
};

// otp generator controller
exports.OtpController = async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "karthikreddy7877@gmail.com",
      pass: "fbrqwbdatrtkcwpw",
    },
  });

  try {
    
    const user = await UserData.findOne({ email });
    if (user) {
      // console.log("user found");
      const otp = generateOtp();
      // console.log(otp);
      const existEmail = await OtpData.findOne({ email: email });
      if (existEmail) {
        const updateData = await OtpData.findByIdAndUpdate({ _id: existEmail._id }, {
          otp: otp
        });
        await updateData.save();
        const options = {
          from: "karthikreddy7877@gmail.com",
          to: email,
          subject: "otp for login",
          text: `otp : ${otp} `,
        };
        await transporter.sendMail(options);
        return res
          .status(200)
          .send({ success: true, message: "OTP sent to your mail" });
      }
      else {
        const saveOtpData = new OtpData({
          email: email,
          otp: otp
        });
        await saveOtpData.save();
        const options = {
          from: "karthikreddy7877@gmail.com",
          to: email,
          subject: "OTP for login from FINDDubai",
          text: `OTP : ${ otp } `,
        };
        await transporter.sendMail(options);
        return res
          .status(200)
          .send({ success: true, message: "OTP sent to your mail" });
      }
    } else {
      // console.log("not found");
      return res.status(400).send({ success: false, message: "User Not Registered" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server Error" });
  }
};

// otp verify and login controller
exports.verifyOtpController = async (req, res) => { 
  try {
    // console.log(req.body)
    const { email, otp } = req.body;
    const user = await OtpData.findOne({ email });
    // console.log(user)
    if (user.otp === otp) {
      let payload = {
        id: user._id
      };
      let token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1hr" });
      return res.status(200).send({success:true, message:"Login Success", token:token})
    }
    else {
      return res.status(400).send({success:false, message:"Wrong Otp"})
    }
  } catch (error) {
    console.log(error)
  }
};

//  Mobile otp generator
exports.MobileOtpGenerator = async (req, res) => {
  const { phoneNumber } = req.body;
  // console.log(phoneNumber)
  const otp = Math.floor(1000 + Math.random() * 9000);
  try {
    const user = await UserData.findOne({ phoneNumber });
    if (user) {
      // console.log("user found");
      // const otp = generateOtp();
      // console.log(otp);
      const existPhone = await MobileOtpData.findOne({
        phoneNumber: phoneNumber,
      });
      if (existPhone) {
        const updateData = await MobileOtpData.findByIdAndUpdate(
          { _id: existPhone._id },
          {
            otp: otp,
          }
        );
        await updateData.save();
        const response = await axios.post(
          "https://www.fast2sms.com/dev/bulkV2",
          {
            route: "q",
            message: `Your OTP is: ${otp}`,
            language: "english",
            numbers: phoneNumber,
          },
          {
            headers: {
              Authorization: apiKey,
            },
          }
        );
        return res.send({ success: true, message:"Otp Sent to Mobile", messageData: response.data, otp });
      } else {
        const saveOtpData = new MobileOtpData({
          phoneNumber: phoneNumber,
          otp: otp,
        });
        await saveOtpData.save();
        const response = await axios.post(
          "https://www.fast2sms.com/dev/bulkV2",
          {
            route: "q",
            message: `Your OTP is: ${otp}`,
            language: "english",
            numbers: phoneNumber,
          },
          {
            headers: {
              Authorization: apiKey,
            },
          }
        );
        return res.send({ success: true, message:"Otp Sent to Mobile", messageData: response.data, otp });
      }
    } else {
      // console.log("not found");
      return res
        .status(400)
        .send({ success: false, message: "Mobile number Not Registered" });
    }
  } catch (error) {
    // console.error("Failed to send OTP:", error.response.data);
    console.error("Failed to send OTP:");
    res.status(500).send({ success: false, error: "Failed to send OTP" });
  }
};


// mobile otp verify and login controller
exports.MobileOtpVerify = async (req, res) => { 
  try {
    // console.log(req.body)
    const { phoneNumber, otp } = req.body;
    const user = await MobileOtpData.findOne({ phoneNumber });
    // console.log(user)
    if (user.otp === otp) {
      let payload = {
        id: user._id
      };
      let token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1hr" });
      return res.status(200).send({success:true, message:"Login Success", token:token})
    }
    else {
      return res.status(400).send({success:false, message:"Wrong Otp"})
    }
  } catch (error) {
    console.log(error)
  }
};



// signin controller
exports.SigninController = async (req, res) => {
  // console.log(req.body)
  const { emailOrPhone } = req.body;
  const otp = generateOtp();
  try {
    const mailUser = await UserData.findOne({ email: emailOrPhone });
    const mobileUser = await UserData.findOne({ phoneNumber: emailOrPhone });
    const user = await UserData.findOneAndUpdate(
      { $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }] },
      { otp },
      { new: true }
    );
    if (!user) {
      return res.status(400).send({ success:false, message:"User Not Found"});
    } else {
      if (mailUser) {
        // for mail user otp sending code
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "karthikreddy7877@gmail.com",
            pass: "fbrqwbdatrtkcwpw",
          },
        });
        const options = {
          from: "karthikreddy7877@gmail.com",
          to: emailOrPhone,
          subject: "otp for login",
          text: `otp : ${otp} `,
        };
        await transporter.sendMail(options);
        return res
          .status(200)
          .send({ success: true, message: "OTP sent to your mail" });
      }
      if (mobileUser) {
        // console.log("mobile user")
        const response = await axios.post(
          "https://www.fast2sms.com/dev/bulkV2",
          {
            route: "q",
            message: `Your OTP is: ${otp}`,
            language: "english",
            numbers: emailOrPhone,
          },
          {
            headers: {
              Authorization: apiKey,
            },
          }
        );
        return res.status(200).send({ success: true, message:"Otp sent to your Mobile" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: "false", message: "Internal Server Error" });
  }
};

// signin verify otp
exports.SigninVerifyController = async (req, res) => {
  const { otp, emailOrPhone} = req.body;
  try {
    const user = await UserData.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    });
    // console.log(user)
    if (!user) {
      return res.status(404).send({ success:false, message:"User Not found"});
    }
    if (user.otp !== otp) {
      return res.status(401).send({success:false,  message: 'Invalid OTP' });
    }
    // Clear OTP after successful verification
    await UserData.updateOne({ _id: user._id }, { $unset: { otp: null } });
    let payload = {
      id: user._id
    };
    let token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1hr" });
    return res.status(200).send({success:true, message:"Login Success", token:token})
  } catch (error) {
    console.log(error);
  }
}

// signin with password controller
exports.SigninPasswordController = async (req, res) => { 
  const { loginData, rememberMe } = req.body;
  const { emailOrPhone, password } = loginData;
  try {
    const user = await UserData.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    });
    // console.log(user)
    // if user not found
    if (!user) {
      return res.status(400).send({success:false, message:"User is Not Registered"})
    }
    // locking user for 24 hrs
    if (user.lockTime > new Date()) {
      return res.status(401).send({ success: false, message: `Your account is locked try after 24 Hours`, time: user.lockTime.toLocaleTimeString() });
    }
    // password check
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    // console.log(isPasswordMatched)
    if (isPasswordMatched) {
      user.loginCount = 0;
      // console.log(user.loginCount)
      let payload = {
        id: user._id
      };
      // let token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: rememberMe ? "5d" : "2d" });
      let token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '2hr' });
      await user.save();
      return res.status(200).send({ success: true, adminCheck:user.admin,  message: "Login Success", token: token });
    } else {
      user.loginCount++;
      if (user.loginCount === 3) {
        user.lockTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
      res.status(400).send({success:false, message:"Wrong password!!!", failedAttempts: user.loginCount})
    }
    await user.save();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Internal server Error" });
  }
};

// user controller
exports.UserController = async (req, res) => {
  try {
    // console.log(req.user)
    const userDetails = req.user;
    return res.status(200).send({message:"user data", userDetails})
  } catch (error) {
    console.log(error)
  }
}

// testing signin controller
// exports.SigninController = async (req, res) => {
//   // console.log(req.body)
//   const { emailOrPhone } = req.body;
//   try {
//     const user = await UserData.findOne({
//       $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
//     });
//     if (user) {
//       // user found
//       const mailUser = await UserData.findOne({ email: emailOrPhone });
//       const mobileUser = await UserData.findOne({ phoneNumber: emailOrPhone });
//       // for email user
//       if (mailUser) {
//         const otp = generateOtp();
//         let transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//             user: "karthikreddy7877@gmail.com",
//             pass: "fbrqwbdatrtkcwpw",
//           },
//         });
//         const existEmail = await OtpData.findOne({ email: emailOrPhone });
//         if (existEmail) {
//           // if user is already exist
//           const updateData = await OtpData.findByIdAndUpdate(
//             { _id: existEmail._id },
//             {
//               otp: otp,
//             }
//           );
//           await updateData.save();
//           const options = {
//             from: "karthikreddy7877@gmail.com",
//             to: emailOrPhone,
//             subject: "otp for login",
//             text: `otp : ${otp} `,
//           };
//           await transporter.sendMail(options);
//           return res
//             .status(200)
//             .send({ success: true, message: "OTP sent to your mail" });
//         } else {
//           // for new user
//           const saveOtpData = new OtpData({
//             email: emailOrPhone,
//             otp: otp,
//           });
//           await saveOtpData.save();
//           const options = {
//             from: "karthikreddy7877@gmail.com",
//             to: emailOrPhone,
//             subject: "OTP for login from FINDDubai",
//             text: `OTP : ${otp} `,
//           };
//           await transporter.sendMail(options);
//           return res
//             .status(200)
//             .send({ success: true, message: "OTP sent to your mail" });
//         }
//       }
//       // for mobile user
//       if (mobileUser) {
//         const otp = Math.floor(1000 + Math.random() * 9000);
//         console.log(otp);
//         const existPhone = await MobileOtpData.findOne({
//           phoneNumber: emailOrPhone,
//         });
//         if (existPhone) {
//           // for existing number
//           const updateData = await MobileOtpData.findByIdAndUpdate(
//             { _id: existPhone._id },
//             {
//               otp: otp,
//             }
//           );
//           await updateData.save();
//           const response = await axios.post(
//             "https://www.fast2sms.com/dev/bulkV2",
//             {
//               route: "q",
//               message: `Your OTP is: ${otp}`,
//               language: "english",
//               numbers: emailOrPhone,
//             },
//             {
//               headers: {
//                 Authorization: apiKey,
//               },
//             }
//           );
//           return res.send({ success: true, messageData: response.data, otp });
//         } else {
//           // for new number
//           const saveOtpData = new MobileOtpData({
//             phoneNumber: emailOrPhone,
//             otp: otp,
//           });
//           await saveOtpData.save();
//           const response = await axios.post(
//             "https://www.fast2sms.com/dev/bulkV2",
//             {
//               route: "q",
//               message: `Your OTP is: ${otp}`,
//               language: "english",
//               numbers: emailOrPhone,
//             },
//             {
//               headers: {
//                 Authorization: apiKey,
//               },
//             }
//           );
//           return res.send({ success: true, messageData: response.data, otp });
//         }
//       } else {
//         // console.log("not found");
//         return res
//           .status(400)
//           .send({ success: false, message: "Mobile number Not Registered" });
//       }
//     } else {
//       // user not found
//       return res
//         .status(400)
//         .send({ success: false, message: "User Not Registered" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// testing-2 signin controller
// exports.SigninController = async (req, res) => {
//   // console.log(req.body)
//     const { emailOrPhone, password } = req.body;
//     try {
//         const user = await UserData.findOne({
//           $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
//         });
//       const mailUser = await UserData.findOne({ email: emailOrPhone });
//       // console.log(mailUser)
//       const mobileUser = await UserData.findOne({ phoneNumber: emailOrPhone });
//       // console.log(mobileUser)
      
//         // console.log(user)
//         // if (!user) {
//         //   return res.status(404).json({ error: 'User not found' });
//         // }
//         // const isPasswordValid = await bcrypt.compare(password, user.password);
//         // if (!isPasswordValid) {
//         //   return res.status(401).json({ error: 'Invalid password' });
//         // }
//         // const token = jwt.sign({ userId: user._id }, 'secret_key'); // Replace 'secret_key' with your own secret key
//         // res.json({ token });
//       } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error' });
//       }
// }







//Testing mobile otp generator

// exports.MobileOtpGenerator = async (req, res) => { 
//   const { phoneNumber } = req.body;
//   console.log(phoneNumber)
//   const otp = Math.floor(1000 + Math.random() * 9000);
//   try {
//     const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
//             route: 'q',
//             message: `Your OTP is: ${otp}`,
//             language: 'english',
//             numbers: phoneNumber,
//         }, {
//             headers: {
//                 Authorization: apiKey,
//             }
//         });
//         // console.log(response.data);
//         res.send({ success: true, messageData:response.data, otp });
//   } catch (error) {
//     console.error('Failed to send OTP:', error.response.data);
//     res.status(500).send({ success: false, error: 'Failed to send OTP' });
//   }
// };








//  Login controller

// exports.loginController = async (req, res) => {
//   try {
//       // console.log(req.body)
//       const { email, password } = req.body;
//     const isExist = await UserData.findOne({ email });
//       if (isExist) {
//           const isPasswordMatched = await bcrypt.compare(password, isExist.password);
//           if (isPasswordMatched) {
//               let payload = {
//                   id : isExist._id
//               }
//               let token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1hr" });
//               // console.log(token)
//               return res.status(200).send({
//                   success: true,
//                   message: "Login Success",
//                   token
//                 });
//           } else {
//             return res.status(400).send({ success: false, message: "Wrong Password" });
//           }
//       }
//       else {
//         return res.status(400).send({ success: false, message: "Email Does not Exist!!!" });
//       }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ success: false, message: "Internal server Error" });
//   }
// };


// testing login controller successfull

// exports.loginController = async (req, res) => { 
//   try {
//       // console.log(req.body)
//     const { email, password } = req.body;
//     const user = await UserData.findOne({ email });
//     // if user not found
//     if (!user) {
//       return res.status(400).send({success:false, message:"Invalid credentials"})
//     }
//     // locking user for 24 hrs
//     if (user.lockTime > new Date()) {
//       return res.status(401).send({success:false, message:"Your account is locked for 24 hours", time:user.lockTime.toLocaleTimeString()})
//     }
//     // password check
//     const isPasswordMatched = await bcrypt.compare(password, user.password);
//     // console.log(isPasswordMatched)
//     if (isPasswordMatched) {
//       user.loginCount = 0;
//     } else {
//       user.loginCount++;
//       if (user.loginCount >= 3) {
//         user.lockTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
//       }
//     }
//     await user.save();
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ success: false, message: "Internal server Error" });
//   }
// };

