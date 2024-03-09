import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import the 'toast' function from react-toastify


const DoctorRegister = () => {
  const baseURL = "http://127.0.0.1:8000";
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/auth/doctor/login');
  };

  // State to hold the form data
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

    const { first_name, last_name, email, password, confirmPassword } = formData;

    // Perform validation
    if (!first_name || !last_name) {
      toast.error("Please enter a name");
    } else if (first_name.indexOf(" ") !== -1 || last_name.indexOf(" ") !== -1) {
      toast.error("Enter a valid name");
    } else if (!email) {
      toast.error("Please enter an email address");
    } else if (password.trim() === "") {
      toast.error("Please enter a password");
    } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      toast.error("Invalid email address");
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      // All validation passed, proceed with form submission
      const userData = {
        first_name,
        last_name,
        email,
        phone_number: formData.phone_number,
        password,
        user_type: 'doctor'
      };

      try {
        const res = await axios.post(baseURL + '/auth/register', userData);
        if (res.status === 201) {
          console.log("Success");
          localStorage.setItem('userEmail', email);
          localStorage.setItem('user_type', 'doctor');
          navigate('/auth/otpvarification');
        }
        console.log(res);
        return res;
      } catch (error) {
        console.log(error, "errooo");
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  
 return (
 <div>
   <ToastContainer  />
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
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <span>Firstname</span>
        </label>

        <label>
          <input
            className="Registinput"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
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
          value={formData.email}
          onChange={handleChange}
          required
        />
        <span>Email</span>
      </label>

      <label>
        <input
          className="Registinput"
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <span>Phonenumber</span>
      </label>

      <label>
        <input
          className="Registinput"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <span>Password</span>
      </label>

      <label>
        <input
          className="Registinput"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
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
