// import React, { useState } from 'react';
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useMainContext } from '../context/mainContext';

// const Addservice = () => {
//     const {addService} = useMainContext();
//     const [serviceInput, setServiceInput] = useState({
//         name:"",
//         email:"",
//         phoneNumber:"",
//         category:"",
//         description:"",
//         location:""
//     });
//     const onInputChange = (e) => {
//         // console.log(e.target.name)
//         const { name, value } = e.target;
//         setServiceInput({ ...serviceInput, [name]: value });
//   };
      
//     const addHandler = async () => {
//       addService(serviceInput)
//     }

//   return (
//     <>
//       <div className="my_model">
//         <div className=" mt-5 text-end mx-5">
//           <button
//             type="button"
//             className="btn btn-success addservice_btn"
//             data-bs-toggle="modal"
//             data-bs-target="#myModal"
//           >
//             + Add Services
//           </button>
//         </div>

//         <div className="modal model_style" id="myModal">
//           <div className="modal-dialog modal-lg modal-dialog-scrollable">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h4 className="modal-title">Find Dubai Services</h4>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   data-bs-dismiss="modal"
//                 ></button>
//               </div>
//               {/* model body */}
//               <div className="modal-body">
//                 <h2>Add Service</h2>
//                 <div className="input-container text-center pt-4 d-flex align-items-center justify-content-center">
//                   <label htmlFor="name" className="add_label">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     id="name"
//                     value={serviceInput.name}
//                     className="add_input"
//                     onChange={onInputChange}
//                   />
//                 </div>
//                 <div className="input-container text-center pt-4 d-flex align-items-center justify-content-center">
//                   <label htmlFor="email" className="add_label">
//                     Email
//                   </label>
//                   <input
//                     type="text"
//                     name="email"
//                     id="email"
//                     className="add_input"
//                     value={serviceInput.email}
//                     onChange={onInputChange}
//                   />
//                 </div>
//                 <div className="input-container text-center pt-4 d-flex align-items-center justify-content-center">
//                   <label htmlFor="phoneNumber" className="add_label">
//                     Phone
//                   </label>
//                   <input
//                     type="text"
//                     name="phoneNumber"
//                     id="phoneNumber"
//                     className="add_input"
//                     value={serviceInput.phoneNumber}
//                     onChange={onInputChange}
//                   />
//                 </div>
//                 <div className="input-container text-center pt-4 d-flex align-items-center justify-content-center">
//                   <label htmlFor="category" className="add_label">
//                     category
//                   </label>
//                   <input
//                     type="text"
//                     name="category"
//                     id="category"
//                     className="add_input"
//                     value={serviceInput.category}
//                     onChange={onInputChange}
//                   />
//                 </div>
//                 <div className="input-container text-center pt-4 d-flex align-items-center justify-content-center">
//                   <label htmlFor="description" className=" add_label">
//                     Description
//                   </label>
//                   <input
//                     type="text"
//                     name="description"
//                     id="description"
//                     className="add_input"
//                     value={serviceInput.description}
//                     onChange={onInputChange}
//                   />
//                 </div>
//                 <div className="input-container text-center pt-4 d-flex align-items-center justify-content-center">
//                   <label htmlFor="location" className="add_label">
//                     Location
//                   </label>
//                   <input
//                     type="text"
//                     name="location"
//                     id="location"
//                     className="add_input"
//                     value={serviceInput.location}
//                     onChange={onInputChange}
//                   />
//                 </div>
//                 <div className="input-container text-center pt-2">
//                   <button className="btn btn-success save_btn" onClick={addHandler}>
//                     Save
//                   </button>
//                 </div>
//                 {/* <div className="text-center my-3">
//                   <h5 className="text-danger">Result</h5>
//                 </div> */}
//               </div>

//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-dark save_btn"
//                   data-bs-dismiss="modal"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Addservice;








// testing
import React, { useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify";
import { useMainContext } from '../context/mainContext';

const Addservice = () => {
  const { addService } = useMainContext();
  const [hideModal, setHideModal] = useState(false);
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

      
    const addHandler = async () => { 
      addService(serviceInput);
    }

  return (
    <>
      <div className=" mt-5 text-end mx-5">
          <button
            type="button"
            className="btn btn-success addservice_btn"
            data-bs-toggle="modal"
            data-bs-target="#myModal"
          >
            + Add Services
          </button>
      </div>
      <div className="my_model">
        <div className="modal model_style" id="myModal">
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
                <h2>Add Service</h2>
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
                  <button className="btn btn-success save_btn" onClick={addHandler}>
                    Save
                  </button>
                </div>
                {/* <div className="text-center my-3">
                  <h5 className="text-danger">Result</h5>
                </div> */}
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
    </>
  );
}

export default Addservice;

