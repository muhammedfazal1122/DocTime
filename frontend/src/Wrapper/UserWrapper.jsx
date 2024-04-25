import React, { useEffect } from 'react';
import Navbar from '../Compounts/Navbar'; 
import Footer from '../Compounts/Footer';
import Page404 from '../Compounts/Page404'; 
import './loading.css'
import UserHome from '../pages/Patient/UserHome';
import UserLogin from '../pages/Patient/UserLogin/UserLogin';
import Authenticator from '../pages/Authentication/Authentication';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Outlet, useRoutes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import isAuthUser from '../utils/IsAuthUser';
import { set_authentication } from '../Redux/AuthanticationUser';
import UserRoute from '../Private/UserRoute';
import FAQSection from '../pages/Patient/FAQSection';
import Footer2 from '../Compounts/Footer2';
import DoctorShow from '../pages/Patient/DoctorList/DoctorShow';
import ViewDocProfile from '../pages/Patient/ViewDocProfile/ViewDocProfile';
import BookAppoiment from '../pages/Patient/Book Appoiment/BookAppoiment';
import MyProfile from '../pages/Patient/MyProfile/MyProfile';
import PaymentSuccess from '../Compounts/PaymentSuccess';
import BookingDetailes from '../pages/Patient/Book Appoiment/BookingDetailes';
import Videocall from '../Compounts/Videocall';
import SpecialisationShow from '../pages/Patient/SpecialisationShow';
import PatientChat from '../Compounts/chat/PatientChat';
import DoctorShowChatList from '../pages/Patient/DoctorList/DoctorShowChatList';

const UserWrapper = () => {
  const dispatch = useDispatch()


  const chechAuth = async ()=>{

    const isAuthenticated = await isAuthUser()
    dispatch(
      set_authentication({
        name:isAuthenticated.name,
        isAuthenticated: isAuthenticated.isAuthenticated
      }

      )
    )

  }

  const authentication_user = useSelector(state => state.authentication_user)
  useEffect(() => {
    if(!authentication_user.name)
    { 

    chechAuth()

  }

  }, [authentication_user])
  




  const routes = useRoutes([

    {
      element:(
        <>
    <Navbar/>
      <Outlet/>
    <Footer2/>
        </>
      ),children:[
        {path: "/auth/*", element:<Authenticator/>},
        {path: "/", element: <UserHome/>},    
      ]
    }
    ,
    {
    element: (
      <>
    <Navbar/>
        <UserRoute>
          <Outlet/>
        </UserRoute>
    <Footer2/>

      </>
    ),
    children:[
      {path: "/auth/*", element:<Authenticator/>},
      {path: "/DoctorShow/", element: <DoctorShow/>},    
      {path: "/DoctorShowChatList/", element: <DoctorShowChatList/>},    
      {path: "/DoctorShow/:specialization", element: <SpecialisationShow/>},    
      {path: "/myprofile", element: <MyProfile/>},    
      {path: "/DoctorShow/ViewDocProfile/:id", element: <ViewDocProfile/>},    
      {path: "/DoctorShow/BookAppoiment/:custom_id", element: <BookAppoiment/>},    
      {path: "/DoctorShow/BookAppoiment/success-page", element: <PaymentSuccess/>},    
      {path: "/DoctorShow/BookAppoiment/booking-detailes", element: <BookingDetailes/>},    
      {path: "/DoctorShow/BookAppoiment/Chat-to-doctor", element: <PatientChat/>},    
      {path: "/DoctorShow/videocall/:roomId", element: <Videocall/>},    
      // {path: "/DoctorShow/", element: <Videocall/>},    

    ],
  },
  {
    element:
    <Page404/>, path:'*'
  }
  
])




return routes
};

export default UserWrapper;
