import React, { useState, useEffect, useRef, useCallback  } from 'react';
import io from 'socket.io-client';
import { WebsocketbaseUrl, baseUrl } from '../../utils/constants/Constants';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';


function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
     const later = () => {
       clearTimeout(timeout);
       func(...args);
     };
     clearTimeout(timeout);
     timeout = setTimeout(later, wait);
  };
 }
 
const PatientChat = ({doctorId,doctorCustomId}) => {
 const [socket, setSocket] = useState(null);
 const [message, setMessage] = useState('');
 const [messages, setMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [client, setClient] = useState(null);
  const [patientId, setPatientID] = useState(null);
  const [doct, setdoct] = useState("");
  
  
  const chatContainerRef = useRef(null);
  const [appointmentId, setTransactionId] = useState(null); // State to hold the transaction ID
  // const doctorId = doctor_id;
  // const doctorCustomId = doctor_custom_id;
  
  const authToken = localStorage.getItem('access')
  const decoder = jwtDecode(authToken)
  const userId = decoder.user_id
  
  const [isChatVisible, setIsChatVisible] = useState(true); // Step 1: Add state for chat visibility
 
  // Step 2: Function to toggle chat visibility
  const toggleChatVisibility = () => {
     setIsChatVisible(!isChatVisible);
  };

  useEffect(() => {
    const fetchDoctorID = async () => {
      try {
        const response = await axios.get(`${baseUrl}auth/custom-id/patient/${userId}`);
        setdoct(response.data);
        const patientId = response.data.patient_user.custom_id;
        await fetchBookingDetails(doctorCustomId, patientId);
      } catch (error) {
        
      }
    };

    fetchDoctorID();
 }, []);

 useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };

    scrollToBottom();
 }, [chatMessages]);

 const fetchBookingDetails = async (doctorCustomId, patientId) => {
    try {
      const response = await axios.get(`${baseUrl}appointment/api/patient-transactions/`, {
        params: {
          patient_id: patientId,
          doctor_custom_id: doctorCustomId
        }
      });

      if (response.data) {
        const appointmentId = response.data.transaction_id;
        connectToWebSocket(appointmentId);
      } else {
        toast.error("No booking details found for the patient. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching booking details. Please try again.");
    }
 };

 const connectToWebSocket = (appointmentId) => {
    const newClient = new W3CWebSocket(`${WebsocketbaseUrl}ws/chat/${appointmentId}/`);
    setClient(newClient);

    newClient.onopen = () => {
      
    };

    newClient.onmessage = (message) => {
      const data = JSON.parse(message.data);
     
        setChatMessages((prevMessages) => [...prevMessages, data]);
    
    };

    return () => {
      newClient.close();
    };
 };

 const sendMessage = useCallback(debounce(() => {
  if (!client || client.readyState !== client.OPEN) {
    toast.error("WebSocket is not open");
    return;
  }

  const sendername = doct.first_name;
  const messageData = { message, sendername };
  const messageString = JSON.stringify(messageData);

  client.send(messageString);
  setMessage("");
}, 300), [client, message, doct.first_name]);


return (
  <>
     {isChatVisible && (
       <div>
         <div className="flex justify-end rounded-3xl">
           <div className='fixed bottom-10 right-8 bg-sky-100 md:w-[35%] z-50'>
           </div>
         </div>
         <div id="chat-container" className="fixed bottom-10 right-8 bg-white shadow-lg rounded-lg w-full md:w-[35%] z-50">
           <div className="bg-white shadow-md rounded-lg w-full">
             <div className="p-4 border-b bg-teal-700 text-white rounded-t-lg flex justify-between items-center">
               <p className="text-lg font-semibold">Chat</p>
               <button id="close-chat" className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400" onClick={toggleChatVisibility}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                 </svg>
               </button>
             </div>
             <div id="chatbox" className="p-4 h-80 overflow-y-auto md:h-64" ref={chatContainerRef}>
               {chatMessages.map((message, index) => (
                 <div key={index} className={`col-span-12 p-2 rounded-lg ${message.sendername === doct.first_name ? 'self-end' : 'self-start'}`}>
                  <div className={`flex items-center ${message.sendername === doct.first_name ? 'justify-end' : 'justify-start'}`}>
                     {/* Conditionally render the icon and message container based on the sender */}
                     {message.sendername === doct.first_name ? (
                       <>
                         <div className={`ml-3 ${message.sendername === doct.first_name ? 'bg-gray-300' : 'bg-gray-300'} rounded-lg p-2`}>
                           <p className="text-sm font-medium text-gray-900">{message.message}</p>
                         </div>
                         <div className="flex-shrink-0">
                           {/* Display the first letter of the sender's name or a default icon if the name is not available */}
                           <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                             {message.sendername ? message.sendername.charAt(0).toUpperCase() : 'N/A'}
                           </div>
                         </div>
                       </>
                     ) : (
                       <>
                         <div className="flex-shrink-0">
                           {/* Display the first letter of the sender's name or a default icon if the name is not available */}
                           <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                             {message.sendername ? message.sendername.charAt(0).toUpperCase() : 'N/A'}
                           </div>
                         </div>
                         <div className={`ml-3 ${message.sendername === doct.first_name ? 'bg-indigo-200' : 'bg-gray-300'} rounded-lg p-2`}>
                           <p className="text-sm font-medium text-gray-900">{message.message}</p>
                         </div>
                       </>
                     )}
                  </div>
                 </div>
               ))}
             </div>
             <div className="p-4 border-t flex">
               <label htmlFor="file-upload" className="cursor-pointer mx-2 flex items-center">
                 <input id="file-upload" type="file" accept="image/, video/" style={{ display: 'none' }} />
                
               </label>
               <input id="user-input" type="text" placeholder="Type a message" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
               <button id="send-button" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300" onClick={sendMessage}>Send</button>
             </div>
           </div>
         </div>
       </div>
     )}
  </>
 );
 
};

export default PatientChat;