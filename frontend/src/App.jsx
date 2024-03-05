import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import UserWrapper from './Wrapper/UserWrapper';
import DoctorWrapper from './Wrapper/DoctorWrapper';
import Adminwrapper from './Wrapper/AdminWrapper';
import UserLogin from './pages/Patient/UserLogin/UserLogin';
import UserRegister from './pages/Patient/UserReg/UserRegister';
import OTPVerificationForm from './pages/Patient/OtpVarification';
import { Provider } from "react-redux";
import UserStore from './store/UserStore';

const App = () => {
  return (
    <Provider store = {UserStore}>
    <Router>
      <Routes>
        <Route path="/*" element={<UserWrapper />} />
        <Route path="/admincontrol/*" element={<Adminwrapper />} />   
        <Route path="/doctor/*" element={<DoctorWrapper />} />
        

      </Routes>
    </Router>

    </Provider>



  );
};

export default App;