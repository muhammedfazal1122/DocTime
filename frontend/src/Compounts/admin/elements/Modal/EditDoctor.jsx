import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/constants/Constants";
import axios from "axios";
import { toast } from "react-toastify";

function EditDoctor({ doctorId, setIsDataFetched, setEditModalVisible }) {
 const [user, setUser] = useState({});
 const [docDetail, setDocDetail] = useState({});
 const [isKYCSubmitted, setIsKYCSubmitted] = useState(false); // Default value
 const [isKYCchecked, setIsKYCchecked] = useState(false); // Default value
 const [newStatus, setNewValue] = useState(''); // Default value

 useEffect(() => {
    axios.get(`${baseUrl}auth/admin/doc/edit-varification/${doctorId}/`).then((res) => {
      const { is_KYC_submitted } = res.data; // Assuming this is how the data is structured
      setIsKYCSubmitted(is_KYC_submitted); // Set default value based on backend response

      setUser({ ...res.data.user });
      setDocDetail(res.data);
      console.log(res.data, "reached to the editing component");
      setIsDataFetched(true);
    })
    .catch((err) => {
      console.log(err);
      toast.error(err);
    });
 }, [doctorId, setIsDataFetched,isKYCSubmitted]);

 const handleToggleChange = (isChecked) => {
  const newCheckedValue = !isKYCchecked; // Calculate the new value based on the current state
  setIsKYCchecked(newCheckedValue); 
  // Update the backend based on the isChecked value
  const dataToUpdate = {
    is_KYC_submitted: isChecked,
  };

  axios.patch(`${baseUrl}auth/admin/doc/edit-varification/${doctorId}/`, dataToUpdate)
    .then((res) => {
      setDocDetail(res.data);
      const { is_KYC_submitted } = res.data; // Assuming this is how the data is structured
      setIsKYCSubmitted(is_KYC_submitted); // Set default value based on backend response
      console.log("Backend updated successfully:", res.data);
      // Handle success as needed
    })
    .catch((err) => {
      console.error("Error updating backend:", err);
      // Handle error as needed
      toast.error(err.response.data.message);
      setIsKYCchecked(!newCheckedValue);

    });
};

const HandleStatus = (value) => {
  const newStatus = value;
  setNewValue(newStatus)
  
  console.log(newStatus,'lllllllllllllllllllllllllll');

  const newStatusres = {
    approval_status: newStatus,
  };

  axios.patch(`${baseUrl}auth/admin/doc/edit-varification/${doctorId}/`, newStatusres,)
    .then((res) => {
      console.log("Backend updated successfully:", res.data);
      setUser({ ...res.data.user });
      // Handle success as needed
    })
    .catch((err) => {
      console.error("Error updating backend:", err);
      // Handle error as needed
      toast.error(err.response.data.message);
    });
};



 return (
    <>
      <div className="col-span-2">
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold dark:text-white">
            Doctor information
          </h3>
          <form >
          <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 sm:col-span-3">
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                 First Name
                </label>
                <input
                 type="text"
                 name="first_name"
                 value={user.first_name || ""}
                 id="first_name"
                 className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                 placeholder="Phone Number"
                 onChange={(e) => handleInputChange("first_name", e.target.value)}
                 readOnly
                />
              </div>
              
          <div className="col-span-6 sm:col-span-3">
                <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Last Name
                </label>
                <input
                 type="text"
                 name="last_name"
                 value={user.last_name || ""}
                 id="last_name"
                 className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                 placeholder="Phone Number"
                 onChange={(e) => handleInputChange("last_name", e.target.value)}
                 readOnly
                />
              </div>
              
              
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                 Phone Number
                </label>
                <input
                 type="text"
                 name="phone_number"
                 value={user.phone_number || ""}
                 id="phone_number"
                 className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                 placeholder="Phone Number"
                 onChange={(e) => handleInputChange("phone_number", e.target.value)}
                 readOnly
                />
              </div>
              {/* -------------------------------------------------------------------------- */}
             
             
              {/* Add other fields similarly */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Gender 
                </label>
                <input
                 type="text"
                 name="gender"
                 value={user.gender || ""}
                 id="gender"
                 className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                 placeholder="Phone Number"
                 onChange={(e) => handleInputChange("gender", e.target.value)}
                 readOnly
                />
              </div>
              {/* Add other fields similarly */}

              
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="zip_code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                 Zip Code
                </label>
                <input
                 type="text"
                 name="zip_code"
                 value={user.zip_code || ""}
                 id="zip_code"
                 className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                 placeholder="Zip Code"
                 onChange={(e) => handleInputChange("zip_code", e.target.value)}
                 readOnly
                />
              </div>

          
 
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                state
                </label>
                <input
                 type="text"
                 name="state"
                 value={user.state || ""}
                 id="state"
                 className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                 placeholder="state"
                 onChange={(e) => handleInputChange("state", e.target.value)}
                 readOnly
                />
              </div>
          
             {/* Add other fields similarly */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="aadhaarNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Aadhaar Number
                </label>
                <input
                 type="text"
                 name="aadhaarNumber"
                 value={docDetail.aadhaarNumber || ""}
                 id="aadhaarNumber"
                 className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                 placeholder="aadhaarNumber"
                 onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                 readOnly
                />
              </div>
             {/* Add other fields similarly */}

     {/* Other fields */}
     <div className="col-span-6 sm:col-span-3">
                <label htmlFor="register_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                 Register Number
                </label>
                <input
                 type="text"
                 name="register_number"
                 value={docDetail.register_number || ""}
                 id="register_number"
                 className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                 placeholder="Register Number"
                 onChange={(e) => handleInputChange("register_number", e.target.value)}
                 readOnly
                />
              </div>
        
            
             {/* Add other fields similarly */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="qualificationImage" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">
                qualificationImage
                </label>
                
                {docDetail.qualificationImage && (
                 <img src={docDetail.qualificationImage} alt="Qualification Image" className="mt-2 w-full h-auto" />
                )}
              </div>
             {/* Add other fields similarly */}
             {/* Add other fields similarly */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="licencecertificateImage" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">
                licencecertificateImage
                </label>
              

                  {docDetail.licencecertificateImage && (
                 <img src={docDetail.licencecertificateImage}
                  alt="Licence Certificate Image" className="mt-2 w-full h-auto" />
                )}
            
              </div>
             {/* Add other fields similarly */}
           
           <div className="col-span-6 sm:col-span-3">
    <label htmlFor="approval_status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Approval Status
    </label>
    <select
        name="approval_status"
        id="approval_status"
        value={docDetail.approval_status || ""}
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        onChange={(e) => HandleStatus(e.target.value)}
    >
        <option > {user.approval_status || ""} </option>
        <option value="PENDING">PENDING</option>
        <option value="APPROVED">APPROVED</option>
        <option value="REJECTED">REJECTED</option>
    </select>
</div>



        
        

           
           <div className="grid grid-cols-1 gap-6">
 {/* Other form fields */}

 {/* Position the is_KYC_submitted toggle button at the right bottom */}
 <div className="col-span-6 sm:col-span-3">
    <label htmlFor="is_KYC_submitted" className="ml-5 font-bold text-gray-700 dark:text-white">
      is_KYC_submitted
    </label>
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox"
        readOnly
        name="is_KYC_submitted"
        checked={isKYCSubmitted}
        id="is_KYC_submitted"
        className="sr-only peer"
        onChange={(e) => handleToggleChange(e.target.checked)}
      />
      <div className="group peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-24 h-12 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-10 after:w-10 after:top-1 after:left-1 after:-rotate-180 after:flex after:justify-center after:items-center peer-checked:after:translate-x-12 peer-checked:after:content-['✔️'] peer-hover:after:scale-95 peer-checked:after:rotate-0">
      </div>
    </label>
 </div>
</div>

{/* ......................................................................................................... */}


<div className="col-span-6 sm:col-span-3">
          <input
            type="checkbox"
            name='is_active'
            checked={user.is_active || false}
            id='is_active'
            className="form-checkbox h-5 w-5 text-primary-500"
            readOnly
          />
          <label
            htmlFor='is_active'
            className="ml-2 text-gray-700 dark:text-white"
          >
            is_active
          </label>
        
           </div>
   
              {/* Add other fields similarly */}
            </div>
        
          </form>
        </div>
      </div>
    </>
 );
}

export default EditDoctor;
