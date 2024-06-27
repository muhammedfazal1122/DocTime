import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { WebsocketbaseUrl, baseUrl } from '../../utils/constants/Constants';
import { jwtDecode } from 'jwt-decode';

const ChatComponent = () => {
  const navigate = useNavigate();
  const [patient_id, setPatientID] = useState(null);
  const [patient, setPatient] = useState('');
  const [bookings, setBookings] = useState([]);
  const [client, setClient] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access');
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;

      const patientIdResponse = await axios.get(baseUrl + `auth/custom-id/patient/${userId}`);
      const patientId = patientIdResponse.data.patient_user.custom_id;

      const bookingsResponse = await axios.get(`${baseUrl}appointment/api/patient-transactions/?patient_id=${patientId}`);
      const reversedBookings = bookingsResponse.data.reverse();

      setPatient(patientIdResponse.data);
      setPatientID(patientId);
      setBookings(reversedBookings);

      
      
    } catch (error) {
      navigate('/login');
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const storedChatMessages = localStorage.getItem('chatMessages');

    if (storedChatMessages) {
      setChatMessages(JSON.parse(storedChatMessages));
    }
  }, []);

  useEffect(() => {
    if (selectedAppointment) {
      connectToWebSocket(selectedAppointment.id);
    }
  }, [selectedAppointment]);

  const connectToWebSocket = (appointmentId) => {
    if (!appointmentId) return;

    const newClient = new W3CWebSocket(`${WebsocketbaseUrl}ws/chat/${appointmentId}/`);
    setClient(newClient);
    

    newClient.onopen = () => {
      
    };

    newClient.onmessage = (message) => {
      const data = JSON.parse(message.data);
      
      setChatMessages((prevMessages) => [...prevMessages, data]);
    };

    const fetchExistingMessages = async () => {
      try {
        const response = await fetch(`${baseUrl}chat/chat-messages/transaction/${appointmentId}/`);
        const data = await response.json();
        
        const messagesTextArray = data.map((item) => ({
          message: item.message,
          sendername: item.sendername,
        }));
        setChatMessages(messagesTextArray);
      } catch (error) {
        console.error('Error fetching existing messages:', error);
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
  };

  const sendMessage = () => {
    if (message.trim() === '' || !client || !selectedAppointment) {
      
      return;
    }

    const sendername = patient.first_name;
    const updatedChatMessages = [...chatMessages, { sendername, message }];

    localStorage.setItem('chatMessages', JSON.stringify(updatedChatMessages));

    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ message, sendername }));
      setMessage('');
    } else {
      
    }
  };

  return (
    <div>
      <main className="content" style={{ marginTop: '15px', marginBottom: '500px' }}>
        <div className="container p-0"></div>
        <div className="card">
          <div className="row g-0">
            <div className="chat-container">
              <div className="appointments-list">
                <h2>Connect With Salons</h2>
                <ul>
                  {bookings.map((booking) => (
                    <li key={booking.transaction_id} onClick={() => handleAppointmentClick(booking)}>
                      <div className="doctor-list-item d-flex align-items-start">
                        <img src={booking.doctor_profile_picture} alt="Doctor" className="rounded-circle mr-1" />
                        <div className="flex-grow-1 ml-3">
                          <div className="small">
                            <small style={{ fontSize: '16px', fontWeight: 'bold' }}>{booking.doctor_name}</small>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="chat-window">
                {selectedAppointment && (
                  <div>
                    <div className="selected-doctor-info d-flex align-items-center">
                      <img
                        src={`${selectedAppointment.doctor_profile_picture}`}
                        alt={selectedAppointment.doctor_profile_picture}
                        className="rounded-circle mr-1"
                        width={40}
                        height={40}
                      />
                      <div className="flex-grow-1">
                        <strong>{selectedAppointment.doctor_name}</strong>
                      </div>
                    </div>
                    <div className="chat-messages mt-2" style={{ display: 'flex', flexDirection: 'column' }}>
                      {chatMessages.map((msg, index) => (
                        <div key={index} className="message-container">
                          {msg.sendername === patient.first_name ? (
                            <div className="sent-message">
                              <strong>{msg.sendername}:</strong>
                              {msg.message}
                            </div>
                          ) : (
                            <div className="received-message">
                              <strong>{msg.sendername}:</strong> {msg.message}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="message-input">
                      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                      <button onClick={sendMessage}>Send</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatComponent;
