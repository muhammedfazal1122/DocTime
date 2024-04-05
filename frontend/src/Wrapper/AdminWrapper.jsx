// Adminwrapper.jsx
import React, { useEffect } from 'react'
import { Outlet, useRoutes, useNavigate } from 'react-router-dom'
import AdminLogin from '../pages/Admin/AdminLogin'
import DashboardLayout from '../pages/Admin/DashboardLayout'
import Dashboard from '../pages/Admin/Dashboard'
import PatientList from '../pages/Admin/PatientList'
import Page404 from '../Compounts/Page404'; 
import { useDispatch, useSelector } from 'react-redux'
import AdminRoute from '../Private/AdminRoute'
import { set_authentication } from '../Redux/AuthanticationUser'
import isAuthAdmin from '../utils/isAuthAdmin'
import VarificationDoc from '../pages/Admin/VarificationDoc'
import DoctorList from '../pages/Admin/DoctorList'
import TransactionHistory from '../pages/Admin/TransactionHistory'

const Adminwrapper = () => {
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user)
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await isAuthAdmin();

      dispatch(
        set_authentication({
          name: isAuthenticated.name,
          isAuthenticated: isAuthenticated.isAuthenticated,
          isAdmin: isAuthenticated.isAdmin,
        })
      );
      if (!isAuthenticated.isAuthenticated && !isAuthenticated.isAdmin) {
        navigate('login'); // Navigate to login if not authenticated
      }
    };

    if (!authentication_user.name) {
      checkAuth();
    }
  }, [authentication_user, dispatch]);

  const routs = useRoutes([
    {
      path: '/login',
      element: <AdminLogin />
    },
    {
      element: (
        // <AdminRoute>
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        // </AdminRoute>
      ),
      children: [
        { path: '/dashbord', element: <Dashboard /> },
        { path: '/patient', element: <PatientList /> },
        { path: '/doctor', element: <DoctorList /> },
        { path: '/order', element: <TransactionHistory /> },
        { path: '/DocVerification', element: <VarificationDoc /> },
      ]
    },
    {
      path: '*',
      element: <Page404 />
    }
  ]);

  return routs;
}

export default Adminwrapper;
