import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../utils/constants/Constants';
import { Card, CardHeader, CardBody, Typography, Avatar } from "@material-tailwind/react";
import { FcVideoCall } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Import the Modal component
import { toast } from 'react-toastify';
Modal.setAppElement('#root'); // Add this line

const DoctorBookingDetails = () => {
 const [booking, setBooking] = useState([]);
 const [error, setError] = useState(null);
 const [PatientData, setPatientData] = useState({}); // Changed to an object to store multiple patient details
 const navigate = useNavigate();

 const doctorId = localStorage.getItem("custom_id");
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [prescriptionData, setPrescriptionData] = useState({
  transaction: '', // The ID of the Transaction instance
  doctor: doctorId, // The ID of the Doctor instance
  patient: '', // Patient ID will be set when opening the modal
  medicine_name: '',
  age: '',
  dosage: '',
  times: '',
  duration: '',
  notes: ''
});
 // Modal styles
 const modalStyles = {
  content: {
     top: '50%',
     left: '50%',
     right: 'auto',
     bottom: 'auto',
     marginRight: '-50%',
     transform: 'translate(-50%, -50%)',
     backgroundColor: '#f5f5f5', // Light background to mimic paper
     borderRadius: '15px', // Soft border radius for a more rounded look
     padding: '15px', // Reduced padding to make the modal smaller
     width: '40%', // Reduced width to make the modal smaller
     maxWidth: '400px', // Adjusted maxWidth to match the reduced width
     minWidth: '250px', // Adjusted minWidth to match the reduced width
     boxShadow: '0px 0px 15px rgba(0,0,0,0.2)', // Soft shadow to give a 3D effect
     border: '1px solid #e0e0e0', // Slight border to give a paper-like edge
     overflowY: 'auto', // Enable vertical scrolling if the content is too long
     maxHeight: '80vh', // Set a maximum height for the modal content
  },
  overlay: {
     backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent overlay to darken the background
  },
 };
 const openModal = (transactionId, patientId) => {
  setPrescriptionData({
    ...prescriptionData,
    transaction: transactionId,
    patient: patientId,
  });
  setIsModalOpen(true);
};



  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPrescriptionData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
       // Ensure all required fields are present
       if (!prescriptionData.transaction || !prescriptionData.doctor || !prescriptionData.patient) {
         console.error('Missing required fields:', prescriptionData);
         return; // Prevent the request if required fields are missing
       }
   
       // Determine the URL based on whether we're creating or updating
       let url = prescriptionData.id ? `${baseUrl}appointment/prescription/update/${prescriptionData.id}/` : `${baseUrl}appointment/prescription/create/`;
       let method = prescriptionData.id ? 'patch' : 'post';
   
       // Make the request to your backend API
       const response = await axios[method](url, prescriptionData);
       
   
       // If creating a new prescription, you might want to reset the form or navigate away
       // If updating, you might want to update the state with the new data
       if (!prescriptionData.id) {
         setPrescriptionData(response.data);
       }
       
   toast.success("Prescription sent successfully!")
       closeModal(); // Close the modal after successful submission
    } catch (error) {
       console.error('Error submitting prescription:', error);
       if (error.response) {
         console.error('Error response:', error.response.data);
       } else if (error.request) {
         console.error('No response received:', error.request);
       } else {
         console.error('Error', error.message);
       }
      
    }
   };
   


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
  
      const response = await axios.get(`${baseUrl}auth/detail/patient/${patientId}`);
      // Update the PatientData state to include the new patient details
      setPatientData(prevState => ({ ...prevState, [patientId]: response.data }));
      
 } catch (error) {
    
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
            {transaction.is_consultency_completed === "COMPLETED" && (
        <>
      
          <button
            onClick={() => openModal(transaction.transaction_id, transaction.patient_id)}
            className="flex items-center font-semibold text-white px-6 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-700 border-none shadow-lg hover:shadow-md active:shadow-sm rounded-full"
          >
            <svg className="mr-2" viewBox="0 0 640 512" fill="white" height="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
            </svg>
            <span>Upload prescription</span>
          </button>
                    
        <div className='mb-8'>
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} 
          style={modalStyles}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-center text-xl font-semibold mb-4">Add Prescription</h2>
          <div>
            <label htmlFor="medicine_name" className="block text-sm font-medium text-gray-700">Medicine Name:</label>
            <input
              type="text"
              name="medicine_name"
              id="medicine_name"
              value={prescriptionData.medicine_name}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age:</label>
            <input
              type="number"
              name="age"
              id="age"
              value={prescriptionData.age}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage:</label>
            <input
              type="text"
              name="dosage"
              id="dosage"
              value={prescriptionData.dosage}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="times" className="block text-sm font-medium text-gray-700">Times:</label>
            <input
              type="text"
              name="times"
              id="times"
              value={prescriptionData.times}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration:</label>
            <input
              type="text"
              name="duration"
              id="duration"
              value={prescriptionData.duration}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes:</label>
            <textarea
              name="notes"
              id="notes"
              value={prescriptionData.notes}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows="4"
            ></textarea>
          </div>
          <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Submit
          </button>
        </form>
        <button onClick={closeModal} className="w-full py-2 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Close
        </button>
      </Modal>

 </div>

        </>
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

export default DoctorBookingDetails;
