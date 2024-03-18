import React, { useEffect, useState } from 'react';
import './DocBlurCard.css';
import { useNavigate } from 'react-router-dom';

const DocBlurCard = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);

  const callProfilePic = () => {
    const data = localStorage.getItem('Doc_profile_pic');
    setProfilePic(data);
  };

  useEffect(() => {
    callProfilePic();
  }, []);

  const gotoProfile = () => {
    navigate('/doctor/Docprofile');
  };

  return (
    <div className="docCards">
      <div className="docCard docRed">
        <p className="docTip">View your Appointment.</p>
      </div>

      <div className="docCard">
        <div className="docCard docnew" style={{ backgroundImage: `url(${profilePic})` }}>
          <p className="docTextTitle">Update Profile</p>
          <p className="docTextBody">Card Details</p>
        </div>
        <a className="docCardButton" onClick={gotoProfile}>More info</a>
      </div>

      <div className="docCard docGreen">
        <p className="docTip">Update Availability</p>
      </div>
    </div>
  );
};

export default DocBlurCard;
