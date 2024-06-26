import React, { useEffect ,useState} from 'react';
import { Outlet, useRoutes } from 'react-router-dom';
import DocHome from '../pages/Doctor/DocHome';
import Page404 from '../Compounts/Page404';
import DoctorProfile from '../pages/Doctor/DoctorProfile/DoctorProfile';
import isAuthDoctor from '../utils/isAuthDoctor';
import { useDispatch, useSelector } from 'react-redux';
import DoctorRoute from '../Private/DoctorRoute';
import { set_authentication } from '../Redux/AuthanticationUser';
import { set_profile } from '../Redux/UserProfileSlice';
import axios from 'axios'; // Don't forget to import axios
import KYCAuthDoctor from '../pages/Doctor/DoctorProfile/KYCAuthDoctor';
import {  NavbarWithSearch } from '../pages/Doctor/DocNavbar/Docnavbar';
import CreateSloat from '../pages/Doctor/Sloat/CreateSloat';
import Footer2 from '../Compounts/Footer2';
import Navbar2 from '../Compounts/Navbar2';
import DocVideoCall from '../pages/Doctor/BookindDetailsDoctor/DocVideocall';
import BookingDetailesDoc from '../pages/Doctor/BookindDetailsDoctor/BookingDetailesDoc';
import DoctorChat from '../Compounts/chat/DoctorChat';
import Accountdetailes from '../Compounts/Notification/Accountdetailes';
import AboutPage from '../Compounts/About';

const DoctorWrapper = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.authentication_user.user_id); // Move useSelector inside DoctorWrapper
  const [errors, setErrors] = useState({});


  const checkLocal = () =>{
    const isAuthenticated = JSON.parse(localStorage.getItem('authenticationData'));
    
    
    dispatch(
        set_authentication({
            name: isAuthenticated.name,
            isAuthenticated: isAuthenticated.isAuthenticated,
        })
    );
}


  const chechAuth = async () => {
    const isAuthenticated = await isAuthDoctor();
    dispatch(
      set_authentication({
        name: isAuthenticated.name,
        isAuthenticated: isAuthenticated.isAuthenticated,
        is_doctor: isAuthenticated.is_doctor,
        user_id: isAuthenticated.user_id,
      })
    );
  };

  const uploadProfilePicture = async () => {
    try {
      const authToken = localStorage.getItem('access');
      
      const response = await axios.get(`${baseURL}/auth/profilepic-update/${userId}/`, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        }, 
      }); 
      
      dispatch(set_profile({
        name: response.data.first_name,
        profile_pic: response.data.profile_pic,
      }));
      
    } catch (error) {  
      
    }
 };

  const authentication_user = useSelector(state => state.authentication_user);
  useEffect(() => {
    if (!authentication_user.name) {
      chechAuth();
      // checkLocal();
    }
    if (authentication_user.name){
      uploadProfilePicture();
    }
  }, [authentication_user]);

  

  const route = useRoutes([
    {
      element: (
        <>
        <Navbar2/>
      {/* <NavbarWithSearch/> */}
          <DoctorRoute>
            <Outlet />
          </DoctorRoute>
          <Footer2 />
        </>
      ),
      children: [
        { path: '/DocHome', element: <DocHome /> },
        { path: '/About', element: <AboutPage /> },
        { path: '/Docprofile', element: <DoctorProfile /> },
        { path: '/Docprofile/KYC', element: <KYCAuthDoctor /> },
        { path: '/createSloat', element: <CreateSloat/> },
        { path: '/BookingDetailes', element: <BookingDetailesDoc/> },
        { path: '/DoctorChat', element: <DoctorChat/> },
        { path: '/docvideocall/:roomId', element: <DocVideoCall/> },
        { path: '/accountdetailes', element: <Accountdetailes/> },

      ]
    },
    { element: <Page404 />, path: '*' } 
  ]);

  return route;
};

export default DoctorWrapper;
