import axios from 'axios';
import React from 'react';
import { baseUrl } from '../../../../utils/constants/Constants';
import { toast } from 'react-toastify';

function DeleteModal({ doctorId,setDeleteModalVisible }) {
  const handleYesClick = () => {
    // Construct the URL for the DELETE request
    const url = `${baseUrl}auth/admin/doc/delete/${doctorId}`;

    // Send the DELETE request
    axios.delete(url, { withCredentials: true })
        .then((res) => {
            // Log the response
            console.log(res);

            // Show a success toast message
            toast.success("Doctor Deleted Successfully");

            // Hide the delete modal
            setDeleteModalVisible(false);
        }).catch((error) => {
            // Log the error
            console.error("Error deleting doctor:", error);

            // Example of more specific error handling
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }
            console.error(error.config);

            // Optionally, show an error toast message
            toast.error("An error occurred while deleting the doctor.");
        });
};

  const handleNoClick = () => {
    // Close the modal without performing any action
    setDeleteModalVisible(false);
  };

  return (
    <div className="fixed left-0 right-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto top-4 md:inset-0 h-modal sm:h-full">
      <div className="w-full max-w-md px-4 md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex justify-end p-2">
            
          </div>
          <div className="p-6 pt-0 text-center">
            <svg
              className="w-16 h-16 mx-auto text-red-600 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-5 mb-6 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this item?
            </h3>
            <button
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2 dark:focus:ring-red-800"
              onClick={handleYesClick}
            >
              Yes, I'm sure
            </button>
            <button
              className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              onClick={handleNoClick}
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
