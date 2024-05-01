import React from 'react';
import BlurCard from '../../Compounts/BlurCards/BlurCards';
import FAQSection from './FAQSection';
import HowItWorksSection from './HowItWorksSection';
import './getstart.scss';
import { useNavigate } from 'react-router-dom';
import DoctorCatogoryList from './DoctorList/DoctorCatogoryList';
import ReviewForm from './ReviewForm';

const UserHome = () => {


  const GotoDoctorShow = () => {
    navigate('/DoctorShow');
 };


  const navigate = useNavigate()
  return (
    <>
      <div className="relative w-full h-screen">
        <div className="relative w-full h-full">
          <img
            src="src/assets/logo/doctor-offering-medical-teleconsultation.jpg"
            alt=""
            className="w-full h-full inset-0"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div> {/* Dark overlay */}
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center gap-4">
          <div className="flex justify-center gap-4">
          <h2 className="text-center text-blue-100 font-semibold w-full text-3xl">
          ‟Medicines Can Cure Diseases, But Only Doctors Can Cure Patients„
            </h2>
          </div>
          <div className="parentgetstart flex justify-start ml-14 mt-12">
            {/* Added flex and justify-start */}
            <button onClick={GotoDoctorShow} className="animated-button">
              <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                ></path>
              </svg>
              <span  className="text">Get Start</span>
              <span className="circle"></span>
              <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                ></path>


                
              </svg>
            </button>
          </div>
        </div>
      </div>
      <BlurCard />
      <HowItWorksSection />
      <DoctorCatogoryList/>

      <FAQSection/>
      {/* <ReviewForm/> */}
    </>
  );
};

export default UserHome;
