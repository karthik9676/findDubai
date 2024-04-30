import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaCogs } from 'react-icons/fa';
import '../main.css';

const SideNavbar = () => {
  return (
    <div className=" ">
      <NavLink to="/" className="sidebar_brand">
        Admin
      </NavLink>

      <ul className=" list-unstyled d-flex flex-column justify-content-center align-items-between">
        <li className="w-100 my-3">
          <NavLink to="/admin/users" className="side_link_style">
            <span className="icon_span">
              <FaUser />
            </span>
            <span className=" d-none d-md-inline ">Users</span>
          </NavLink>
        </li>
        <li className="w-100">
          <NavLink to="/admin/services" className="side_link_style">
            <span className="icon_span">
              <FaCogs />
            </span>
            <span className=" d-none d-md-inline ">Services</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideNavbar;








