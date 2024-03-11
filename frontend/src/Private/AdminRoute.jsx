import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { set_authentication } from '../Redux/AuthanticationUser';
import { Navigate, useNavigate } from 'react-router-dom';
import isAuthAdmin from '../utils/isAuthAdmin';

const AdminRoute = ({ children }) => {
    // const accessToken = localStorage.get("access");
    console.log(accessToken,"accessTokenaccessTokenaccessToken");
    const [isAuthenticated, setIsAuthenticated] = useState({
        'is_authenticated' : false,
        'is_admin' : false,
      });
      const [isLoading, setLoading] = useState(true);
    
      useEffect(() => {
        const fetchData = async () => {
          const authInfo = await isAuthAdmin();
          setIsAuthenticated({
            'is_authenticated' : authInfo.isAuthenticated,
            'is_admin' : authInfo.isAdmin,
          });
          setLoading(false);
        };
    
        fetchData();
      }, []);
    
      if (isLoading) {
        // Handle loading state, you might show a loading spinner
        return (
            <div>
                <div>
        <div className='parantloding'>
          <div className='loading'>
            <svg width='64px' height='48px'>
              <polyline points='0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24' id='back'></polyline>
              <polyline points='0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24' id='front'></polyline>
            </svg>
          </div>
        </div>
      </div>
            </div>
        )
        
      }
      console.log(isAuthenticated.is_authenticated,"isAuthenticated.is_authenticated");

    
      if(!isAuthenticated.is_authenticated)
      {
        console.log(isAuthenticated.is_authenticated,"isAuthenticated.is_authenticated");
        return <Navigate to="/admincontrol/login" />;
      }
    
      if ((!isAuthenticated.is_admin)) {
        console.log(isAuthenticated.is_admin,"isAuthenticated.is_admin");
        // If not authenticated, redirect to login page with the return URL
        return <Navigate to="/admincontrol/login" />;
      }
    
      // If authenticated, render the child components
      return children;
    }
    
    
    export default AdminRoute;