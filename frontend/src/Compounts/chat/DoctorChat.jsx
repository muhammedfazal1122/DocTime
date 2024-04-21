import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { baseUrl } from '../../utils/constants/Constants';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const DoctorChat = ({  }) => {
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
 const [transactionId, setTransactionId] = useState(null);
 const  doctorCustomId = localStorage.getItem('custom_id')
 const authToken = localStorage.getItem('access');
 const decoder = jwtDecode(authToken);
 const userId = decoder.user_id;

 useEffect(() => {
    fetchDoctorID();
 }, []);

 const fetchDoctorID = async () => {
    try {
      const response = await axios.get(`${baseUrl}auth/custom-id/patient/${userId}`);
      console.log('rrrrrrrrrreeeeeeeeeeessssssssssssssss',response);
      if (response.data && response.data.patient_user) {
        setdoct(response.data);
        setPatientID(response.data.patient_user.custom_id);
        console.log(response.data.patient_user.custom_id,'userIduserId');

        await fetchBookingDetails(doctorCustomId, response.data.patient_user.custom_id);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.log(error);
    }
 };

 const fetchBookingDetails = async (doctorCustomId, patientId) => {

    try {
      
      const response = await axios.get(`${baseUrl}appointment/booking/details/doctor/${doctorCustomId}/patient/${patientId}`);
      setBookings(response.data);
      const appointmentId = response.data.data[0].transaction_id;
      setTransactionId(appointmentId);
      connectToWebSocket(appointmentId);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.error("An error occurred. Please try again.");
    }
 };

 const connectToWebSocket = (appointmentId) => {
  console.log(appointmentId,'aaaaaaaappppppppppppppppooooooooooooooooooo');
    if (!appointmentId) return;

    const newClient = new W3CWebSocket(`ws://127.0.0.1:8000/ws/chat/${appointmentId}/`);
    setClient(newClient);

    newClient.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    newClient.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (!chatMessages.some(msg => msg.message === data.message)) {
        setChatMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    const fetchExistingMessages = async () => {
      try {
        const response = await fetch(`${baseUrl}chat/chat-messages/transaction/${appointmentId}/`);
        if (!response.ok) {
          console.error("Error fetching existing messages. Status:", response.status);
          return;
        }
        const data = await response.json();
        const messagesTextArray = data.map((item) => ({
          message: item.message,
          sendername: item.sendername,
        }));
        setChatMessages(messagesTextArray);
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
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
 }, [chatMessages]);

 const sendMessage = () => {
    if (!client || client.readyState !== client.OPEN) {
      console.error("WebSocket is not open");
      return;
    }

    const sendername = doct.first_name;
    console.log("SENDER NAME:", sendername);

    const messageData = { message, sendername };
    const messageString = JSON.stringify(messageData);

    console.log("Sending Message:", messageString);

    client.send(messageString);
    setChatMessages((prevMessages) => [...prevMessages, messageData]);
    setMessage("");
 };
 return (
<div>
  
  
    <div className='ml-8 mr-5 mb-5 mt-3'>
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          {/* Sidebar */}
          <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
            {/* Header */}
            <div className="flex flex-row items-center justify-center h-12 w-full">
              <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                {/* SVG icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
              <div className="ml-2 font-bold text-2xl">QuickChat</div>
            </div>
            {/* User Profile */}
            <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
              {/* User Avatar */}
              <div className="h-20 w-20 rounded-full border overflow-hidden">
                <img src="https://avatars3.githubusercontent.com/u/2763884?s=128" alt="Avatar" className="h-full w-full" />
              </div>
              <div className="text-sm font-semibold mt-2">Aminos Co.</div>
              <div className="text-xs text-gray-500">Lead UI/UX Designer</div>
              {/* Status */}
              <div className="flex flex-row items-center mt-3">
                <div className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full">
                  <div className="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
                </div>
                <div className="leading-none ml-1 text-xs">Active</div>
              </div>
            </div>
            {/* Conversations */}
            <div className="flex flex-col mt-8">
              {/* Active Conversations */}
              <div className="flex flex-row items-center justify-between text-xs">
                <span className="font-bold">Active Conversations</span>
                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">4</span>
              </div>
              {/* Conversation List */}
              <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
                {/* Conversation Item */}
                <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                  <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">H</div>
                  <div className="ml-2 text-sm font-semibold">Henry Boyd</div>
                </button>
                {/* Add more conversation items as needed */}
              </div>
   
  
            </div>
          </div>
          {/* Main Chat Area */}
          <div className="flex flex-col flex-auto h-full p-6">
            {/* Messages */}
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              {/* Message List */}
{/* Message List */}
    <div className="flex flex-col h-full overflow-x-auto mb-4" ref={chatContainerRef}>
    {/* Message Item */}
    <div className="grid grid-cols-12 gap-y-2">
        {chatMessages.map((message, index) => (
          <div key={index} className="col-span-12 p-2 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* You can add an avatar or initials here */}
                <span className="text-xs font-medium text-gray-900">{message.sendername}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{message.message}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
    </div>

              {/* Message Input */}
              <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
 <div className="flex-grow ml-4">
    <div className="relative w-full">
      <input
        type="text"
        value={message} // Bind the input value to the message state
        onChange={(e) => setMessage(e.target.value)} // Update the message state on input change
        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
      />
      {/* Send Button */}
      <button
        onClick={sendMessage} // Call sendMessage when the button is clicked
        className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </button>
    </div>
 </div>
 {/* Send Button */}
 <div className="ml-4">
    <button
      onClick={sendMessage} // Call sendMessage when the button is clicked
      className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
    >
      <span>Send</span>
      <span className="ml-2">
        <svg className="w-4 h-4 transform rotate-45 -mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
        </svg>
      </span>
    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>
      </div>
   );
   
};

export default DoctorChat;




