import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import isAuthUser from '../utils/IsAuthUser';
import Navbar from '../Compounts/Navbar';
import { toast } from 'react-toastify';
import './loading.css';
import Loader from './Loader';

function UserRoute({ children }) {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
 
   
  useEffect(() => {
    const fetchData = async () => {
      const authInfo = await isAuthUser();
      setIsAuthenticated(authInfo.isAuthenticated);
      setTimeout(() => setLoading(false), 2000); // Set loading to false after 2 seconds
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loader/>
  }


  return children;
}

export default UserRoute;
