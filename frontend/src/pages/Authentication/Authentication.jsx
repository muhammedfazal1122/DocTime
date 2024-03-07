import React from 'react'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import UserLogin from '../Patient/UserLogin/UserLogin';
import UserRegister from '../Patient/UserReg/UserRegister';
import OTPVerificationForm from '../Patient/OtpVarification';
import DoctorLogin from '../Doctor/DocLogin/DoctorLogin';
import DoctorRegister from '../Doctor/DocReg/DoctorRegister';
import DocHome from '../Doctor/DocHome';

const Authentication = () => {
  return (
    <div>
        
        <Routes>
        
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/doctor/home" element={<DocHome />} />

        <Route path="/otpvarification" element={<OTPVerificationForm />} />
      </Routes>
    </div>
  )
}

export default Authentication