import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import SideNavbar from './SideNavbar';
import '../main.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const getAllUsers = async () => {
    const token = Cookies.get("findDubai_jwt");
    console.log(token);
    try {
      const response = await axios.get("http://localhost:7000/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data.users);
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // console.log(users)
  return (
    <div className="container-fluid">
      <div className=" row">
        <div className="bg-dark col-2 col-md-2 min-vh-100">
          <SideNavbar />
        </div>
        <div className=" col-10">
          <div className=" border border-1 flex-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  return (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>
                        <button>Update</button>
                      </td>
                      <td>
                        <button>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
