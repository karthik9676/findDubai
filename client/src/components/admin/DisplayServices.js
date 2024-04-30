import React from 'react';
import '../main.css';

const DisplayServices = ({ service, editService, deleteService }) => {
    const {_id, name, phoneNumber, category, location} = service
  return (
    <>
      <div className="displayServices_box d-flex align-items-center justify-content-between">
      <div className=''>
      <h3 className="title">Name : {name}</h3>
      <p className="category">Category : {category}</p>
      <p className="phone">Mobile : {phoneNumber}</p>
      <h5 className="location">Location : {location}</h5>
      </div>
      <div className=' d-flex flex-column align-items-center justify-content-center'>
        <button onClick={ ()=>editService(_id)} className=' btn btn-outline-primary edit_btn mb-3'>Edit</button>
        <button onClick={ ()=>deleteService(_id)} className=' btn btn-outline-danger edit_btn'>Delete</button>
      </div>
      </div>
      </>
  );
}

export default DisplayServices
