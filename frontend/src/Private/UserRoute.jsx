import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
// import isAuthUser from '../utils/isAuthUser';
import isAuthUser from '../utils/IsAuthUser';
import Navbar from '../Compounts/Navbar';
// import Loader from '../loade';
import { toast } from 'react-toastify';
import './loading.css'

function UserRoute({ children }) {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
 
   
  useEffect(() => {
    const fetchData = async () => {
      const authInfo = await isAuthUser();
      setIsAuthenticated(authInfo.isAuthenticated);
      setTimeout(() => { setLoading(false); }, 3000);
    };

    fetchData();
  }, []);

  if (isLoading) {
    // Handle loading state, you might show a loading spinner
    return <div>
      <Navbar/>
      <div className='parantloding'>  
      <div className="loading">
    <svg width="64px" height="48px">
      <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
      <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
    </svg>
  </div>
  </div>
  </div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page with the return URL
    // toast.warning("please login for get the full access")
    return <Navigate to="auth/login" />;
  }

  // If authenticated, render the child components
  return children;
}




export default UserRoute;