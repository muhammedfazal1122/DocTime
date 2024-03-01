import React from 'react';
import UserHome from '../pages/Patient/UserHome';
import UserFooter from '../pages/Patient/UserFooter';
import Navbar from '../Compounts/Navbar'; 
import Footer from '../Compounts/Footer'; 
import UserLogin from '../pages/Patient/UserLogin';
import UserRegister from '../pages/Patient/UserRegister';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const UserWrapper = () => {
 return (
    <div>
      <Navbar/>
      {/* <Router>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="login" element={<UserLogin />} />
          <Route path="register" element={<UserRegister />} />
        </Routes>
      </Router> */}
      <Footer/>
    </div>
 );
};

export default UserWrapper;
