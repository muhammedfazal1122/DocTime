import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const NotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        
        const socket = io('http://localhost:8000/ws/notifications/');
        socket.on('notification', (data) => {
            setNotifications([...notifications, data.message]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Notifications</h1>
            {notifications.map((notification, index) => (
                <p key={index}>{notification}</p>
            ))}
        </div>
    );
};

export default NotificationComponent;
