import React, { useRef, useState, useEffect } from 'react';
import './OTPVerificationForm.css'; // Assuming you're using a CSS module
import Navbar from '../../Compounts/Navbar'; // Assuming the correct path to Navbar
import Footer from '../../Compounts/Footer'; // Assuming the correct path to Footer
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify'; // Import the 'toast' function from react-toastify
import { baseUrl } from '../../utils/constants/Constants';

const OTPVerificationForm = () => {
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();

  // Define state to hold the user's email
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    
    // Fetch the user's email from wherever it's 
    // stored (e.g., localStorage)

    const email = localStorage.getItem('userEmail');
    const user_type = localStorage.getItem('user_type');
    // const 
    if (email) {
      setUserEmail(email);
    }
  }, []); // Run this effect only once, similar to componentDidMount

  const handleVerify = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    // Check if userEmail is null, if so, return early
    if (!userEmail) {
      
      return;
    }

    const otp = inputRefs.map((ref) => ref.current.value).join('');
    
    try {
      const res = await axios.post(baseUrl + 'auth/verify-otp', { otp, email: userEmail });
      const user_type = localStorage.getItem('user_type');
      

      
      if (res.status === 200) {
        

        if (user_type === "patient") {
          toast.success("Registration successful!");
          navigate('/auth/login');
        } else if (user_type === "doctor") {
          toast.success("Registration successful!");
          navigate('/auth/doctor/login')
        }else{

          
        }
      }
      return res;
    } catch (error) {  
      
      
      toast.error("OTP doesn't match");
      toast.error(error.data);
      
    }
    
  };

  const handleResend = () => {
    // Handle resend logic here
  };

  const handleInputChange = (index, e) => {
    const value = e.target.value;
    if (value.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
      inputRefs[index - 1].current.focus();
    }
    
  };

  return (
    <>
     
      <div className='parentotpcontainer'>
        <form className="otpform">
          {/* <span className="otpclose">X</span> */}

          <div className="otpinfo">
            <span className="otptitle">OTP Verification</span>
            <p className="otpdescription">Please enter the code we have sent you.</p>
          </div>

          <div className="otpinputs">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                placeholder=""
                type="tel"
                maxLength={1}
                className="otpinput"
                onChange={(e) => handleInputChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          <button className="reserntclasssname" onClick={handleVerify}>
            Verify
          </button>
          {/* <p className="otpresend">You don't receive the code ? <a className="otpresend-action" onClick={handleResend}></a></p> */}
          {/* <button className='otpvalidate'>Resent</button> */}
          
        </form>
      </div>
 
    </>
  );
};

export default OTPVerificationForm;
