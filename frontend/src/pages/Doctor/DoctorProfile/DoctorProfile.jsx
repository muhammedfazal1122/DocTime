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
     
     localStorage.setItem('Doc_profile_pic', data.profile_picture);
   } catch (error) {
     toast.error("Error fetching profile data.");
   }
 };
 
 useEffect(() => {

    fetchData();
 }, []);

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
      const response = await axios.patch(`${baseURL}/auth/doctor-update/${userId}/`, formData, {
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
 <div className="flex flex-col md:flex-row justify-center items-center ">

  {/* <div className="max-w-screen-lg flex"> */}
        
  <div className="ProfileCard w-full md:w-1/3 justify-center">
        <ProfileCard />
      </div>

      <div className="parentfrom2 w-full sm:w-1/3 justify-center mb-8 sm:mb-0">
  <div className='flex justify-center flex-col py-12 sm:px-6 lg:px-8'>

    <form className="w-full max-w-lg bg-slate-500 py-12 px-6 shadow sm:rounded-lg">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label htmlFor="grid-first-name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">First Name</label>
          <input id="grid-first-name" type="text" placeholder="Jane" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-green-500" />
          <p className="text-red-500 text-xs italic">Please fill out this field.</p>
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label htmlFor="grid-last-name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Last Name</label>
          <input id="grid-last-name" type="text" placeholder="Doe" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label htmlFor="grid-password" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Password</label>
          <input id="grid-password" type="password" placeholder="******************" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
          <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label htmlFor="grid-city" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">City</label>
          <input id="grid-city" type="text" placeholder="Albuquerque" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label htmlFor="grid-state" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">State</label>
          <div className="relative">
            <select id="grid-state" className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
              <option>New Mexico</option>
              <option>Missouri</option>
              <option>Texas</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label htmlFor="grid-zip" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Zip</label>
          <input id="grid-zip" type="text" placeholder="90210" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
        </div>
      </div>
    </form>
  </div>
</div>


      {/* Form */}
      <div className="parentfrom1 w-full md:w-1/3 justify-center">
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
      
    
    
    
    
    {/* ------------------------------------------------------FORM 2--------------------------- */}
    
    
    
    
    
    </div>

      </>
    );
  };

  export default DoctorProfile;