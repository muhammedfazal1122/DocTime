import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import UserWrapper from './Wrapper/UserWrapper';
import DoctorWrapper from './Wrapper/DoctorWrapper';
import Adminwrapper from './Wrapper/AdminWrapper';
import UserLogin from './pages/Patient/UserLogin';
import UserRegister from './pages/Patient/UserRegister';


const App = () => {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<UserWrapper />} />
        <Route path="/admincontrol/*" element={<Adminwrapper />} />
        <Route path="/doctor/*" element={<DoctorWrapper />} />
        
        <Route path="login" element={<UserLogin />} />
        <Route path="register" element={<UserRegister />} />
      </Routes>
    </Router>


  );
};

export default App;