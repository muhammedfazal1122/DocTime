import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { baseUrl } from '../../utils/constants/Constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
   
function NotificationModal({ isOpen, customID, data }) {
  console.log(isOpen, customID, data,'firstLINEEEE');
  const [notifications, setNotifications] = useState([]);
  const debouncedToast = debounce((message) => {
    toast.info(`New Notification: ${message}`);
  }, 1000);

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${baseUrl}notifications/doctor-side/doctor-notification/${customID}/`);
        debouncedToast(response.data.notifications[0].message)
        setNotifications(response.data.notifications);
        setNotificationCount(response.data.notification_count);
        console.log('RESPONSE DATA in the notification:', response.data)
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (customID) {
      fetchNotifications();
    }

    // fetchNotifications();
  }, [data]);

  const handleNotificationClick = async (notification) => {
    try {
      await axios.put(
        `${baseUrl}notification/update-notification/${notification.id}/`,
        {
          is_seen: true,
        }
      );

      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n.id !== notification.id)
      );

      setNotificationCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const unseenNotifications = notifications.filter(
    (notification) => !notification.is_seen
  );

  return (
    <>
      {isOpen && (
        <div
        id="dropdownNotification"
        className={`fixed top-20 right-0 mt-2 w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700 transform ${
           isOpen ? "translate-x-0" : "translate-x-full"
        } ${
           isOpen ? "opacity-100" : "opacity-0"
        } transition-transform ease-in-out duration-300 ${
           isOpen ? "pointer-events-auto" : "pointer-events-none"
        } z-50`}
        aria-labelledby="dropdownNotificationButton"
       >
          <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
            Notifications
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {unseenNotifications.map((notification, index) => (
              <a
                key={notification.id || index}
                onClick={() => handleNotificationClick(notification)}
                className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex-shrink-0">
                  <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-blue-600 border border-white rounded-full dark:border-gray-800">
                    <svg
                      className="w-2 h-2 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 18"
                    >
                      <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
                      <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z" />
                    </svg>
                  </div>
                </div>
                <div className="w-full ps-3">
                  <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                    {notification.message}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-500">
                    a few moments ago
                  </div>
                </div>
              </a>
            ))}
          </div>
          <a
            href="#"
            className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
          >
            <div className="inline-flex items-center ">
              <svg
                className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 14"
              >
                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
              </svg>
              View all
            </div>
          </a>
        </div>
      )}
    </>
  )
}

export default NotificationModal;
