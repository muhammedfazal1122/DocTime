import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../../utils/constants/Constants";
import axios from "axios";
import { toast } from "react-toastify";
import { debounce } from 'lodash';  
import { useNavigate } from "react-router-dom";

function Notification() {
  const debouncedToast = debounce((message) => {
  toast.info(`New Notification: ${message}`);
}, 1000);

  const dispatch = useDispatch();
  const navigate=useNavigate()
  const [docID, setDoctId] = useState(null);

  const authentication_user = useSelector((state) => state.authentication_user);
  const [notifications, setNotification] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);



  const fetchData = async (customId) => {
    try {
      const response = await axios.get(
        `${baseUrl}notification/doctor-side/doctor-notification/${customId}/`
      );
      setNotification(response.data.notifications);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setNotification([]); // Initialize as an empty array

    if (!authentication_user.user_id) {
      navigate('/')
      
    } else {
      const userId = authentication_user.user_id;
      axios
        .get(baseUrl + `auth/custom-id/doctor/${userId}`)
        .then((res) => {
          setDoctId(res.data.doctor_user.custom_id);
          fetchData(res.data.doctor_user.custom_id);
          
          const wsURL = `ws://127.0.0.1:8000/ws/doctor-notification/${res.data.doctor_user.custom_id}/`;
          console.log('33333333333333333333');
          const socket = new WebSocket(wsURL);

          socket.onopen = () => {
            console.log("WebSocket connection established");
          };

          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "notification") {
              console.log("Notification is : ", data.type);
              console.log("*****", data);
              setNotification((prev) => [
                ...prev,
                data.payload,
              ]);
              debouncedToast(data.payload.message);
              console.log("DATA : : : : : : : ", data);
              console.log("NOTIFICATION LIST : ", notifications);
            }
          };

          socket.onclose = (event) => {
            console.log("WebSocket connection closed", event);
          };

          return () => {
            socket.close();
          };
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [authentication_user]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNotificationClick = async (notification) => {
    try {
      await axios.put(
        `${baseUrl}notification/update-notification/${notification.id}/`,
        {
          is_seen: true,
        }
      );

      setNotification((prevNotifications) =>
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
   
      <button
        id="dropdownNotificationButton"
        onClick={toggleDropdown}
        data-dropdown-toggle="dropdownNotification"
        className="relative inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
        type="button"
      >
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 14 20"
        >
          <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
        </svg>
        <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-0.5 start-2.5 dark:border-gray-900" />
      </button>
      {/* Dropdown menu */}
      <div
        id="dropdownNotification"
        className={`absolute top-full right-0 mt-2 w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700 transform ${
          isDropdownOpen ? "translate-x-0" : "translate-x-full"
        } ${
          isDropdownOpen ? "opacity-100" : "opacity-0"
        } transition-transform ease-in-out duration-300 ${
          isDropdownOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
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
                {/* <img
                className="rounded-full w-11 h-11"
                src="/docs/images/people/profile-picture-1.jpg"
                alt="Jese image"
              /> */}
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
    </>
  );
}

export default Notification;
