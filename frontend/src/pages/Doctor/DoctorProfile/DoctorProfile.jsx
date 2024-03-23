
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_profile } from '../../../Redux/UserProfileSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProfileCard from '../../../Compounts/ProfileCard/ProfileCard';
import { Link, useNavigate } from 'react-router-dom';

const DoctorProfile = ({refresh}) => {
 const baseURL = "http://127.0.0.1:8000";
 const navigate = useNavigate();
 const [Count, setCount] = useState(0)
 const userId = useSelector(state => state.authentication_user.user_id);
 console.log(userId,'uuuuuuuuuuuuuuuuurrrrrrrrrrrrrrrrrrrrrr');
 const dispatch = useDispatch();
 const [profile_picture_state, setProfilePicture] = useState(null)


 const [formData, setFormData] = useState({
  first_name: '',
  last_name: '',
  gender: '',
  phone_number: '',
  date_of_birth: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  profile_picture: null,
  full_name: '',
  specializations: '',
  consultaion_fees: '',
  consultation_duration: '',
  consultation_slots: '',
  education: '',
  college_name: '',
  about_me: '',
  Hospital: '',
  rating: '',
  user: {
     first_name: '',
     gender: '',
     phone_number: '',
     date_of_birth: '',
     city: '',
     state: '',
     zip_code: '',
     country: '',
   
  },
 });
 

const fetchData = async () => {
  try {
    const authToken = localStorage.getItem('access');
    const response = await axios.get(`${baseURL}/auth/docdetailes/${userId}/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log(response,'lllllllllllllllllllllllllllllllllll');
    const { data } = response;
    setFormData({
      ...formData,
      first_name: data.first_name,
      last_name: data.last_name,
      gender: data.gender,
      phone_number: data.phone_number,
      date_of_birth: data.date_of_birth,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      country: data.country,
      full_name: data.doctor_user.full_name,
      specializations: data.doctor_user.specializations,
      consultaion_fees: data.doctor_user.consultaion_fees,
      consultation_duration: data.doctor_user.consultation_duration,
      consultation_slots: data.doctor_user.consultation_slots,
      education: data.doctor_user.education,
      college_name: data.doctor_user.college_name,
      about_me: data.doctor_user.about_me,
      Hospital: data.doctor_user.Hospital,
      rating: data.doctor_user.rating,
    });
    localStorage.setItem('Doc_profile_pic', data.profile_picture);
    console.log(data,'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
  } catch (error) {
    toast.error("Error fetching profile data.");
  }
};

useEffect(() => {
  fetchData();
}, []);

const handleChange = (e) => {
  const { name, value } = e.target;
  if (name.startsWith('user.')) {
     // If the input is for the user object, update it accordingly
     const [userKey, userField] = name.split('.');
     setFormData(prevState => ({
       ...prevState,
       user: {
         ...prevState.user,
         [userField]: value,
       },
     }));
  } else {
     // Otherwise, update the main formData object
     setFormData({ ...formData, [name]: value });
  }
 };
 

const handleFileChange = (e) => {
  setFormData({ ...formData, profile_picture: e.target.files[0] });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const authToken = localStorage.getItem('access');
    const response = await axios.patch(`${baseURL}/auth/doctor-update/${userId}/`, formData, {
    

      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Form Data:', formData); // Add this line to print the form data

    setFormData(response.data)
    toast.success("Profile updated successfully.");
  } catch (error) {
    toast.error("Error updating profile.");
  }
};


const uploadProfilePicture = async () => {
  try {
    const authToken = localStorage.getItem('access');
    const formData = new FormData();
    const fileInput = document.querySelector('input[name="profile_picture"]');
    formData.append('profile_picture', fileInput.files[0]); 
    // Append the file from the input element
    const response = await axios.post(`${baseURL}/auth/profilepic-update/`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    setProfilePicture(response.data.profile_picture)

    dispatch(set_profile({
      name: response.data.first_name,
      profile_pic: response.data.profile_picture,
    }));
  } catch (error) {
    toast.error("Error updating profile picture. Please try again later.");
  }
};

    return (
      <>
 <div className="flex flex-col md:flex-row justify-center items-center ">

  {/* <div className="max-w-screen-lg flex"> */}
        
  <div className="ProfileCard w-full md:w-1/3 justify-center">
        <ProfileCard profile_pic={profile_picture_state} />
      </div>



      {/* Form */}
      <div className="parentfrom1 w-full md:w-1/3 justify-center">
      <div className="flex justify-center"> {/* Center the form */}

        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-slate-400 py-12 px-6 shadow sm:rounded-lg sm:px-10">
              <div>

              <h2 className="text-center text-black font-semibold mb-4">Personal Information</h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
               
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name 
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={formData.first_name}
                      onChange={handleChange}/>
                  </div>
                </div>
      {/* -------------------------------------------------------------------------------- */}
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="gender"
                      id="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    />
                  </div>
                </div>
          
      {/* ------------------------------------------------------------- */}
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="phone_number"
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>
      {/* ------------------------------------------------------------- */}
   
    {/* ------------------------------------------------------------- */}
    <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                  DOB
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="date"
                      name="date_of_birth"
                      id="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      />
                  </div>
                </div>
           

      {/* ------------------------------------------------------------- */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>
      {/* ------------------------------------------------------------- */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="state"
                      id="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>
      {/* ------------------------------------------------------------- */}
                <div>
                  <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">
                  Zip Code
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="zip_code"
                      id="zip_code"
                      value={formData.zip_code}
                      onChange={handleChange}
                    />
                  </div>
                </div>
      {/* ------------------------------------------------------------- */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="country"
                      id="country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
      {/* ------------------------------------------------------------- */}
             
  

      {/* ------------------------------------------------------------- */}
         
                 {/* ------------------------------------------------------------- */}
                 <div className="col-span-3">
                  <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700">
                    Profile Picture
                    </label>
                        <div className="mt-1">
                          <input
                            type="file"
                            accept="image/*"
                            name="profile_picture"
                            id="profile_picture"
                            onChange={handleFileChange} // Call handleFileChange
                          />
                        </div>
                  <button className="reserntclasssname" onClick={uploadProfilePicture} >
                Update Profile Picture
                </button>
                  </div>
                        {/* Add similar blocks for other fields */}

                <div className="flex items-center justify-center col-span-2">
                  <button 
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    type="submit">
                    Update
                  </button>
                  <div>

                  </div>
                </div>  
              </form>
                </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
    
    
    
    
    {/* ------------------------------------------------------FORM 2--------------------------- */}
    
    
    <div className="parentfrom1 w-full md:w-1/3 justify-center">
      <div className="flex justify-center"> {/* Center the form */}

        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-slate-400 py-12 px-6 shadow sm:rounded-lg sm:px-10">
              <div>
              <h2 className="text-center text-black font-semibold mb-4">Professional Information</h2>

           
              <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="full_name"
                      id="full_name"
                      value={formData.full_name}
                      onChange={handleChange}/>
                  </div>
                </div>
      {/* -------------------------------------------------------------------------------- */}
      
                <div>
                  <label htmlFor="specializations" className="block text-sm font-medium text-gray-700">
                    Specializations
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="specializations"
                      id="specializations"
                      value={formData.specializations}
                      onChange={handleChange}
                    />
                  </div>
                </div> 
      {/* --------------------------------------------------------------------------------- */}
                <div>
                  <label htmlFor="consultaion_fees" className="block text-sm font-medium text-gray-700">
                  consultaion fees
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="consultaion_fees"
                      id="consultaion_fees"
                      value={formData.consultaion_fees}
                      onChange={handleChange}
                    />
                  </div>
                </div>
      {/* ------------------------------------------------------------- */}

                <div>
                  <label htmlFor="consultation_duration" className="block text-sm font-medium text-gray-700">
                  consultation duration
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="time"
                      name="consultation_duration"
                      id="consultation_duration"
                      value={formData.consultation_duration}
                      onChange={handleChange}
                    />
                  </div>
                </div>
      {/* --------------------------------------------------------------------------------------- */}

                <div>
                  <label htmlFor="consultaion_fees" className="block text-sm font-medium text-gray-700">
                  consultation slots  
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="number"
                      name="consultation_slots"
                      id="consultation_slots"
                      value={formData.consultation_slots}
                      onChange={handleChange}
                    />
                  </div>
                </div>
      {/* ------------------------------------------------------------- */}

                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                  education
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="education"
                      id="education"
                      value={formData.education}
                      onChange={handleChange}
                    />
                  </div>
                </div>
      {/* ------------------------------------------------------------- */}
                <div>
                  <label htmlFor="college_name" className="block text-sm font-medium text-gray-700">
                  college name
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="college_name"
                      id="college_name"
                      value={formData.college_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
      {/* ------------------------------------------------------------- */}
               
      {/* ------------------------------------------------------------- */}
          
           

      {/* ------------------------------------------------------------- */}
                <div>
                  <label htmlFor="about_me" className="block text-sm font-medium text-gray-700">
                  about_me
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="about_me"
                      id="about_me"
                      value={formData.about_me}
                      onChange={handleChange}
                    />
                  </div>
                </div>
      {/* ------------------------------------------------------------- */}
                <div>
                  <label htmlFor="Hospital" className="block text-sm font-medium text-gray-700">
                  Hospital
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="text"
                      name="Hospital"
                      id="Hospital"
                      value={formData.Hospital}
                      onChange={handleChange}
                    />
                  </div>
                </div>
      {/* ------------------------------------------------------------- */}
        

     
                
                        {/* Add similar blocks for other fields */}

                <div className="flex items-center justify-center col-span-2">
                  <button 
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    type="submit">
                    Update
                  </button>
                  <div>

                  </div>
              
                </div>
                
              </form>
                </div>
                 {/* <button className="reserntclasssname" onClick={() => (navigate('KYC'))}>
                Update KYC
              </button> */}

              
            </div>
          </div>
        </div>
      </div>
      </div>
      

    
    
    
    </div>

      </>
    );
  };

  export default DoctorProfile;