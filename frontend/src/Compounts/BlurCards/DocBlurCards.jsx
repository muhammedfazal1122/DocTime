import React, { useEffect, useState } from 'react';
import './DocBlurCard.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { baseUrl } from '../../utils/constants/Constants';
import axios from 'axios';

const DocBlurCard = () => {
 const navigate = useNavigate();
 const [doctorDetails, setDoctorDetails] = useState(null);
 const [DP, setProfilepicure] = useState(null);
 const userId = useSelector(state => state.authentication_user.user_id);

 const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('access');
      const fetchDoctorDetails = await axios.get(`${baseUrl}auth/docdetailes/${userId}/`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const { data } = fetchDoctorDetails;
      setDoctorDetails(data);
      setProfilepicure(data.profile_picture);
      localStorage.setItem('Doc_profile_pic', data.profile_picture);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
 };

 useEffect(() => {
    fetchData();
 }, []);

 const gotoProfile = () => {
    navigate('/doctor/Docprofile');
 };

 return (
    <div className="docCards">
      <div className="docCard docRed">
        <p className="docTip">View your Appointment.</p>
      </div>

      {doctorDetails && (
        <div className="docCard">
          <div className="docCard docnew" style={{ backgroundImage: `url(${DP || "/src/assets/logo/doctor-offering-medical-teleconsultation.jpg"})` }}>
            <p className="docTextTitle">Update Profile</p>
            <p className="docTextBody">Card Details</p>
          </div>
          <a className="docCardButton" onClick={gotoProfile}>More info</a>
        </div>
      )}

      <div className="docCard docGreen">
        <p className="docTip">Update Availability</p>
      </div>
    </div>
 );
};

export default DocBlurCard;
