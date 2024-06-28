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
import ReviewFormForDr from '../ReviewFormForDr';







const BookingDetails = () => {
 const [patientID, setPatientID] = useState(null);
 const [booking, setBooking] = useState([]);
 const [error, setError] = useState(null);
 const [doctorDetails, setDoctorDetails] = useState({});
 const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

 const navigate = useNavigate()
 const [ws, setWs] = useState(null);
 const [isOpen, setIsOpen] = useState(false);
 const [doctorId, setDoctorId] = useState(null);
 const [prescriptions, setPrescriptions] = useState([]);
 const [reviewTransactionId, setReviewTransactionId] = useState(null);





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
        
        return null;
      }
    } catch (error) {
      
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
  
      try {
        // Fetch doctor details in parallel using Promise.all
        const doctorPromises = booking.map(async (transaction) => {
          const doctor = await fetchDoctordata(transaction.doctor_id);
          return doctor || {}; // Return an empty object if doctor data is unavailable
        });
  
        const fetchedDoctors = await Promise.all(doctorPromises);
  
        for (let i = 0; i < fetchedDoctors.length; i++) {
          const doctor = fetchedDoctors[i];
          if (doctor) {
            details[booking[i].transaction_id] = doctor;
          }
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        // Handle the error appropriately (e.g., display an error message)
      } finally {
        setDoctorDetails(details);
      }
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



 const toggleModal = (transaction_id) => {
    fetchPrescriptions(transaction_id)
   setIsOpen(!isOpen);
 };

 const fetchPrescriptions = async (transaction_id) => {
  try {
     
     
 
     // Correctly set withCredentials to true
     const response = await axios.get(`${baseUrl}appointment/prescriptions/display/${transaction_id}/`, { withCredentials: true });
   
     const data = response.data // This line extracts the JSON data from the response
     setPrescriptions(data.results);
     
  } catch (error) {
     console.error("Error fetching prescriptions:", error);
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
 {/* Only show the FcVideoCall icon if the booking is today or in the future, the current time is within the booking start time, and the consultancy is not completed */}
 {isBookingTodayOrFuture(transaction.day) && transaction.start_time && transaction.is_consultency_completed !== "COMPLETED" ? (
    <FcVideoCall onClick={() => videocall(transaction.transaction_id)} className="h-10 w-10 text-blue-500" />
 ) : null}

 {/* Only show the Review Doctor button if the consultancy is completed */}
 {transaction.is_consultency_completed === "COMPLETED" && (
  <div>

  
    <button
      onClick={() => {
        setIsReviewModalOpen(true);
        setDoctorId(transaction.doctor_id); 
        setReviewTransactionId(transaction.transaction_id); // Set the transaction ID
        
        // Assuming transaction_id is the doctorId
      }}
      className="font-inherit text-sm bg-blue-500 text-white py-1 px-2 flex items-center border-none rounded-lg overflow-hidden transition-all duration-200 ease-in-out cursor-pointer hover:scale-95 hover:bg-blue-700 hover:text-gray-100"
    >
      <div className="svg-wrapper-1">
        <div className="svg-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="block transform-origin-center transition-transform duration-300 ease-in-out hover:translate-x-3 hover:rotate-45 hover:scale-110"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
            ></path>
          </svg>
        </div>
      </div>
      <span className="block ml-1 transition-all duration-300 ease-in-out hover:translate-x-1">Review Doctor</span>
    </button>


<div>
<button
 onClick={() => toggleModal(transaction.transaction_id,)}
 class="cursor-pointer flex items-center fill-lime-400 bg-lime-950 hover:bg-lime-900 active:border active:border-lime-400 rounded-md duration-100 p-2 mt-3"
  title="Save"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20px"
    height="20px"
    viewBox="0 -0.5 25 25"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M18.507 19.853V6.034C18.5116 5.49905 18.3034 4.98422 17.9283 4.60277C17.5532 4.22131 17.042 4.00449 16.507 4H8.50705C7.9721 4.00449 7.46085 4.22131 7.08577 4.60277C6.7107 4.98422 6.50252 5.49905 6.50705 6.034V19.853C6.45951 20.252 6.65541 20.6407 7.00441 20.8399C7.35342 21.039 7.78773 21.0099 8.10705 20.766L11.907 17.485C12.2496 17.1758 12.7705 17.1758 13.113 17.485L16.9071 20.767C17.2265 21.0111 17.6611 21.0402 18.0102 20.8407C18.3593 20.6413 18.5551 20.2522 18.507 19.853Z"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
  <span class="text-sm text-lime-400 font-bold pr-1">View Prescription</span>
</button>

<div>
 {isOpen && (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
            {/* Header with date on top right */}
            <div className="absolute top-0 right-0 mt-2 mr-4 text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Your Prescriptions
            </h3>
            <div className="mt-2">
              {prescriptions.map((prescription, index) => (
                <div key={index} className="border-b border-gray-200 py-4">
                 {/* Doctor's name */}
                 <p className="text-lg font-semibold text-gray-800 mb-1">
                    Doctor Name: {`${doctorDetails[transaction.transaction_id]?.doctor_user.full_name} `} 
                 </p>
                 {/* Prescription details */}
                 <p className="text-sm text-gray-500 mb-1">
                    Medicine: {prescription.medicine_name} - {prescription.dosage}
                 </p>
                 <p className="text-sm text-gray-500 mb-1">
                    Times: {prescription.times}
                 </p>
                
                 <p className="text-sm text-gray-500 mb-1">
                    Duration: {prescription.duration}
                 </p>
                 {/* Highlighted Notes field */}
                 <p className="text-sm text-gray-500 mb-1 bg-yellow-100 p-2 rounded">
                    <span className="font-semibold">Notes:</span> {prescription.notes}
                 </p>
                </div>
              ))}
            </div>
          </div>
          {/* Close button */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
 )}
</div>

</div>



    </div>
 )}
</div>


          </Card>
        ))
      ) : (
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300">No booking found.</p>
        </div>
      )}
{isReviewModalOpen && (
 <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative">
        {/* Place the Close button outside the modal component but ensure it's noticeable */}
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <button onClick={() => setIsReviewModalOpen(false)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Close
          </button>
        </div>
        <div className="bg-white px-4 pt-0 pb-4 sm:p-6 sm:pb-0">
        <ReviewFormForDr doctorId={doctorId || "Ddddd"} transaction_id={reviewTransactionId} />
        </div>
      </div>
    </div>
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
