import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";

const VerifyOtp = () => {
  let navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const location = useLocation();
  console.log((location));

  const submitOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:7000/auth/signinverify",
        {
          otp,
          emailOrPhone: location.state,
        }
      );
      // console.log(response)
      toast.success(response.data.message);
      navigate("/");
      if (response.data.success === true) {
        Cookies.set("findDubai_jwt", response.data.token, {expires : 30 / (24*60)});
      }
      setOtp("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  
  return (
    <div className='login_container d-flex justify-content-center align-items-center'>
      <form className="text-center mt-5" onSubmit={submitOtp}>
        <div className="mb-3 text-start">
          <input
            type="text"
            className="form-control otp_input"
            placeholder="Enter Otp here"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary verify_btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default VerifyOtp;
