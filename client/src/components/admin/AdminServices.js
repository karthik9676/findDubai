import React, {useEffect, useState} from 'react';
import SideNavbar from './SideNavbar';
import { CiSearch } from "react-icons/ci";
import { useMainContext} from "../context/mainContext";
import '../main.css';
import Addservice from './Addservice';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminServices = () => {
  const {
    isLoading,
    services,
    searchServices,
    saveOnEdit,
    deleteService,
    decrementPage,
    incrementPage,
    getPageNumber,
    page,
    totalPages
  }
    = useMainContext();
  const [searchValue, setSearchValue] = useState("");
  const [serviceId, setServiceId] = useState();
  let navigate = useNavigate();
  const [serviceInput, setServiceInput] = useState({
    name:"",
    email:"",
    phoneNumber:"",
    category:"",
    description:"",
    location:""
});
const onInputChange = (e) => {
    // console.log(e.target.name)
    const { name, value } = e.target;
    setServiceInput({ ...serviceInput, [name]: value });
};

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
  }, []);

  

  
  const onChangeSearchInput = (e) => { 
    setSearchValue(e.target.value);
    searchServices(e.target.value)
  };
  

  const editService = async (_id) => { 
    // console.log(id)
    try {
      setServiceId(_id);
      const res = await axios.get(`http://localhost:7000/services/service/${_id}`);
      // console.log(res.data)
      setServiceInput({
        name: res.data.name,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber,
        category: res.data.category,
        description: res.data.description,
        location: res.data.location
      });
      
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(totalPages)

  let pagesArray = [];
  for (let i = 1; i <= totalPages; i++){
    pagesArray.push(i)
  }
  // console.log(pagesArray)
    
  return (
    <div className=" container-fluid">
      <div className=" row">
        <div className="bg-dark col-2 col-md-2 min-vh-100">
          <SideNavbar />
        </div>
        <div className=" col-10">
          {/* search box*/}
          <div className="mt-5">
            <div className="search_container">
              <input
                type="search"
                name="search"
                id="search"
                className="search_input"
                value={searchValue}
                onChange={onChangeSearchInput}
              />
              <button
                className="search_btn"
                onClick={() => searchServices(searchValue)}
              >
                <CiSearch className="search_icon" />
              </button>
            </div>
            {/*<div className="mt-3">
              <button
                onClick={clearSearch}
                className=" btn btn-danger edit_btn"
              >
                Clear
              </button>
  </div>*/}
          </div>
          {/* adding service */}
          <Addservice />
          {/* displaying services */}
          {isLoading ? (
            <div className=" d-flex justify-content-center align-items-center">
              <div className="lds-dual-ring"></div>
            </div>
          ) : (
            <div>
              {services.length < 1 ? (
                <div className=" d-flex justify-content-center align-items-center">
                  <h1>No results found</h1>
                </div>
              ) : (
                <div className=" d-flex flex-wrap">
                  {services.map((service) => {
                    const { _id, name, category, phoneNumber, location } =
                      service;
                    return (
                      <div
                        key={_id}
                        className="displayServices_box d-flex align-items-center justify-content-between"
                      >
                        <div className="">
                          <h3 className="title">Name : {name}</h3>
                          <p className="category">Category : {category}</p>
                          <p className="phone">Mobile : {phoneNumber}</p>
                          <h5 className="location">Location : {location}</h5>
                        </div>
                        <div className=" d-flex flex-column align-items-center justify-content-center">
                          <button
                            onClick={() => editService(_id, serviceInput)}
                            className=" btn btn-outline-primary edit_btn mb-3"
                            data-bs-toggle="modal"
                            data-bs-target="#editModal"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteService(_id)}
                            className=" btn btn-outline-danger edit_btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {/* edit modal */}
          <div className="my_model">
            <div className="modal model_style" id="editModal">
              <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Find Dubai Services</h4>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    ></button>
                  </div>
                  {/* model body */}
                  <div className="modal-body">
                    <h2>Edit Service</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="input-container text-center pt-4 d-flex align-items-center justify-content-center">
                        <label htmlFor="name" className="add_label">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={serviceInput.name}
                          className="add_input"
                          onChange={onInputChange}
                        />
                      </div>
                      <div className="input-container text-center pt-4 d-flex align-items-center justify-content-center">
                        <label htmlFor="email" className="add_label">
                          Email
                        </label>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          className="add_input"
                          value={serviceInput.email}
                          onChange={onInputChange}
                        />
                      </div>
                      <div className="input-container text-center pt-4 d-flex align-items-center justify-content-center">
                        <label htmlFor="phoneNumber" className="add_label">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          className="add_input"
                          value={serviceInput.phoneNumber}
                          onChange={onInputChange}
                        />
                      </div>
                      <div className="input-container text-center pt-4 d-flex align-items-center justify-content-center">
                        <label htmlFor="category" className="add_label">
                          category
                        </label>
                        <input
                          type="text"
                          name="category"
                          id="category"
                          className="add_input"
                          value={serviceInput.category}
                          onChange={onInputChange}
                        />
                      </div>
                      <div className="input-container text-center pt-4 d-flex align-items-center justify-content-center">
                        <label htmlFor="description" className=" add_label">
                          Description
                        </label>
                        <input
                          type="text"
                          name="description"
                          id="description"
                          className="add_input"
                          value={serviceInput.description}
                          onChange={onInputChange}
                        />
                      </div>
                      <div className="input-container text-center pt-4 d-flex align-items-center justify-content-center">
                        <label htmlFor="location" className="add_label">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          id="location"
                          className="add_input"
                          value={serviceInput.location}
                          onChange={onInputChange}
                        />
                      </div>
                      <div className="input-container text-center pt-2">
                        <button
                          className="btn btn-success save_btn"
                          onClick={() => saveOnEdit(serviceId, serviceInput)}
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-dark save_btn"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* pagination */}
          <nav className=" d-flex justify-content-start mx-3 my-5">
            <ul className="pagination pagination-lg">
              {page !== 1 && (
                <li className="page-item">
                  <button onClick={decrementPage} className="page-link">
                    Previous
                  </button>
                </li>
              )}
              {pagesArray.map((eachPage) => (
                <li
                  className={`page-item ${page === eachPage ? "active" : ""}`}
                  key={eachPage}
                >
                  <button
                    onClick={() => getPageNumber(eachPage)}
                    className="page-link"
                  >
                    {eachPage}
                  </button>
                </li>
              ))}
              <li className="page-item">
                <button onClick={incrementPage} className="page-link">
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default AdminServices;

