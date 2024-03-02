import React, { useState } from 'react';
import Navbar from '../../Compounts/Navbar';
import Footer from '../../Compounts/Footer';
import '../../pages/Patient/Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
  const baseURL = "http://127.0.0.1:8000";
  const navigate = useNavigate();

  // State to hold the user's email
  const [userEmail, setUserEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const res = await axios.post(baseURL + '/auth/register', formData);
      if (res.status === 201) {
        console.log("Success");
        
        // Store the user's email in localStorage
        localStorage.setItem('userEmail', formData.get('email'));

        navigate('/otpvarification');
      }
      console.log(res);
      return res;
    } catch (error) {
      console.log(error, "errooo");
    }
    console.log(`First Name: ${formData.get('first_name')}, Last Name: ${formData.get('last_name')}, Email: ${formData.get('email')}, Phone Number: ${formData.get('phone_number')}, Password: ${formData.get('password')}, Confirm Password: ${formData.get('confirmPassword')}`);
  };

  
 return (
 <div>
    <Navbar/>
    <form className="Registform" onSubmit={handleSubmit}>
      <p className="Registtitle">Register</p>
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
        Already have an account? <a href="#">Signin</a>
      </p>
    </form>
    <Footer/>
 </div>
 );
};

export default UserRegister;
