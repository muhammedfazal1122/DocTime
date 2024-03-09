import React from 'react';
import './DocBlurCard.css'
import { useNavigate } from 'react-router-dom';

const DocBlurCard = () => {
  const navigate = useNavigate(); // Corrected variable name
  const gotoProfile = () => {
    navigate('/doctor/Docprofile'); // Corrected function call
  }

 return (
    <div className="docCards">
      <div className="docCard docRed">
        <p className="docTip">View your Appointment.</p>
        <p className="docSecondText">Book an appointment for an in-clinic consultation</p>
      </div>
      {/* <div className="docCard docBlue">
        <p className="docTip">Instant Video Consultation</p>
        <p className="docSecondText">Connect within 60 secs</p>
      </div> */}




        <div className="docCard">
      <div className="docCard docnew">
        <p className="docTextTitle">Update Profile</p>
        <p className="docTextBody">Card Details</p>
      </div>
      <a className="docCardButton" onClick={gotoProfile}>More info</a>
    </div>

    
      <div className="docCard docGreen">
        <p className="docTip">Update Availability</p>
        <p className="docSecondText">Find The Best One</p>
      </div>
    </div>
 );
};

export default DocBlurCard;
