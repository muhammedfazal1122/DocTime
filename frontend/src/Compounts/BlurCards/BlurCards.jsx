import React from 'react';
import './BlurCard.css';
import { useNavigate } from 'react-router-dom';

const BlurCard = () => {



  const navigate = useNavigate()
  const GotoDoctorShow = () => {
    navigate('/DoctorShow');

 };
 const gotoBooking = ()=>{
  navigate('/DoctorShow/BookAppoiment/booking-detailes')
}

 const videocall = ()=>{
  const roomId = randomID(10)
  navigate(`/DoctorShow/videocall/${roomId}`)
}
function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}









 return (
    <div className="cards flex flex-wrap justify-center  ">
      
      <div
        onClick={gotoBooking} className="card red w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 m-4">
        <p className="tip">View Appointment.</p>
        <p className="second-text">Book an appointment for an in-clinic consultation</p>
      </div>
      <div 
        onClick={videocall}
      className="card blue w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 m-4">
        <p className="tip">Instant Video Consultation</p>
        <p className="second-text">Connect within 60 secs</p>
      </div>
      <div onClick={GotoDoctorShow}  className="card green w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 m-4">
        <p  className="tip">Find Your Doctor</p>
        <p className="second-text">Find The Best One</p>
      </div>
    </div>
 );
};

export default BlurCard;
