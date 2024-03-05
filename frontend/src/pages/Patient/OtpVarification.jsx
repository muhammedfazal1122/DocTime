import React, { useRef, useState, useEffect } from 'react';
import './OTPVerificationForm.css'; // Assuming you're using a CSS module
import Navbar from '../../Compounts/Navbar'; // Assuming the correct path to Navbar
import Footer from '../../Compounts/Footer'; // Assuming the correct path to Footer
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OTPVerificationForm = () => {
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const baseURL = "http://127.0.0.1:8000";
  const navigate = useNavigate();

  // Define state to hold the user's email
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Fetch the user's email from wherever it's stored (e.g., localStorage)
    const email = localStorage.getItem('userEmail');
    // const 
    if (email) {
      setUserEmail(email);
    }
  }, []); // Run this effect only once, similar to componentDidMount

  const handleVerify = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    // Check if userEmail is null, if so, return early
    if (!userEmail) {
      console.log("User email is not available");
      return;
    }

    const otp = inputRefs.map((ref) => ref.current.value).join('');
    
    try {

      const res = await axios.post(baseURL + '/auth/verify-otp', { otp, email: userEmail });
      console.log(res);
      if (res.status === 200) {
        console.log("Success");
        navigate('/auth/login');
      }
      return res;
    } catch (error) {  
      console.log(error);
      console.log("Error");
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
          <p className="otpresend">You don't receive the code ? <a className="otpresend-action" onClick={handleResend}></a></p>
          <button className='otpvalidate'>Resent</button>
          
        </form>
      </div>

    </>
  );
};

export default OTPVerificationForm;
