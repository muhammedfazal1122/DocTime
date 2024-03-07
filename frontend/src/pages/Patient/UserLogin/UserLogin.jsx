import React, { useState } from 'react';
import Navbar from '../../../Compounts/Navbar';
import Footer from '../../../Compounts/Footer';
import '../../Patient/UserLogin/Login.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { set_authentication } from '../../../Redux/AuthanticationUser'; 
import { jwtDecode } from 'jwt-decode';
import { toast } from "react-toastify";
  import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const baseURL = "http://127.0.0.1:8000";
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleButtonClick = () => {
     navigate('/auth/register');
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);

    try {
      const res = await axios.post(baseURL + '/auth/login', form);
      const user_type = localStorage.getItem('user_type');

      if (res.status === 200 ) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        console.log( jwtDecode(res.data.access).user_id);
        dispatch(
          set_authentication({
            name: jwtDecode(res.data.access).first_name,
            isAuthenticated: true,
            isAdmin: res.data.isAdmin,
            is_doctor: res.data.is_doctor,
            user_id: jwtDecode(res.data.access).user_id,

          })
        );
        console.log(res.data.is_doctor, "this is the status");
        if (res.data.is_doctor | res.data.isAdmin) {
          console.log("IT IS DOCTOR or an Admin ");
        } else {
          console.log("ok");
          navigate('/');
        }
      }
    } catch (error) { 
      console.log(error);
    }

    console.log(`Email: ${email}, Password: ${password}`);
  };

  return (
    <div>
      <div className='Login'>
        <div className="container">
          <div className="heading">Patient Sign In</div>
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
            <span className="forgot-password"><a href="#">Forgot Password ?</a></span>
            <input className="login-button" type="submit" value="Sign In" />
          </form>
          <div className="social-account-container">
            <span className="title">Or Sign in with</span>
            <div className="social-accounts">
              {/* Social buttons */}
            </div>
          </div>
          <span className="agreement"><a href="#">Learn user licence agreement</a></span>
      <div className='togButton'>

          <button class="cta" onClick={handleButtonClick}>
      <span>Patient Sign up</span>
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

export default UserLogin;
