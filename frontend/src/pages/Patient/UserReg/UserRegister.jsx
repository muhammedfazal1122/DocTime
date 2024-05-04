import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../Patient/UserReg/Register.css';
import axios from 'axios';
import { baseUrl } from '../../../utils/constants/Constants';

const UserRegister = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/auth/login');
  };

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: ''
  });
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { first_name, last_name, email, phone_number, password, confirmPassword } = formData;

    if (!first_name || !last_name) {
      toast.error("Please enter a name");
    } else if (first_name.indexOf(" ") !== -1 || last_name.indexOf(" ") !== -1) {
      toast.error("Enter a valid name");
    } else if (!email) {
      toast.error("Please enter an email address");
    } else if (password.trim() === "") {
      toast.error("Please enter a password");
    } else if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match");
    } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      toast.error("Invalid email address");
    } else {
      try {
        const res = await axios.post(baseUrl + 'auth/register', formData);
        if (res.status === 201) {
          console.log("Success");
          localStorage.setItem('userEmail', email); // Use email directly from form data
          localStorage.setItem('user_type', 'patient'); // Assuming user_type is fixed for patient registration
          navigate('/auth/otpvarification');
        }
        console.log(res);
        return res;
      } catch (error) {
        console.log("Error:", error);
        if (error.response && error.response.data && error.response.data.email) {
          toast.error(error.response.data.email[0]);
        }
      }
    }
  };



  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className='registerParantdiv mt-3 mb-10'>
        <form className="Registform" onSubmit={handleSubmit}>
          <p className="Registtitle text-2xl text-royal-500 font-semibold tracking-tighter pl-8">Patient Register</p>
          <p className="Registmessage text-gray-500">Signup now and get full access to our app.</p>
          <div className="Registflex flex gap-2 w-full">
            <label className="flex-1">
              <input
                className="Registinput w-full p-3 outline-none border border-gray-300 rounded-lg"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
              <span className="absolute left-2 top-6 text-gray-500 text-sm">Firstname</span>
            </label>
            <label className="flex-1">
              <input
                className="Registinput w-full p-3 outline-none border border-gray-300 rounded-lg"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
              />
              <span className="absolute left-2 top-6 text-gray-500 text-sm">Lastname</span>
            </label>
          </div>
          <label>
            <input
              className="Registinput w-full p-3 outline-none border border-gray-300 rounded-lg"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <span className="absolute left-2 top-6 text-gray-500 text-sm">Email</span>
          </label>
          <label>
            <input
              className="Registinput w-full p-3 outline-none border border-gray-300 rounded-lg"
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
            />
            <span className="absolute left-2 top-6 text-gray-500 text-sm">Phonenumber</span>
          </label>
          <label>
            <input
              className="Registinput w-full p-3 outline-none border border-gray-300 rounded-lg"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <span className="absolute left-2 top-6 text-gray-500 text-sm">Password</span>
          </label>
          <label>
            <input
              className="Registinput w-full p-3 outline-none border border-gray-300 rounded-lg"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <span className="absolute left-2 top-6 text-gray-500 text-sm">Confirm password</span>
          </label>
          <button className="signupBtn">
          SIGN UP
          <span className="arrow">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" fill="rgb(183, 128, 255)"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path></svg>
          </span>
        </button>
        
        <p className="text-sm text-gray-600 mt-4 ml-3">
          Already have an account?
          <button className="togButton cta ml-0 mr-4" onClick={handleButtonClick}>
            <span>Patient Login</span>
            <svg width="15px" height="10px" viewBox="0 0 13 10">
              <path d="M1,5 L11,5"></path>
              <polyline points="8 1 12 5 8 9"></polyline>
            </svg>
          </button>
        </p>
      </form>
    </div>
  </div>
);
};

export default UserRegister;