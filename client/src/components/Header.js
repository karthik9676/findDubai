
import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';



const Header = () => {
  let navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);




  const logoutHandler = () => {
    Cookies.remove('findDubai_jwt');
    Cookies.remove('findDubai_admin');
    setIsLoggedIn(true);
    setIsAdmin(false);
    toast.success("Logged Out");
    // navigate("/login");
  };


  useEffect(() => {
    const token = Cookies.get('findDubai_jwt');
    if (token !== undefined) {
      setIsLoggedIn(false) 
    }
    else {
      setIsLoggedIn(true)
    }

    const admin = Cookies.get('findDubai_admin');
    if (admin === 'true') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  },[logoutHandler]);
  

  

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar_container">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand brand_style">
            Find<span className="span_style">DuBai</span>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav mx-auto">
              <NavLink to="/" className="link_style ">
                Home
              </NavLink>
              <NavLink to="/dashboard" className="link_style ">
                Dashboard
              </NavLink>
              {
                isAdmin && 
                <NavLink to="admin" className="link_style">
                    Admin
                  </NavLink>
              }
              {isLoggedIn ? (
                <>
                  <NavLink to="/register" className="link_style ">
                    Register
                  </NavLink>
                  <NavLink to="/signin" className="link_style ">
                    SignIn
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    onClick={logoutHandler}
                    to="/signin"
                    className="link_style "
                  >
                    Logout
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header

