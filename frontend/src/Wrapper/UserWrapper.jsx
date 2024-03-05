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
  




  const routes = useRoutes([{
    element: (
      <>
     <Navbar/>
      <Outlet/>
      <Footer/>
      </>
    ),
    children:[
      {path: "/auth/*", element:<Authenticator/>},
      {path: "/", element: <UserHome/>},    

    ],
  },
  {
    element:
    <div className='parantloding'>

    <div className="loading">
    <svg width="64px" height="48px">
      <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
      <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
    </svg>
  </div>
  </div>, path:'*'
  }
  
])




return routes
};

export default UserWrapper;
