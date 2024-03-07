import React, { useState } from 'react';
import Navbar from '../../../Compounts/Navbar';
import Footer from '../../../Compounts/Footer';
import '../../Patient/UserReg/Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorRegister = () => {
  const baseURL = "http://127.0.0.1:8000";
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/auth/doctor/login');
 };
  // State to hold the user's email
  const [userEmail, setUserEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append('user_type', 'doctor');
    try {
      const res = await axios.post(baseURL + '/auth/register', formData);
      if (res.status === 201) {
        console.log("Success");
        
        localStorage.setItem('userEmail', formData.get('email'));
        localStorage.setItem('user_type', formData.get('user_type'));

        navigate('/auth/otpvarification');
      }
      console.log(res);
      return res;
    } catch (error) {
      console.log(error, "errooo");
    }
    console.log(` Email: ${formData.get('email')}, usertype=====${user_type} Confirm Password: ${formData.get('confirmPassword')}`);
  };

  
 return (
 <div>
  <div className='registerParantdiv'>

    <form className="Registform" onSubmit={handleSubmit}>
      <p className="Registtitle">Doctor Register</p>
      <p className="Registmessage">Signup now and get full access to our app.</p>
      <div className="Registflex">
        <label>
          <input
            className="Registinput"
            type="text"
            name="first_name"
            required
          />
          <span>Firstname</span>
        </label>

        <label>
          <input
            className="Registinput"
            type="text"
            name="last_name"
            required
          />
          <span>Lastname</span>
        </label>
      </div>

      <label>
        <input
          className="Registinput"
          type="email"
          name="email"
          required
        />
        <span>Email</span>
      </label>

      <label>
        <input
          className="Registinput"
          type="text"
          name="phone_number"
          required
        />
        <span>Phonenumber</span>
      </label>

      <label>
        <input
          className="Registinput"
          type="password"
          name="password"
          required
        />
        <span>Password</span>
      </label>

      <label>
        <input
          className="Registinput"
          type="password"
          name="confirmPassword"
          required
        />
        <span>Confirm password</span>
      </label>

      <button className="signupBtn">
        SIGN UP
        <span className="arrow">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" fill="rgb(183, 128, 255)"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path></svg>
        </span>
      </button>

      <p className="Registsignin">
        Already have an account?
        </p>    
          


     
      </form>

        <div className='togButton'>
          <button class="cta" onClick={handleButtonClick}>
          <span>Doctor Login</span>
          <svg width="15px" height="10px" viewBox="0 0 13 10">
          <path d="M1,5 L11,5"></path>
          <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
          </button>

        </div>
        </div>
 </div>
 );
};

export default DoctorRegister;
