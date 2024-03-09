import React, { useEffect } from 'react'; // Importing useEffect from react
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

const DoctorWrapper = () => {
  const dispatch = useDispatch();

  const chechAuth = async () => {
    const isAuthenticated = await isAuthDoctor();
    dispatch(
      set_authentication({
        name: isAuthenticated.name,
        isAuthenticated: isAuthenticated.isAuthenticated
      })
    );
  };

  const authentication_user = useSelector(state => state.authentication_user);
  useEffect(() => {
    if (!authentication_user.name) {
      chechAuth();
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
        { path: '/Docprofile', element: <DoctorProfile /> }
      ]
    },
    { element: <Page404 />, path: '*' }
  ]);

  return route;
};

export default DoctorWrapper;
