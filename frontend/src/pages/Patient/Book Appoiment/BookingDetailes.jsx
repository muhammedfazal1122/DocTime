import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { baseUrl } from '../../../utils/constants/Constants';
import {
 Card,
 CardHeader,
 CardBody,
 Typography,
 Avatar,
} from "@material-tailwind/react";
import { FcVideoCall } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';







const BookingDetails = () => {
 const [patientID, setPatientID] = useState(null);
 const [booking, setBooking] = useState([]);
 const [error, setError] = useState(null);
 const [doctorDetails, setDoctorDetails] = useState({});

 const navigate = useNavigate()
 const [ws, setWs] = useState(null);

 


 useEffect(() => {
     const websocket = new WebSocket('ws://localhost:8000/ws/notifications/');

     websocket.onopen = () => {
         console.log('WebSocket Client Connected');
     };

     websocket.onmessage = (message) => {
         console.log('Received:', message.data);
         // Here you can handle the notification, e.g., show an alert or update the UI
     };

     websocket.onclose = () => {
         console.log('WebSocket connection closed');
     };

     setWs(websocket);

     return () => {
         websocket.close();
     };
 }, []);

 const sendNotification = () => {
     if (ws) {
         ws.send(JSON.stringify({ message: 'Video call initiated' }));
     }
 };


 const videocall = (transaction_id) => {
  const roomId = transaction_id;
  // initiateVideoCall()
  navigate(`/DoctorShow/videocall/${roomId}`);
 };
 

 const fetchDoctordata = async (doctorId) => {
    try {
      const accessToken = localStorage.getItem("access");
      const response = await axios.get(`${baseUrl}auth/admin/doctor/verication/list/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const doctor = response.data.results.find(doctor => doctor.doctor_user.custom_id === doctorId);
      if (doctor) {
        return doctor;
      } else {
        console.log('Doctor not found');
        return null;
      }
    } catch (error) {
      console.log(error, 'errorrrrrrrrrrrr');
      return null;
    }  
 };

 useEffect(() => {
    const fetchPatientCustomId = async () => {
      try {
        const refreshToken = localStorage.getItem("refresh");
        let decoded = jwtDecode(refreshToken);
        let id = decoded.user_id;
        setPatientID(id);

        const response = await axios.get(`${baseUrl}auth/patient/list/${id}`);
        if (response.status === 200) {
          const customId = response.data.patient_user.custom_id;
          setPatientID(customId);
        }
      } catch (error) {
        console.error("Error fetching patient custom ID:", error);
        setError("Error fetching patient custom ID.");
      }
    };

    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}appointment/booking/details/patient/${patientID}`);
        setBooking(response.data.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError("Error fetching booking details.");
      }
    };

    if (patientID) {
      fetchBookingDetails();
    } else {
      fetchPatientCustomId();
    }
 }, [patientID]);

 useEffect(() => {
    if (booking.length > 0) {
      const fetchAndStoreDoctorDetails = async () => {
        const details = {};
        for (const transaction of booking) {
          const doctor = await fetchDoctordata(transaction.doctor_id);
          if (doctor) {
            details[transaction.transaction_id] = doctor;
          }
        }
        setDoctorDetails(details);
      };

      fetchAndStoreDoctorDetails();
    }
 }, [booking]);

 const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
 };

 const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
 };



  // Function to check if the booking is today or in the future
  const isBookingTodayOrFuture = (bookingDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds
    const booking = new Date(bookingDate);
    return booking >= today;
 };

 // Function to check if the current time is within the booking start time
 const isCurrentTimeWithinBookingTime = (bookingStartTime) => {
    const now = new Date();
    const bookingStart = new Date(bookingStartTime);
    return now >= bookingStart;
 };

 const getColor = (status) => {
  if (status === "COMPLETED") {
    return "green";
  } else if (status === "PENDING") {
    return "blue";
  } else {
    return "black"; // Default color if status is neither "COMPLETED" nor "PENDING"
  }
};

 return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
        
      {error && <div className="text-red-500">{error}</div>}
      {booking.length > 0 ? (
        booking.map((transaction, index) => (
          <Card key={index} shadow={false} className="w-full max-w-[49rem] bg-slate-200 mt-5 relative">
            <CardHeader color="transparent" floated={false} shadow={false} className="mx-0 flex items-center gap-4 pt-0 pb-8">
              <Avatar className="max-w-[8rem] ml-7" size="lg" variant="circular" alt="Doctor" src={doctorDetails[transaction.transaction_id]?.profile_picture} />
              <div className="flex w-full flex-col gap-0.5">
              {/* <button onClick={sendNotification}>Initiate Video Call</button> */}
                 <div>

              </div>
                <div className="flex items-center justify-between">
                 <Typography variant="h5" color="blue-gray">
                    <div>{`${doctorDetails[transaction.transaction_id]?.doctor_user.full_name} `}</div>
                 </Typography>
                </div>
                <div className="flex items-center gap-0">
                 {/* Assuming you have a StarIcon component for displaying ratings */}
                 <StarIcon />
                 <StarIcon />
                 <StarIcon />
                 <StarIcon />
                 <StarIcon />
                </div>
                <Typography color="blue-gray">Booking Fees: ₹ {transaction.amount}</Typography>
                <Typography color="blue-gray">{doctorDetails[transaction.transaction_id]?.doctor_user.specializations}</Typography>
                <Typography color="blue-gray">Hospital: {doctorDetails[transaction.transaction_id]?.doctor_user.Hospital}</Typography>
                <Typography color="blue-gray">Experience: {doctorDetails[transaction.transaction_id]?.doctor_user.experience} years</Typography>
              </div>
            </CardHeader>
            <CardBody className="mb-6 p-0 ml-8 ">
              <Typography>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white ">Transaction Details</h2>

              </Typography>
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-300">Transaction ID: <span className="font-medium text-gray-900 dark:text-white">{transaction.transaction_id}</span></p>
                <p className="text-gray-700 dark:text-gray-300">Consultency Status: <span className={`font-medium ${transaction.is_consultency_completed === "COMPLETED" ? "text-green-500" : transaction.is_consultency_completed === "PENDING" ? "text-blue-500" : "text-gray-900"} dark:text-white`}>{transaction.is_consultency_completed}</span></p>
                <p className="text-gray-700 dark:text-gray-300">Date: <span className="font-medium text-gray-900 dark:text-white">{formatDate(transaction.day)}</span></p>
                <p className="text-gray-700 dark:text-gray-300">Start Time: <span className="font-medium text-gray-900 dark:text-white">{formatDateTime(transaction.start_time)}</span></p>
                <p className="text-gray-700 dark:text-gray-300">End Time: <span className="font-medium text-gray-900 dark:text-white">{formatDateTime(transaction.end_time)}</span></p>
              </div>
            </CardBody>
            <div className="absolute top-0 right-0 mt-4 mr-4">
              {/* Only show the FcVideoCall icon if the booking is today or in the future and the current time is within the booking start time */}
              {isBookingTodayOrFuture(transaction.day) && (transaction.start_time) && (
                <FcVideoCall onClick={() => videocall(transaction.transaction_id)} className="h-10 w-10 text-blue-500" />
              )}
            
            </div>

          </Card>
        ))
      ) : (
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300">No booking found.</p>
        </div>
      )}
    </div>
 );
};

function StarIcon() {
 return (
    <div>
      <svg                 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5 text-yellow-700"
      >
        <path
          fillRule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
          clipRule="evenodd"
        />
      </svg>
    </div>
 );
}

export default BookingDetails;
