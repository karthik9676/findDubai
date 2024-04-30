import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import reducer from '../reducer/mainReducer';
import { toast } from "react-toastify";
const MainContext = createContext();

const initialState = {
  isLoading: false,
  services: [],
  query: "",
  totalPages: 0,
  page: 1,
  limit: 6,
  totalServices: 0
};

const MainContextProvider = ({ children }) => {
const [state, dispatch] = useReducer(reducer, initialState);

    // get all services
  const getAllServices = async () => {
      // console.log('clicked')
      dispatch({ type: "SET_ALLSERVICES_LOADING" });
      try {
        // const res = await axios.get("http://localhost:7000/services/allservices");
        const res = await axios.get(`http://localhost:7000/services/search?name=${state.query}&page=${state.page}&limit=${state.limit}`);
        console.log(res.data)
        const {services, totalServicesCount, page, limit, totalPages} = res.data;
        // console.log(services)
        dispatch({ type: "SET_ALLSERVICES_DATA", payload: {services, totalServicesCount, page, limit, totalPages} });
      } catch (error) {
        console.log(error);
        // dispatch({ type: "SET_ALLSERVICES_ERROR" });
      }
  };

  // console.log(state);

  // pagination code
  const decrementPage = () => {
    dispatch({ type: "DECREMENT_PAGE" });
  }
  const incrementPage = () => {
    dispatch({ type: "INCREMENT_PAGE" });
  };
  const getPageNumber = (pageNumber) => {
    // console.log(pageNumber)
    dispatch({ type: "GETTING_PAGE_NUMBER", payload:pageNumber });
  }


  // adding a service
  const addService = async (data) => {
    try {
      dispatch({ type: "ADDSERVICE_LOADING" });
      const res = await axios.post("http://localhost:7000/services/addservice", data);
      // console.log(res)
      if (res.data.success === true) {
        dispatch({ type: "ADDSERVICE_LOADING_RESULT" });
        toast.success(res.data.message);
        getAllServices();
        // getAllServices();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };


  // editing the service
  const saveOnEdit = async (serviceId, data) => { 
    try {
      // console.log(serviceId, data)
      const res = await axios.put(`http://localhost:7000/services/edit/${serviceId}`,data );
      // console.log(res.data)
      if (res.data.success === true) {
        toast.success(res.data.message);
        getAllServices();
      }
      

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // searching services
  const searchServices = (data) => { 
    if (data.length >= 1) {
      dispatch({ type: "SEARCH_FILTER", payload: data });
    }
  };

  // delete services
  const deleteService = async (_id) => { 
    try {
      dispatch({ type: "DELETESERVICE_LOADING" });
      const res = await axios.delete(`http://localhost:7000/services/delete/${_id}` );
      // console.log(res)
      if (res.data.success === true) {
        dispatch({ type: "DELETESERVICE_LOADING_RESULT" });
        toast.success(res.data.message);
        getAllServices();
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // clear search filter
  const clearSearch = () => {
    getAllServices();
  }
  // console.log(state)
  
  useEffect(() => {
    getAllServices();
  }, [state.query, state.page]);
  
  

  return (
    <MainContext.Provider
      value={
        {
          ...state,
          addService,
          searchServices,
          clearSearch,
          saveOnEdit,
          deleteService,
          decrementPage,
          incrementPage,
          getPageNumber
        }
      }
    >
      {children}
    </MainContext.Provider>
  );
};

// Custom Hook
const useMainContext = () => {
  return useContext(MainContext);
};

export { MainContext, MainContextProvider, useMainContext };
