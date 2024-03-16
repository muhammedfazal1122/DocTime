import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set_authentication } from '../Redux/AuthanticationUser';

const AdminRoute = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [isAuthenticated, setIsAuthenticated] = useState({
        'is_authenticated': false,
        'is_admin': false,
    });

    const data = JSON.parse(localStorage.getItem('authenticationData'));
    setIsAuthenticated(data.isAuthenticated)

    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
      dispatch(
        set_authentication({
          name: data.name,
          isAuthenticated: data.isisAuthenticated,
          isAdmin: true,
        })
      )
     
     }, []);
      // Empty dependency array ensures this effect runs once on mount

    if (isLoading) {
        return (
            <div className='parentLoading'>
                <div className='loading'>
                    <svg width='64px' height='48px'>
                        <polyline points='0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24' id='back'></polyline>
                        <polyline points='0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24' id='front'></polyline>
                    </svg>
                </div>
            </div>
        );
    }

    if (!isAuthenticated.is_authenticated  && (!isAuthenticated.is_admin)) {
        return <Navigate to="/admincontrol/login" />;
    }

  

    // If authenticated and is admin, render the child components
    return children;
};

export default AdminRoute;
