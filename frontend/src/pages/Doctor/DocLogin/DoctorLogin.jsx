import React, { useState } from 'react';
import Navbar from '../../../Compounts/Navbar';
import Footer from '../../../Compounts/Footer';
import '../../Patient/UserLogin/Login.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { set_authentication } from '../../../Redux/AuthanticationUser'; 
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../../utils/constants/Constants';
import { toast } from "react-toastify";

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/auth/doctor/register');
 };
 
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);

    try {
      const res = await axios.post(baseUrl + 'auth/login', form);
      if (res && res.status === 200) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        
        dispatch(
          set_authentication({
            name: jwtDecode(res.data.access),
            isAuthenticated: true,
            isAdmin: res.data.isAdmin,
            is_doctor: res.data.is_doctor,
            user_id: res.data.user_id
          })
        );
        
        if (res.data.is_doctor) {
          
          toast.success("You are successfully logged in !")

          navigate("/doctor/DocHome");
        } else {
          toast.error("Patients Login Page is not here")

          
        }
      }
      return res;
    } catch (error) { 
      
      
    }
    
    
    
  };

  return (
    <div className='mt-5 mr-4 ml-4'>
      <div className='Login mt-6 mb-8 '>
        <div className="container">
          <div className="heading">Doctor Sign In</div>
          <form onSubmit={handleSubmit} className="form">
            <input
              required
              className="input"
              type="email"
              name="email"
              id="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              className="input"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <span className="forgot-password"><a href="#">Forgot Password ?</a></span> */}
            <input className="login-button" type="submit" value="Sign In" />
          </form>
          <div className="social-account-container">
            {/* <span className="title">Or Sign in with</span> */}
            <div className="social-accounts">
              {/* Social buttons */}
            </div>
          </div>
          <span className="agreement"><a href="#">Learn user licence agreement</a></span>
      <div className='togButton'>

          <button class="cta" onClick={handleButtonClick}>
      <span>Doctor Sign up</span>
      <svg width="15px" height="10px" viewBox="0 0 13 10">
        <path d="M1,5 L11,5"></path>
        <polyline points="8 1 12 5 8 9"></polyline>
      </svg>
    </button>

          </div>
        </div>
        
      </div>
      

    </div>
  );
};

export default DoctorLogin;
