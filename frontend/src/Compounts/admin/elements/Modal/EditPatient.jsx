import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/constants/Constants";
import axios from "axios";
import { toast } from "react-toastify";

function EditPatient({ doctorId, setIsDataFetched, setEditModalVisible }) {
  const UserFields = [
    "username",
    "first_name",
    "last_name",
    "gender",
    "phone_number",
    "date_of_birth",
    "approval_status",
    "street",
    "city",
    "state",
    "zip_code",
    "country",
    "is_id_verified",
    "is_email_verified",
    "is_active",
  ];

  const fieldInputTypes = {
    username: "text",
    first_name: "text",
    last_name: "text",
    gender: "select",
    phone_number: "text",
    date_of_birth: "text",
    approval_status: "text",
    street: "text",
    city: "text",
    state: "text",
    zip_code: "text",
    country: "text",
    is_id_verified: "checkbox",
    date_joined: "text",
    is_email_verified: "checkbox",
    is_active: "checkbox",
    blood_group: "text",
  };

  const blood_groupOptions = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
];


  const [user, setUser] = useState({});
  const [specializations, setSpecializations] = useState("");
  const [docDetail, setDocDetail] = useState({});

  const handleInputChange = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field, checked) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: checked,
    }));
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;

    if (field === "blood_group") {
      setSpecializations(value);
    } else if (field.includes(".")) {
      const [nestedField, subField] = field.split(".");
      setUser((prevUser) => ({
        ...prevUser,
        [nestedField]: {
          ...prevUser[nestedField],
          [subField]: value,
        },
      }));
    } else {
      handleInputChange(field, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a FormData object
    const formData = new FormData();

    // Append user data to the form data
    Object.keys(user).forEach((key) => {
      formData.append(`user.${key}`, user[key]);
    });

    // Append other data to the form data
    formData.append("blood_group", specializations);

    // Make the API request
    axios
      .patch(baseUrl + `auth/admin/client/${doctorId}`, formData)
      .then((res) => {
        
        toast.success("Data updated successfully");
        setEditModalVisible(false);
        // Optionally, you can reset the form or handle other actions
      })
      .catch((err) => {
        console.error("Error updating data:", err);
        // Handle the error as needed
        toast.error(err.response.data.user.date_of_birth[0]);
      });
  };

  useEffect(() => {
    axios
      .get(baseUrl + `auth/admin/client/${doctorId}`)
      .then((res) => {
        setUser({ ...res.data.user }); // Spread the user object to avoid mutation
        setSpecializations(res.data.blood_group || "");
        setDocDetail(res.data);
      
      setIsDataFetched(true);
    })
    .catch((err) => {
      
      toast.error(err);
    });
 }, [doctorId, setIsDataFetched]);

  return (
    <>
      {/* **************************************************General information********************************************************/}

      <div className="col-span-2">
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold dark:text-white">
            General information
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              {/* Display Specializations */}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="blood_group"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Blood Group
                </label>
                <input
                readOnly
                  name="blood_group"
                  Value={specializations}
                  
                  id="d"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required=""
                >
                                  
                </input>
              </div>
              

              {UserFields.map((field, index) => (
                <div key={index} className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor={field}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace("_", " ")}
                  </label>
                  {fieldInputTypes[field] === "select" ? (
                    <input
                    readOnly
                      name={field}
                      value={user[field] || ""}
                      onChange={(e) => handleSelectChange(e, field)}
                      id={field}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required=""
                    >
                      
                    </input>
                  ) : fieldInputTypes[field] === "checkbox" ? (
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        name={field}
                        checked={user[field] || false}
                        id={field}
                        className="form-checkbox h-5 w-5 text-primary-500"
                        
                      />
                      <label
                        htmlFor={field}
                        className="ml-2 text-gray-700 dark:text-white"
                      >
                        {field.charAt(0).toUpperCase() +
                          field.slice(1).replace("_", " ")}
                      </label>
                    </div>
                  ) : (
                    <input
                    readOnly
                      type={fieldInputTypes[field]}
                      name={field}
                      value={user[field] || ""}
                      id={field}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder={user[field] || ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      required=""
                    />
                  )}
                </div>
              ))}

              <div className="col-span-6 sm:col-full">
        
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditPatient;
