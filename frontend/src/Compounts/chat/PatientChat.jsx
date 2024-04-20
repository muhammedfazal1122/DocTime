import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { baseUrl } from '../../utils/constants/Constants';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

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
  console.log("CLIENT:", client);
  console.log("BOOKINGS:", bookings);

  // const doctorId = doctor_id;
  // const doctorCustomId = doctor_custom_id;
  
  const authToken = localStorage.getItem('access')
  const decoder = jwtDecode(authToken)
  const userId = decoder.user_id
  


    const fetchDoctorID = async () => {
      try {
        const response = await axios.get(`${baseUrl}auth/custom-id/patient/${userId}`);
        setdoct(response.data);
        setPatientID(response.data.patient_user.custom_id);
        console.log(response.data.patient_user.custom_id, 'fetchDoctorIDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
        // Now that patientId is set, fetch booking details
        await fetchBookingDetails(doctorCustomId, response.data.patient_user.custom_id);
      } catch (error) {
        console.log(error);
      }
    };



  const fetchBookingDetails = async (doctorCustomId,patientId) => {
    try {   
      console.log(doctorCustomId,patientId,'iiiiiiiiiiiiiiggggggggggggggggggggggg');
       const response = await axios.get(`${baseUrl}appointment/booking/details/doctor/${doctorCustomId}/patient/${patientId}`);
       if (response.data.message) {
           // Display the custom error message
           console.error(response.data.message);
           // Optionally, show an alert or update the UI to inform the user
           toast.error(response.data.message);
           return; // Exit the function early if there's no data to process
       }
       setBookings(response.data);
       // Assuming each booking has a transaction_id, fetch patient details after setting booking
   
       // Extract the transaction_id from the first booking in the response data
       const appointmentId = response.data.data[0].transaction_id;
       console.log("Transaction ID:", appointmentId);
   
       // Now you can use the transactionId as needed, for example:
       connectToWebSocket(appointmentId);
   
    } catch (error) {
       console.error("Error fetching booking details:", error);
       // Optionally, handle other types of errors here
    }
};

 
  const connectToWebSocket = (appointmentId) => {
    console.log(appointmentId,'appointmentId');
    if (!appointmentId) return;

    console.log('pppppppppppppppppppppppppppppppppppp');
    const newClient = new W3CWebSocket(
      `ws://127.0.0.1:8000/ws/chat/${appointmentId}/`
    ); 
    setClient(newClient);

    newClient.onopen = () => {
      console.log("WebSocket Client Connected");
    };


    
    newClient.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setChatMessages((prevMessages) => [...prevMessages, data]);
    };



    const fetchExistingMessages = async () => {
      try {
        const response = await fetch(
          `${baseUrl}chat/chat-messages/transaction/${appointmentId}/`
        );

        if (!response.ok) {
          console.error(
            "Error fetching existing messages. Status:",
            response.status
          );
          return;
        }

        const data = await response.json();

        const messagesTextArray = data.map((item) => ({
          message: item.message,
          sendername: item.sendername,
        }));

        setChatMessages(messagesTextArray);
        console.log("Chat messages:", messagesTextArray);
      } catch (error) {
        console.error("Error fetching existing messages:", error);
      }
    };

    fetchExistingMessages();

    return () => {
      newClient.close();
    };
  };


 useEffect(() => {
    fetchDoctorID()
 }, []);

 useEffect(() => {
    if (socket) {
      socket.on('chat.message', (data) => {
        setMessages((messages) => [...messages, data]);
      });
    }
 }, [socket]);

 const sendMessage = () => {

console.log('fdasfgajhdhsajdfhasdfasdfasdfasf');
  const sendername = doct.first_name;
  console.log("SENDER NAME:", sendername,doct);

  const messageData = { message, sendername };
  const messageString = JSON.stringify(messageData);

  console.log("Sending Message:", messageString);

  client.send(messageString);
  setMessage("");
};


 return (
    <div>
       <div className="flex justify-end rounded-3xl">
         
           <div className='fixed bottom-10 right-8 bg-sky-100 md:w-[35%] z-50'>
           </div>
    
       </div>
      
       <div id="chat-container" className="fixed bottom-10 right-8 bg-white shadow-lg rounded-lg w-full md:w-[35%] z-50">
           <div className="bg-white shadow-md rounded-lg w-full">
           <div className="p-4 border-b bg-teal-700 text-white rounded-t-lg flex justify-between items-center">
 <p className="text-lg font-semibold">Chat</p>
 <button id="close-chat" className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
 </button>
</div>

<div id="chatbox" className="p-4 h-80 overflow-y-auto">
 <div className="h-[450px] overflow-scroll overflow-x-hidden">
    {chatMessages.map((message, index) => (

      <div key={index} className={`message p-2 rounded-lg mb-2 ${message.sendername === 'User' ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <p className="text-sm">{message.sendername}: {message.message}</p>
      </div>
    ))} 
 </div>
</div>
    
<div className="p-4 border-t flex">
 <label htmlFor="file-upload" className="cursor-pointer mx-2 flex items-center">
    <input id="file-upload" type="file" accept="image/, video/" style={{ display: 'none' }} />
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15.5C4 17.92 5.08 20 7 20M12 15.5C12 17.92 13.08 20 15 20M20 15.5C20 17.92 18.92 20 17 20M12 12.5C12 10.08 13.08 8 15 8M20 12.5C20 10.08 18.92 8 17 8M12 7.5C12 5.08 13.08 4 15 4M20 7.5C20 5.08 18.92 4 17 4M12 2.5C12 0.92 13.08 0 15 0M20 2.5C20 0.92 18.92 0 17 0"></path>
    </svg>
 </label>
 <input id="user-input" type="text" placeholder="Type a message" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
 <button id="send-button" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300" onClick={sendMessage}>Send</button>
</div>

           </div>
         </div> 
    </div>
   );
   
};

export default PatientChat;








// <div id="chat-container" className="  bottom-16  w-full ">
//                 <div className="bg-white shadow-md rounded-lg  w-full">
//                     <div className="p-4 border-b bg-teal-700 text-white rounded-t-lg flex justify-between items-center">
//                         <p className="text-lg font-semibold">Chat</p>
//                         <button onClick={handleClose} id="close-chat" className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
//                             </svg>
//                         </button>
//                     </div>
//                     <div id="chatbox" className="p-4 h-80 overflow-y-auto">

//                         <div className="h-[450px] overflow-scroll overflow-x-hidden ">
//                             {mediaPreview ? (
//                                 <>
//                                     <div className='cursor-pointer' onClick={() => { setMediaPreview(null); setMediaFile(null); }}>
//                                         close
//                                     </div>
//                                     <img src={mediaPreview} alt="Media Preview" className="w-[80%] h-[80%] mr-2" />
//                                 </>

//                             ) : (
//                                 <>
//                                     {message.map((m, index) => (
//                                         <div key={index} ref={index === message.length - 1 ? scrollRef : null}>
//                                             <Message message={m} own={m.senderId === userInfo?._id} sender={userInfo} />
//                                         </div>
//                                     ))}
//                                 </>
//                             )}
//                         </div>

//                     </div>
//                     <div className="p-4 border-t flex">
//                         <label htmlFor="file-upload" className="cursor-pointer mx-2 flex items-center">
//                             <FaImage size={25} />
//                             <input id="file-upload" type="file" onChange={handleFileChange} accept="image/, video/" style={{ display: 'none' }} />
//                         </label>
//                         <input id="user-input" type="text" placeholder="Type a message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                         <button id="send-button" className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300" onClick={handleSubmit}>Send</button>
//                     </div>
//                 </div>
//             </div>