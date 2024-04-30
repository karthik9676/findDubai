import React, {useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';
import SideNavbar from './SideNavbar';
import '../main.css';
import AdminServices from './AdminServices';

const AdminLayout = () => {
  let navigate = useNavigate();

    const checkValidUser = () => {
      const admin = Cookies.get("findDubai_admin");
      // console.log(admin)
      if (admin === 'false' || admin === undefined) {
        toast.error("Unauthorized user");
        navigate("/");
      }
    };

  useEffect(() => {
    checkValidUser();
  }, [checkValidUser]);
  return (
    <div className=" container-fluid">
      <div className=" row">
        <div className="bg-dark col-2 col-md-2 min-vh-100">
          <SideNavbar />
        </div>
      </div>
      {/* <div>
        <ul>
          <li>
            <NavLink to="/admin/users">Users</NavLink>
          </li>
          <li>
            <NavLink to="/admin/services">Services</NavLink>
          </li>
        </ul>
      </div> */}

      {/* <Outlet /> */}
    </div>


    // <div className=' d-flex'>
    //   <div className='col-auto'>
    //   <SideNavbar/>
    //   </div>
    // </div>
  );
}

export default AdminLayout;
