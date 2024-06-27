import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientChat from "../../../Compounts/chat/PatientChat";
import axios from "axios";
import { baseUrl } from "../../../utils/constants/Constants";
import { jwtDecode } from "jwt-decode";
import {  toast } from 'react-toastify'; // Import the 'toast' function from react-toastify

export default function HorizontalCardChat({ doctor }) {
  const  navigate = useNavigate()
  const [showPatientChat, setShowPatientChat] = useState(false);
  const [hasError, setHasError] = useState(false); // State to track if there's an error
  const [transactionId, setTransactionId] = useState(null); // State to hold the transaction ID
  const authToken = localStorage.getItem('access')
  const decoder = jwtDecode(authToken)
  const userId = decoder.user_id
  const [doct, setdoct] = useState("");
  const [patientId, setPatientID] = useState(null);
  const [bookings, setBookings] = useState([]);


    // Assuming doctor object has properties like doctor.full_name, doctor.specializations, doctor.experience, etc.
    
    const gotoChatToDoctor = () =>{
        fetchDoctorID()
        setShowPatientChat(!showPatientChat);
  
      }
    
   
    const fetchDoctorID = async () => {
        try {
          const response = await axios.get(`${baseUrl}auth/custom-id/patient/${userId}`);
          setdoct(response.data);
          setPatientID(response.data.patient_user.custom_id);
          
          // Now that patientId is set, fetch booking details
          await fetchBookingDetails(doctor.doctor_user.custom_id, response.data.patient_user.custom_id);
        } catch (error) {
          
        }
      };
  
    const fetchBookingDetails = async (doctorCustomId, patientId) => {
        try {
           const response = await axios.get(`${baseUrl}appointment/booking/details/doctor/${doctorCustomId}/patient/${patientId}`);
       
           setBookings(response.data);
       
           // Extract the transaction_id from the first booking in the response data
           const appointmentId = response.data.data[0].transaction_id;
           setTransactionId(appointmentId);
       
           // Now you can use the transactionId as needed, for example:
        } catch (error) {
           console.error("Error fetching booking details:", error);
           // Provide more specific feedback based on the error
           if (error.response && error.response.status === 404) {
             toast.error("You have to consult this doctor at least once!");
           } else {
             toast.error("An connect To WebSocket error occurred. Please try again.");
           }
        }
       };
       


    return (
        <Card className="w-full max-w-[48rem] flex-row h-[200px]">
            <CardHeader
                shadow={false}
                floated={false}
                className="m-0 w-2/5 shrink-0 rounded-r-none"
            >
                <img
                    src={doctor.profile_picture} // Assuming profile_picture is an ImageField and you have a way to access its URL
                    alt={`${doctor.first_name}'s Profile`}
                    className="h-full w-full object-cover mt-[10px]"
                />
            </CardHeader>
            <CardBody>
                <Typography variant="h4" color="gray" className="mb-1 uppercase">
                    {doctor.first_name} {doctor.last_name}
                </Typography>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                    Specialization: {doctor.doctor_user.specializations}
                </Typography>
                <Typography variant=" h8" color="blue-gray" className="mb-1">
                    Education: {doctor.doctor_user.education} 
                </Typography>
                <Typography variant=" h8" color="blue-gray" className="mb-1 ">
                bookingFees : ₹{doctor.doctor_user.consultaion_fees} 
                </Typography>
                {/* Add more doctor information as needed */}
                <div className="flex justify-between">
                
                    <a className="inline-block">
                    <button
      onClick={() => {
        gotoChatToDoctor()

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
      <span className="block ml-1 transition-all duration-300 ease-in-out hover:translate-x-1">Chat With Doctor</span>
    </button>


    
                    </a>
                </div>
            </CardBody>
            {showPatientChat  && (
 <div className="fixed bottom-4 right-8 z-50">
    
    {!hasError && transactionId && showPatientChat && (
                <PatientChat doctorId={doctor.doctor_user.custom_id} doctorCustomId={doctor.doctor_user.custom_id} />
            )}
 </div>
)}
        </Card>
        
    );
}
