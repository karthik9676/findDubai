import React, { useState } from 'react';
import {  Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./main.css";


const SigninPage = () => {
  let navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    emailOrPhone: Cookies.get("dubaiUser_emailOrPhone") === undefined ? "" : Cookies.get("dubaiUser_emailOrPhone"),
    password: Cookies.get("dubaiUser_password") === undefined ? "" : Cookies.get("dubaiUser_password"),
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState({});
  const [PasswordErr, setPasswordErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    
    if (e.target.name === "password") {
      if (e.target.value.length < 6) {
        setPasswordErr(true);
      } else {
        setPasswordErr(false);
      }
    }
  };

  const otpHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:7000/auth/signin",
        loginData
      ); // Make sure to handle the actual API endpoint
      // console.log(response.data.message);
      toast.success(response.data.message);
      if (response.data.success === true) {
        navigate("/verifyotp", { state: loginData.emailOrPhone });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    if (rememberMe === true) {
      Cookies.set("dubaiUser_emailOrPhone", loginData.emailOrPhone, {
        expires: 5,
      });
    } else {
      Cookies.remove("dubaiUser_emailOrPhone");
      Cookies.remove("dubaiUser_password");
    }
    if (loginData.emailOrPhone === "") {
      toast.error("Please enter Email or Phone to login");
    }
    else if (loginData.password === "") {
      toast.error("Please Enter the Password")
    }
    else {
      try {
        const response = await axios.post("http://localhost:7000/auth/login2", {
          loginData,
          rememberMe,
        });
        // console.log(response);
        if (response.data.adminCheck === true) {
          Cookies.set("findDubai_admin", response.data.adminCheck)
        }
        else {
          Cookies.set("findDubai_admin", response.data.adminCheck)
        }
        toast.success(response.data.message);
        if (response.data.success === true) {
          // Cookies.set("findDubai_jwt", response.data.token, {expires : 30 / (24*60)});
          Cookies.set("findDubai_jwt", response.data.token);
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        setFailedAttempts(error.response.data.failedAttempts);
        toast.error(error.response.data.message);
      }
    }
  };

  // const loginHandler = async (e) => {
  //   e.preventDefault();
  //   if (rememberMe === true) {
  //     Cookies.set("dubaiUser_emailOrPhone", loginData.emailOrPhone, {expires:7});
  //     Cookies.set("dubaiUser_password", loginData.password, {expires:7});
  //   } else {
  //     Cookies.remove("dubaiUser_emailOrPhone");
  //     Cookies.remove("dubaiUser_password");
  //   }
  //   try {
  //     const response = await axios.post("http://localhost:7000/auth/login2", {
  //       loginData,
  //       rememberMe,
  //     });
  //     console.log(response);
  //     toast.success(response.data.message);
  //     navigate("/");
  //     if (response.data.success === true) {
  //       Cookies.set("findDubai_jwt", response.data.token);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setFailedAttempts(error.response.data.failedAttempts);
  //     toast.error(error.response.data.message);
  //   }
  // };

  return (
    <div className="container login_container ">
      <div className="row">
        {/* image column */}
        <div className="col-12 col-md-6 col-xl-6  d-flex justify-content-center align-items-center image_column d-none d-lg-flex">
          <img
            className='logo_img'
            src="https://res.cloudinary.com/dlsfy08yr/image/upload/v1712299601/4088f3fc6ee5488029158cf005be785b_c97vqd.jpg"
            alt="website logo"
          />
        </div>
        {/* content column */}
        <div className="col-10 col-md-10 col-xl-5 content_column">
          <div className="text-center mt-2 pt-3">
            <h1 className="welcome_text">Welcome back !</h1>
          </div>
          <form className="form_container mt-5">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="email_container">
                <div>
                  <label htmlFor="emailOrPhone" className="text_label">
                    Email or Mobile
                    <span className="span_label">
                      <FaStar />
                    </span>
                  </label>
                </div>
                <div>
                  <input
                    type="text"
                    name="emailOrPhone"
                    id="emailOrPhone"
                    placeholder="Enter Email or Phone"
                    value={loginData.emailOrPhone}
                    onChange={handleChange}
                    className="email_input"
                    required
                  />
                </div>
                <div className=" text-end mb-3 pt-2">
                  <button className=" otp_btn" onClick={otpHandler}>
                    Login with otp
                  </button>
                </div>
              </div>
              <div className="password_main_container">
                <label htmlFor="password" className="text_label">
                  Password{" "}
                  <span className="span_label">
                    <FaStar />
                  </span>
                </label>
                <div className="password_container d-flex justify-content-between">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Enter Password"
                    value={loginData.password}
                    onChange={handleChange}
                    className="password_input"
                    required
                  />
                  <div
                    className="d-flex justify-content-center align-items-center eye_content"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoEyeOff /> : <IoEye />}
                  </div>
                </div>
                <div>
                  {PasswordErr ? (
                    <h2 className="text-danger pt-2">
                      Password length must be above 6 Characters
                    </h2>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="forgot_remember_container pt-2 d-flex justify-content-between align-items-center">
              <div className="rememberme_container d-flex align-items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="checkbox_field"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className="checkbox_label">
                  Remember me
                </label>
              </div>
              <div className="">
                <Link to="/forgotpassword" className="forgot_link">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div className="text-center mt-1">
              <button className=" btn-styling" onClick={loginHandler}>
                LOGIN
              </button>
            </div>
            {/* failed count display */}
            <div className="text-center text-danger">
              {failedAttempts >= 1 ? (
                <h5 className="failed_count">
                  You have left with {3 - failedAttempts} Attempts
                </h5>
              ) : (
                ""
              )}
            </div>
            {/* or login with */}
            <div className="mt-3 d-flex justify-content-center align-items-center">
              <p className="or_login_content">Or Login with</p>
            </div>
          </form>
          {/* login with google*/}
          <div className="google-btn-container d-flex justify-content-center align-items-center">
            <button className="google-btn-styling">
              <span className="span_google">
                <FcGoogle />
              </span>
              Sign in with Google
            </button>
          </div>
          <div className="mt-3 d-flex justify-content-center align-items-center">
            <p className="register_content">Don't have an account?</p>
            <Link className="register_link" to="/register">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;









// // testing with formik

// import React, { useState } from 'react';
// import { NavLink, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Cookies from "js-cookie";
// import "./main.css";
// import { useFormik, Formik, Form, Field } from "formik";
// import { FormValidation } from './FormValidation';

// const initialValues = {
//   emailOrPhone: "",
//   password : "",
//   rememberMe : false
// };

// const SigninPage = () => {
//   const {values, handleBlur, handleChange, handleSubmit, errors} = useFormik({
//     initialValues: initialValues,
//     validationSchema : FormValidation,
//     onSubmit: (values)=> console.log(values)
//   });

//     // let navigate = useNavigate();
//     // const [loginData, setLoginData] = useState({ emailOrPhone: '', password: '' });
//     // const [rememberMe, setRememberMe] = useState(false);
//     // const [failedAttempts, setFailedAttempts] = useState({});

//     // const handleChange = (e) => {
//     //     const { name, value } = e.target;
//     //     setLoginData({ ...loginData, [name]: value });
//     //     // console.log(e.target.value)
//     // };
    
//     // const otpHandler = async (e) => {
//     //   e.preventDefault();
//     //   try {
//     //     // console.log("Form submitted");
//     //     // console.log(loginData);
//     //     const response = await axios.post(
//     //       "http://localhost:7000/auth/signin",
//     //       loginData
//     //     ); // Make sure to handle the actual API endpoint
//     //     // console.log(response.data.message);
//     //     toast.success(response.data.message);
//     //     if (response.data.success === true) {
//     //       navigate("/verifyotp", { state: loginData.emailOrPhone });
//     //     }
//     //   } catch (error) {
//     //     console.log(error);
//     //     toast.error(error.response.data.message);
//     //   }
//     // };

//     // const loginHandler = async (e) => {
//     //     e.preventDefault();
//     //     try {
//     //       const response = await axios.post("http://localhost:7000/auth/login2", {
//     //         loginData,
//     //         rememberMe
//     //       });
//     //       console.log(response)
//     //       toast.success(response.data.message);
//     //       navigate("/");
//     //       if (response.data.success === true) {
//     //         Cookies.set("findDubai_jwt", response.data.token);
//     //       }
          
//     //     } catch (error) {
//     //       console.log(error);
//     //       setFailedAttempts(error.response.data.failedAttempts)
//     //       toast.error(error.response.data.message);
//     //     }
//     //   };

//   return (
//     <div className=" login_container d-flex justify-content-center align-items-center">
//       <Formik
//         initialValues={initialValues}
//         validationSchema={FormValidation}
//       >
//         <Form onSubmit={handleSubmit} className="form_container mt-3">
//           <Field type="text" name="emailOrPhone"></Field>
//           {/* <div className="text-start text-primary mb-5">
//             <h2>Welcome Back!</h2>
//           </div>
//           <div className="">
//             <label className="label_field"> Email / Mobile:</label>
//             <input
//               type="text"
//               name="emailOrPhone"
//               placeholder="Enter Email or Phone"
//               className="form-control"
//               onBlur={handleBlur}
//               onChange={handleChange}
//               value={values.name}
//             />
//             <br />
//             {errors.emailOrPhone && <h5>{errors.emailOrPhone}</h5>}
//           </div>
//           <div className=" text-end mb-3 pt-2">
//             <button className=" otp_btn">Login with otp</button>
//           </div>
//           <div>
//             <label className=" label_field">Password:</label>
//             <input
//               type="text"
//               name="password"
//               placeholder="Enter Password"
//               className="form-control"
//               onBlur={handleBlur}
//               onChange={handleChange}
//               value={values.name}
//             />
//             <br />
//             {errors.password && <h5>{errors.password}</h5>}
//           </div>
//           <div className="pt-3 d-flex align-items-center">
//             <input type="checkbox" className="checkbox_field" />
//             <label className="checkbox_label">Remember me</label>
//           </div>
//           <div className="text-center mt-2">
//             <button type="submit" className=" btn-styling">
//               Login
//             </button>
//           </div> */}
//           {/* failed count display */}
//           {/* <div className="text-center text-danger">
//           {failedAttempts >= 1 ? (
//             <h5 className="failed_count">
//               You have left with {3 - failedAttempts} Attempts
//             </h5>
//           ) : (
//             ""
//           )}
//         </div>
//         <div className="mt-3 mb-3 text-center">
//           <NavLink to="/forgotpassword" className=" nav-link forgot_link">
//             Forgot Password?
//           </NavLink>
//         </div>
//         <div className="mt-3 d-flex justify-content-center align-items-center">
//         <h5 className="register_content">Don't have an account?</h5>
//           <NavLink
//             className="nav-link d-flex justify-content-center align-items-center"
//             to="/register"
//           >
//             <button className=" btn btn-primary mx-3 signup_btn">Sign Up</button>
//           </NavLink>
//         </div> */}
//         </Form>
//       </Formik>
//     </div>
//   );
// }

// export default SigninPage;

