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
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { first_name, last_name, email, phone_number, password, confirmPassword } = formData;

    // Name validation
    if (!first_name ||!last_name) {
      toast.error("Both first name and last name are required.");
    } else if (first_name.length < 2 || last_name.length < 2) {
      toast.error("First name and last name must be at least 2 characters long.");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      toast.error("Email address is required.");
    } else if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
    }

    // Phone number validation
    const phoneNumberRegex = /^\d{10}$/; // Adjust regex based on expected format
    if (!phone_number) {
      toast.error("Phone number is required.");
    } else if (!phoneNumberRegex.test(phone_number)) {
      toast.error("Please enter a valid phone number.");
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/; // At least 8 characters, including at least one uppercase letter, one lowercase letter, and one digit
    if (!password) {
      toast.error("Password is required.");
    } else if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters long, including at least one uppercase letter, one lowercase letter, and one digit.");
    } else if (password!== confirmPassword) {
      toast.error("Passwords do not match.");
    } else {
      try {
        const res = await axios.post(baseUrl + 'auth/register', formData);
        if (res.status === 201) {
          localStorage.setItem('userEmail', email);
          localStorage.setItem('user_type', 'patient');
          navigate('/auth/otpvarification');
        }
      } catch (error) {
        console.log("Error:", error);
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
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
            <div className="relative">
              <input
                className={`Registinput w-full p-3 outline-none border border-gray-300 rounded-lg ${showPassword? 'border-transparent' : ''}`}
                type={showPassword? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            <span className="absolute left-2 top-6 text-gray-500 text-sm">Password</span>

              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white px-2 py-1 rounded text-gray-500 hover:bg-gray-100"
                onClick={toggleShowPassword}
              >
                {showPassword? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          <label>
            <div className="relative">
              <input
                className={`Registinput w-full p-3 outline-none border border-gray-300 rounded-lg ${showPassword? 'border-transparent' : ''}`}
                type={showPassword? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
             <span className="absolute left-2 top-6 text-gray-500 text-sm">Confirm password</span>

              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white px-2 py-1 rounded text-gray-500 hover:bg-gray-100"
                onClick={toggleShowPassword}
              >
              </button>
            </div>
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