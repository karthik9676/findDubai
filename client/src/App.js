import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import Register from './components/Register';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import SigninPage from './components/SigninPage';
import VerifyOtp from './components/VerifyOtp';
import AdminUsers from './components/admin/AdminUsers';
import AdminServices from './components/admin/AdminServices';
import AdminPage from './components/admin/AdminPage';

function App() {
  return (
    <div className="App">
      {/* <ToastContainer
        bodyClassName="toastBody"
      /> */}
      <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/services' element={<Services />} />
        <Route path='/register' element={<Register/>} />
        <Route path='/forgotpassword' element={<ForgotPassword/>} />
        <Route path='/signin' element={<SigninPage/>} />
        <Route path='/verifyotp' element={<VerifyOtp />} />
        <Route path='/adminpage' element={<AdminPage />} />
        <Route path='/admin' element={<AdminServices />}/>
        <Route path='/admin/users' element={<AdminUsers/>} />
        <Route path='/admin/services' element={<AdminServices/>} />
      </Routes>
    </div>
  );
}

export default App;
