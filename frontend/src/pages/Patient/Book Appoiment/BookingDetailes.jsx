import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { baseUrl } from '../../../utils/constants/Constants';

const BookingDetails = () => {
  const [patientID, setPatientID] = useState(null);
  const [booking, setBooking] = useState([]);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchPatientCustomId = async () => {
      try {
        const refreshToken = localStorage.getItem("refresh");
        let decoded = jwtDecode(refreshToken);
        let id = decoded.user_id;
        setId(id);

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

 // Function to convert date string to human-readable format
 const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
 };

 // Function to convert date-time string to human-readable format
 const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
 };

 return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
        
       {error && <div className="text-red-500">{error}</div>}
       {booking.length > 0 ? (
         <div className="flex flex-col items-center space-y-4">
           {booking.map((transaction, index) => (
             <div key={index} className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6 w-full max-w-md">
               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transaction Details</h2>
               <div className="mt-4">
                 <p className="text-gray-700 dark:text-gray-300">Transaction ID: <span className="font-medium text-gray-900 dark:text-white">{transaction.transaction_id}</span></p>
                 <p className="text-gray-700 dark:text-gray-300">Amount: <span className="font-medium text-gray-900 dark:text-white">{transaction.amount}</span></p>
                 <p className="text-gray-700 dark:text-gray-300">Date: <span className="font-medium text-gray-900 dark:text-white">{formatDate(transaction.day)}</span></p>
                 <p className="text-gray-700 dark:text-gray-300">Start Time: <span className="font-medium text-gray-900 dark:text-white">{formatDateTime(transaction.start_time)}</span></p>
                 <p className="text-gray-700 dark:text-gray-300">End Time: <span className="font-medium text-gray-900 dark:text-white">{formatDateTime(transaction.end_time)}</span></p>
               </div>
             </div>
           ))}
         </div>
       ) : (
         <div className="text-center">
           <p className="text-gray-700 dark:text-gray-300">No booking found.</p>
         </div>
       )}
    </div>
   );
   
};

export default BookingDetails;


