import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProfileCard from '../../../Compounts/ProfileCard/ProfileCard';

const DoctorProfile = () => {
  const baseURL = "http://127.0.0.1:8000";

  const userId = useSelector(state => state.authentication_user.user_id);
  console.log(userId,'userId')

  const [formData, setFormData] = useState({
    full_name: '',
    specializations: '',
    consultaion_fees: '',
    consultation_duration: '',
    consultation_slots: '',
    education: '',
    college_name: '',
    consultation_time: '',
    about_me: '',
    Hospital: '',
    rating: '',
  });
 
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('access')
        console.log(userId,'uuuuuuuuuuuuuuuuuuuuuuuuuu')
        const fetchDoctorDetails = await axios.get(`${baseURL}/auth/docdetailes/${userId}/`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        const { data } = fetchDoctorDetails;
        console.log(data.doctor_user.consultation_duration,'fffffffffffffffffffffffuuuuuuuuuuuuuu');


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
        // Handle error
      }
    };

    fetchData();
  }, [baseURL, userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    {/* ------------------------------------------------------------- */}

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
                <label htmlFor="consultation_time" className="block text-sm font-medium text-gray-700">
                consultation_time
                </label>
                <div className="mt-1">
                  <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required=""
                    type="time"
                    name="consultation_time"
                    id="consultation_time"
                    value={formData.consultation_time}
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
                    onChange={handleChange}
                  />
                </div>
              </div>
              
                      {/* Add similar blocks for other fields */}

              <div className="flex items-center justify-center col-span-2">
                <button
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  type="submit">
                  Update
                </button>
              </div>
            </form>
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