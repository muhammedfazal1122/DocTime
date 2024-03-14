import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_profile } from '../../../Redux/UserProfileSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProfileCard from '../../../Compounts/ProfileCard/ProfileCard';
import { Link, useNavigate } from 'react-router-dom';

const DoctorProfile = () => {
 const baseURL = "http://127.0.0.1:8000";
 const navigate = useNavigate();
 const userId = useSelector(state => state.authentication_user.user_id);
 console.log(userId,'uuuuuuuuuuuuuuuuurrrrrrrrrrrrrrrrrrrrrr');
 const dispatch = useDispatch();

 const [formData, setFormData] = useState({
    full_name: '',
    specializations: '',
    consultaion_fees: '',
    consultation_duration: '',
    consultation_slots: '',
    education: '',
    college_name: '',
    consultation_time_start: '',
    consultation_time_end: '',
    about_me: '',
    Hospital: '',
    rating: '',
    profile_picture: null,
 });

 useEffect(() => {
    const fetchData = async () => {
      
      try {
        const authToken = localStorage.getItem('access');
        const response = await axios.get(`${baseURL}/auth/docdetailes/${userId}/`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const { data } = response;
        setFormData({
          ...formData,
          full_name: data.doctor_user.full_name,
          specializations: data.doctor_user.specializations,
          consultaion_fees: data.doctor_user.consultaion_fees,
          consultation_duration: data.doctor_user.consultation_duration,
          consultation_slots: data.doctor_user.consultation_slots,
          education: data.doctor_user.education,
          college_name: data.doctor_user.college_name,
          consultation_time: data.doctor_user.consultation_time,
          about_me: data.doctor_user.about_me,
          Hospital: data.doctor_user.Hospital,
          rating: data.doctor_user.rating,
        });
      } catch (error) {
        toast.error("Error fetching profile data.");
      }
    };

    fetchData();
 }, [userId]);

 const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleFileChange = (e) => {
    setFormData({ ...formData, profile_picture: e.target.files[0] });
 };

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('access');
      const response = await axios.patch(`${baseURL}/auth/doctor-update/`, formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
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
    formData.append('profile_picture', fileInput.files[0]); // Append the file from the input element
    const response = await axios.post(`${baseURL}/auth/profilepic-update/`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch(set_profile({
      name: response.data.first_name,
      profile_pic: response.data.profile_pic,
    }));
    toast.success("Profile picture updated successfully.");
  } catch (error) {
    toast.error("Error updating profile picture. Please try again later.");
  }
};

    return (
      <>
    <div className="flex justify-center items-center h-screen">

  {/* <div className="max-w-screen-lg flex"> */}
        
        <div className="w-30  justify-center ">
        <ProfileCard />
      </div>



      {/* Form */}
      <div className="w-70  justify-center">
      <div className="flex justify-center"> {/* Center the form */}

        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-slate-400 py-12 px-6 shadow sm:rounded-lg sm:px-10">
              <div>

           
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
                  <label htmlFor="consultaion_fees" className="block text-sm font-medium text-gray-700">
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
                <div>
                  <label htmlFor="consultation_time_start" className="block text-sm font-medium text-gray-700">
                  Consultation Start
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="time"
                      name="consultation_time_start"
                      id="consultation_time_start"
                      value={formData.consultation_time_start}
                      onChange={handleChange}
                    />
                  </div>
                </div>
      {/* ------------------------------------------------------------- */}
                <div>
                  <label htmlFor="consultation_time_end" className="block text-sm font-medium text-gray-700">
                  Consultation End
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="time"
                      name="consultation_time_end"
                      id="consultation_time_end"
                      value={formData.consultation_time_end}
                      onChange={handleChange}
                    />
                  </div>
                </div>

           

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
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  rating
                  </label>
                  <div className="mt-1">
                    <input
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required=""
                      type="number"
                      name="rating"
                      id="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      />
                  </div>
                </div>

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
                  <button className="reserntclasssname" onClick={uploadProfilePicture} >
                Update Profile Picture
                </button>
                </div>
                 <button className="reserntclasssname" onClick={() => (navigate('KYC'))}>
                Update KYC
              </button>

              
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