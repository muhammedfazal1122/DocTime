import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../utils/constants/Constants";
import { jwtDecode } from "jwt-decode";
const DoctorChat = () => {
  const chatContainerRef = useRef();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [bookings, setBookings] = useState([]);
  console.log("BOOKINGS:", bookings);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [client, setClient] = useState(null);
  console.log("CLIENT:", client);
 

  const [patient_id, setPatientID] = useState(null);
  const [doct, setdoct] = useState("");

  const fetchBookings = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}appointment/api/doctor-transactions/?doctor_id=${id}`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    }
 };

 const fetchDoctorID = (id) => {
    axios.get(baseUrl + `auth/custom-id/doctor/${id}`)
      .then((res) => {
        setdoct(res.data);
        fetchBookings(res.data.doctor_user.custom_id);
      })
      .catch((error) => {
        console.log(error);
      });
 };

 const fetchUserID = () => {
    const token = localStorage.getItem("access");
    const decoded = jwtDecode(token);
    fetchDoctorID(decoded.user_id);
 };

 useEffect(() => {
    fetchUserID();
 }, []);

 useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };
    scrollToBottom();
 }, [chatMessages]);

 useLayoutEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };
    scrollToBottom();
 }, [chatMessages]);

 const connectToWebSocket = (appointmentId) => {
    if (!appointmentId) return;
    if (client) {
      client.close();
    }
    const newClient = new W3CWebSocket(`ws://127.0.0.1:8000/ws/chat/${appointmentId}/`);
    setClient(newClient);

    newClient.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    newClient.onmessage = (message) => {
      const data = JSON.parse(message.data);
      // Prevent duplicate messages
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

 const handleAppointmentClick = (booking) => {
    setSelectedAppointment(booking);
    setChatMessages([]);
    connectToWebSocket(booking.transaction_id);
 };

 const sendMessage = () => {
    if (!client || client.readyState !== client.OPEN) {
      console.error("WebSocket is not open");
      return;
    }

    const sendername = doct.first_name;
    const messageData = { message, sendername };
    const messageString = JSON.stringify(messageData);

    client.send(messageString);
    setMessage(""); // Clear the input field after sending

    // Add the sent message to the chatMessages state to reflect it in the UI
    // setChatMessages((prevMessages) => [...prevMessages, messageData]);
 };



 return (
    <div className="flex flex-col md:flex-row h-screen antialiased text-gray-800">
      {/* Sidebar */}
      <div className="flex flex-col py-8 pl-6 pr-2 w-full md:w-64 bg-white flex-shrink-0">
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
        {/* Conversations */}
        <div className="flex flex-col mt-8">
          {/* Active Conversations */}
          <div className="flex flex-row items-center justify-between text-xs">
            <span className="font-bold">Active Conversations</span>
          </div>
          {/* Conversation List */}
          <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
            {bookings.map((booking, index) => (
              <button
                key={index}
                className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                onClick={() => handleAppointmentClick(booking)}
              >
                <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                 {booking.patient_name ? booking.patient_name.charAt(0).toUpperCase() : 'N/A'}
                </div>
                <div className="ml-2 text-sm font-semibold">
                 {booking.patient_name ? booking.patient_name : 'No Patient Name'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Main Chat Area */}
      <div className="flex flex-col flex-auto h-full p-6">
        {/* Messages */}
        <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
          {/* Message List */}
          <div className="flex flex-col h-full overflow-y-auto mb-4" ref={chatContainerRef}>
            {chatMessages.map((message, index) => (
              <div key={index} className={`col-span-12 p-2 rounded-lg ${message.sendername === doct.first_name ? 'self-end' : 'self-start'}`}>
                <div className={`flex items-center ${message.sendername === doct.first_name ? 'justify-end' : 'justify-start'}`}>
                 <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                      {message.sendername ? message.sendername.charAt(0).toUpperCase() : 'N/A'}
                    </div>
                 </div>
                 <div className={`ml-3 ${message.sendername === doct.first_name ? 'bg-indigo-200' : 'bg-gray-200'} rounded-lg p-2`}>
                    <p className="text-sm font-medium text-gray-900">{message.message}</p>
                 </div>
                </div>
              </div>
            ))}
          </div>
          {/* Message Input */}
          <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
            <div className="flex-grow ml-4">
              <div className="relative w-full">
                <input
                 type="text"
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                />
                {/* Send Button */}
                <button
                 onClick={sendMessage}
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
                onClick={sendMessage}
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
 );
};

export default DoctorChat;