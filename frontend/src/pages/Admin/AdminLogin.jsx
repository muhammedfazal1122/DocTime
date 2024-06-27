import React, { useState } from 'react';

import axios from 'axios';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { set_authentication } from '../../Redux/AuthanticationUser';
import { baseUrl } from '../../utils/constants/Constants';

const AdminLogin = () => {
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
        localStorage.setItem("email",email);
        
        dispatch(
          set_authentication({
            name: jwtDecode(res.data.access),
            isAuthenticated: true,
            isAdmin: res.data.isAdmin,
          })
        );
        
        if (res.data.isAdmin) {
          
          navigate("/admincontrol/dashbord");
        } else {
          
        }
      }
      return res;
    } catch (error) { 
      
      
    }
    
    
  };

  return (
    <div>
      <div className='Login'>
        <div className="container">
          <div className="heading">Admin Login In</div>
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
            <span className="title">Or Sign in with</span>
            <div className="social-accounts">
              {/* Social buttons */}
            </div>
          </div>
          <span className="agreement"><a href="#">Learn user licence agreement</a></span>
      
        </div>
        
      </div>
      

    </div>
  );
};

export default AdminLogin;
