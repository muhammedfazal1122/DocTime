import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import isAuthDoctor from '../utils/isAuthDoctor';
import Loader from './Loader';
import { set_authentication } from '../Redux/AuthanticationUser';

function DoctorRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState({
    isAuthenticated: false,
    isAdmin: false,
    isDoctor: false,
  });
  
  const [isLoading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authInfo = await isAuthDoctor();
        console.log("this is the log", authInfo);
        if (authInfo) {
          set_authentication({
            isAuthenticated: authInfo.isAuthenticated,
            isAdmin: authInfo.isAdmin,
            isDoctor: authInfo.is_doctor,
          });
          console.log("Auth info after dispatch:", authInfo);
          console.log(authInfo.is_doctor, "authInfo.is_doctor");
          setIsAuthenticated({
            isAuthenticated: authInfo.isAuthenticated,
            isAdmin: authInfo.isAdmin,
            isDoctor: authInfo.is_doctor,
          });
        } else {
          console.error("Authentication information is missing or undefined.");
        }
        setTimeout(() => setLoading(false), 1000); // Set loading to false after 2 seconds
      } catch (error) {
        console.error("Error fetching authentication information:", error);
      }
    };
  
    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated.isAuthenticated) {
    return <Navigate to="auth/doctor/login" />;
  }

  return children;
}

export default DoctorRoute;
