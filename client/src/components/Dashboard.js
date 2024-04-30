import React, { useEffect } from 'react';
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    let navigate = useNavigate();

    const checkValidUser = () => {
      const token = Cookies.get("findDubai_jwt");
      if (token === undefined) {
        toast.error("Please Login to View Dashboard");
        navigate("/signin");
      }
    };

  useEffect(() => {
    checkValidUser();
  }, [checkValidUser]);

  return (
    <div>
      <h1>Dashboard Page</h1>
    </div>
  )
}

export default Dashboard
