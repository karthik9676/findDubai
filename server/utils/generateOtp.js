const otpGenerator = require("otp-generator");


const generateOtp = () => {
    // const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}

module.exports = generateOtp;










// function generateOTP() {
//     // Generate a random 6-digit number
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     return otp.toString(); // Convert to string before returning
//   }
  
//   // Example usage
//   const otp = generateOTP();
//   console.log(otp);