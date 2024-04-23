import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../utils/constants/Constants';
import { Card, CardHeader, CardBody, Typography, Avatar } from "@material-tailwind/react";
import { FcVideoCall } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { FcEndCall } from "react-icons/fc";

const DoctorBookingDetails = () => {
 const [booking, setBooking] = useState([]);
 const [error, setError] = useState(null);
 const [PatientData, setPatientData] = useState({}); // Changed to an object to store multiple patient details
 const navigate = useNavigate();

 const doctorId = localStorage.getItem("custom_id");

 const videocall = (transaction_id) => {
    const roomId = transaction_id;
    navigate(`/doctor/docvideocall/${roomId}`);
 };


 const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
     age--; // Subtract one year if the current date is before the birth date in the current year
  }
  return age;
 };

 
 const fetchPatientDetaiels = async (patientId) => {
 try {
  console.log(patientId,'llllllllllllllllllllll');
      const response = await axios.get(`${baseUrl}auth/detail/patient/${patientId}`);
      // Update the PatientData state to include the new patient details
      setPatientData(prevState => ({ ...prevState, [patientId]: response.data }));
      console.log(response.data,'PPpppppppppppppppppppppppppppppppppppppppppp');
 } catch (error) {
    console.log(error,'EEOEOEO');
 }
 }

 const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatDateTime = (dateTimeString) => {
  const dateTime = new Date(dateTimeString);
  return dateTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
};



 const fetchBookingDetails = async () => {
   try {
     const response = await axios.get(`${baseUrl}appointment/booking/details/doctor/${doctorId}`);
     setBooking(response.data.data);
     // Assuming each booking has a patient_id, fetch patient details after setting booking
     if (response.data.data && response.data.data.length > 0) {
       response.data.data.forEach(transaction => {
         fetchPatientDetaiels(transaction.patient_id);
       });
     }
   } catch (error) {
     console.error("Error fetching booking details:", error);
     setError("Error fetching booking details.");
   }
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

 useEffect(() => {
    fetchBookingDetails();
 }, [doctorId]); // Include doctorId in the dependency array

 return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      
      {error && <div className="text-red-500">{error}</div>}
      {booking.length > 0 ? (
        booking.map((transaction, index) => (
          <Card key={index} shadow={false} className="w-full max-w-[49rem] bg-slate-200 mt-5 relative ">
                 <Typography>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-7  mt-3 ">Patient Details</h2>
              </Typography>
            <CardHeader color="transparent" floated={false} shadow={false} className="mx-0 flex items-center gap-4 pt-0 pb-8">
              
            <Avatar
                  className="max-w-[8rem] ml-7"
                  size="lg"
                  variant="circular"
                  alt="Patient"
                  src={
                      PatientData[transaction.patient_id]?.user?.profile_picture
                        ? PatientData[transaction.patient_id]?.user?.profile_picture
                        : "/public/assets/avatar/avatar_6.jpg"
                  }
                  />
              <div className="flex w-full flex-col gap-0.5">
                <div className="flex items-center justify-between">
                 <Typography variant="h5" color="blue-gray">
                    <div>{`${PatientData[transaction.patient_id]?.full_name} `}</div>
                    <div> Age: {`${calculateAge(PatientData[transaction.patient_id]?.user?.date_of_birth)} `}</div>
                 </Typography>
                </div>
                {/* <Typography color="blue-gray">Booking Fees: ₹ {transaction.amount}</Typography> */}
                <Typography color="blue-gray">Date: {formatDate(transaction.day)}</Typography>
                <Typography color="blue-gray">Consultation Time: {formatDateTime(transaction.start_time)} To {formatDateTime(transaction.end_time)}</Typography>
                {/* <Typography color="blue-gray">End Time: </Typography> */}
                {/* <Typography color="blue-gray">End Time: {transaction.patient_id}</Typography> */}
                <Typography color="blue-gray">Payment : {transaction.status}</Typography>
                <Typography style={{ color: getColor(transaction.is_consultency_completed) }}>Consultency Status : {transaction.is_consultency_completed}</Typography>
              </div>
            </CardHeader>
            <CardBody className="mb-6 p-0 ml-8 ">
              <Typography>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white ">Transaction Details</h2>
              </Typography>
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-300">Transaction ID: <span className="font-medium text-gray-900 dark:text-white">{transaction.transaction_id}</span></p>
              </div>
            </CardBody>
            <div className="absolute top-0 right-0 mt-4 mr-4">
            {transaction.is_consultency_completed !== "COMPLETED" && (
                <FcVideoCall onClick={() => videocall(transaction.transaction_id)} className="h-10 w-10 text-blue-500" />
            )}
            {/* <FcEndCall className="h-10 w-10 text-blue-500" /> */}
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

export default DoctorBookingDetails;
