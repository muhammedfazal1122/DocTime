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
     <UserRoute>

      <Outlet/>
     </UserRoute>
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
    <Page404/>, path:'*'
  }
  
])




return routes
};

export default UserWrapper;
