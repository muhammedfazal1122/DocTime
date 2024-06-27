import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import userImage from "../../../../public/assets/avatar/avatar_6.jpg";
import { toast } from "react-toastify";
import { baseUrl } from "../../../utils/constants/Constants";

function MyProfile() {
  const UserFields = [
    "first_name",
    "last_name",
    "gender",
    "phone_number",
    "date_of_birth",
    "street",
    "city",
    "state",
    "zip_code",
    "country",
  ];

  const fieldInputTypes = {
    first_name: "text",
    last_name: "text",
    gender: "select",
    phone_number: "text",
    date_of_birth: "date",
    street: "text",
    city: "text",
    state: "text",
    zip_code: "text",
    country: "text",
    date_joined: "text",
    specializations: "text",
  };

  const specializationOptions = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];

  const [profile, setProfile] = useState(null); // it's use for storing the image

  const [about, setAbout] = useState([]); // it's used to store the all profile information about the users

  const [id, setId] = useState(null);

  const [docid, setdocid] = useState("");

  const [user, setUser] = useState({});
  const [specializations, setSpecializations] = useState("");
  const [docDetail, setDocDetail] = useState({});
  const [wallet, setWallet] = useState(0);

  // for booking details

  const [booking, setBooking] = useState(null);


  // ---------------------  Portion for uploding the image   ---------------------

  const fileInputRef = useRef(null);
  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    let form_data = new FormData();
    form_data.append("profile_picture", file, file.name);

    await axios
      .patch(baseUrl + `auth/doc/update/${id}`, form_data)
      .then((res) => {
        fetchData();
        toast.success("profile pic has been updated");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  const profileDelete = async () => {
    let form_data = new FormData();
    form_data.append("profile_picture", ""); // Set to an empty string or any placeholder value
    // Add other fields to form_data as needed
    await axios
      .patch(baseUrl + `auth/doc/update/${id}`, form_data)
      .then((res) => {
        fetchData();
        toast.success("profile pic deleted successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };


  // ........................... fetch user data........................................................
  const fetchData = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      console.log(refreshToken, "nooooooooooooo");

      let decoded = jwtDecode(refreshToken);
      console.log(decoded, "hh   hhhhhhhhhhhhhhhhhhhhhhhh");
      let id = decoded.user_id;
      console.log(id);
      setId(id);

      const doct = await axios.get(baseUrl + "auth/patient/list/" + id);
      if (doct.status === 200) {
        setProfile(doct.data.profile_picture);
        setAbout(doct.data);
        setdocid(doct.data.patient_user.custom_id);

        axios
          .get(
            baseUrl + `auth/admin/client/${doct.data.patient_user.custom_id}`
          )
          .then((res) => {
            setUser({ ...res.data.user }); // Spread the user object to avoid mutation
            setSpecializations(res.data.specializations || "");
            setDocDetail(res.data);
            console.log(res.data, "reached to the editing component");
          })
          .catch((err) => {
            console.log(err);
            toast.error(err);
          });
      }
      // Handle the response data as needed
      console.log(doct.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ...............................useEffect...............................
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, [wallet]);

  
  const handleInputChange = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
    validateField(field, value);
  };

  const handleCheckboxChange = (field, checked) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: checked,
    }));
    validateField(field, checked);
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;

    if (field === "specializations") {
      setSpecializations(value);
      validateField(field, value);
    } else if (field.includes(".")) {
      const [nestedField, subField] = field.split(".");
      setUser((prevUser) => ({
        ...prevUser,
        [nestedField]: {
          ...prevUser[nestedField],
          [subField]: value,
        },
      }));
      validateField(subField, value);
    } else {
      handleInputChange(field, value);
      validateField(field, value);
    }
  };

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "first_name":
      case "last_name":
        // Validate that the name contains only letters
        if (!/^[a-zA-Z]+$/.test(value)) {
          error = "Name should only contain letters.";
        }
        break;

      case "phone_number":
        // Validate phone number - 10 digits only
        if (!/^[0-9]{10}$/.test(value)) {
          error = "Invalid phone number. It should contain 10 digits.";
        }
        break;

      case "date_of_birth":
        // Validate date of birth - 10 years before the current date
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 5);
        if (new Date(value) > tenYearsAgo) {
          error = "Date of birth should be at least 5 years ago.";
        }
        break;

      case "zip_code":
        // Validate zip code - 6 digits only
        if (!/^[0-9]{6}$/.test(value)) {
          error = "Invalid zip code. It should contain 6 digits.";
        }
        break;

      // Add more cases for other fields if needed

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if there are any errors before submitting the form
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (!hasErrors) {
      // Create a FormData object
      const formData = new FormData();

      // Append user data to the form data
      Object.keys(user).forEach((key) => {
        formData.append(`user.${key}`, user[key]);
      });

      // Append other data to the form data
      formData.append("specializations", specializations);

      // Make the API request
      axios
        .patch(baseUrl + `auth/admin/client/${docid}`, formData)
        .then((res) => {
          console.log("Data updated successfully:", res.data);
          toast.success("Data updated successfully");
          // Optionally, you can reset the form or handle other actions
        })
        .catch((err) => {
          console.error("Error updating data:", err);
          // Handle the error as needed
        });
    } else {
      console.log("Form has errors. Please fix them before submitting.");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
        <div className="mb-4 col-span-full xl:mb-2">
          <nav className="flex mb-5" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
              <li className="inline-flex items-center">
                <a
                  href="#"
                  className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white"
                >
                  <svg
                    className="w-5 h-5 mr-2.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <a
                    href="#"
                    className="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white"
                  >
                    Users
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span
                    className="ml-1 text-gray-400 md:ml-2 dark:text-gray-500"
                    aria-current="page"
                  >
                    Settings
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
            User settings
          </h1>
        </div>
        {/* profile image portion */}
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
              <img
                className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
                src={profile || userImage}
                alt="Profile picture"
              />
              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                  Profile picture
                </h3>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  JPG, GIF or PNG. Max size of 800K
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileInputChange}
                  />

                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <svg
                      className="w-4 h-4 mr-2 -ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                      <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                    </svg>
                    Upload picture
                  </button>
                  <button
                    type="button"
                    onClick={profileDelete}
                    className="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>



        
        </div>

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
                    htmlFor="specializations"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Blood Group
                  </label>
                  <select
                    name="specializations"
                    value={specializations}
                    onChange={(e) => handleSelectChange(e, "specializations")}
                    id="specializations"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required=""
                  >
                    <option value="">Select Blood group</option>
                    {specializationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
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
                      <select
                        name={field}
                        value={user[field] || ""}
                        onChange={(e) => handleSelectChange(e, field)}
                        id={field}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required=""
                      >
                        {field === "gender" ? (
                          <>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </>
                        ) : (
                          <option value={user[field] || ""}>
                            {user[field] || ""}
                          </option>
                        )}
                      </select>
                    ) : fieldInputTypes[field] === "checkbox" ? (
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          name={field}
                          checked={user[field] || false}
                          id={field}
                          className="form-checkbox h-5 w-5 text-primary-500"
                          onChange={(e) =>
                            handleCheckboxChange(field, e.target.checked)
                          }
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
                      <div>
                        <input
                          type={fieldInputTypes[field]}
                          name={field}
                          value={user[field] || ""}
                          id={field}
                          className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
                            errors[field] ? "border-red-500" : ""
                          }`}
                          placeholder={user[field] || ""}
                          onChange={(e) =>
                            handleInputChange(field, e.target.value)
                          }
                          required=""
                        />
                        {errors[field] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[field]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="col-span-6 sm:col-full">
                  <button
                    className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    type="submit"
                  >
                    Save all
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyProfile;
