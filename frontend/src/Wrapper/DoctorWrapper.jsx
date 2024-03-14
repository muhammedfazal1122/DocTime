import React, { useEffect } from 'react';
import Navbar from '../Compounts/Navbar';
import Footer from '../Compounts/Footer';
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

const DoctorWrapper = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.authentication_user.user_id); // Move useSelector inside DoctorWrapper


  const checkLocal = () =>{
    const isAuthenticated = JSON.parse(localStorage.getItem('authenticationData'));
    console.log('Authentication data:', isAuthenticated);
    console.log('Is authenticated:', isAuthenticated.isAuthenticated);
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
      console.log("Profile useeefct in Doctor wrapper success");
    } catch (error) {  
      console.log("Profile ERROR during useeefct in Doctor wrapper");
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
          <Navbar />
          <DoctorRoute>
            <Outlet />
          </DoctorRoute>
          <Footer />
        </>
      ),
      children: [
        { path: '/DocHome', element: <DocHome /> },
        { path: '/Docprofile', element: <DoctorProfile /> },
        { path: '/Docprofile/KYC', element: <KYCAuthDoctor /> }
      ]
    },
    { element: <Page404 />, path: '*' }
  ]);

  return route;
};

export default DoctorWrapper;
