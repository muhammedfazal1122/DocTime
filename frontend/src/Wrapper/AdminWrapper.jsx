import React, { useEffect } from 'react'
import { Outlet, useRoutes } from 'react-router-dom'
import AdminLogin from '../pages/Admin/AdminLogin'
import DashboardLayout from '../pages/Admin/DashboardLayout'
import Dashboard from '../pages/Admin/Dashboard'
import Page404 from '../Compounts/Page404'; 
import { useDispatch, useSelector } from 'react-redux'
import { set_authentication } from '../Redux/AuthanticationUser'

const Adminwrapper = () => {

  const dispatch = useDispatch();

  const authentication_user = useSelector(state => state.authentication_user)
  

  const checkAuth = async () => {
    const isAuthenticated = await isAuthDoctor();
    console.log(isAuthenticated,"rrrrrrrrrrrrrrrrrrr");
    dispatch(
      set_authentication({
        name: isAuthenticated.name,
        isAuthenticated: isAuthenticated.isAuthenticated,
        is_doctor: isAuthenticated.is_doctor,
      })
    );
  };





  useEffect(() => {
    if(!authentication_user.name)
    {
     
      checkAuth();
    
    }

  }, [authentication_user])
  


  const routs = useRoutes([

    {
      path:'/login' , element:<AdminLogin/>
    },
    
    {
      element:(
        <DashboardLayout>
          <Outlet/>
        </DashboardLayout>
      ),

      children:[
        
      { path:'/' ,element:<Dashboard/>},
     
        
    ]


    }
    ,
    {
        path:'*', element:<Page404/>
    }

  ])




  return (
   routs
  )
}

export default Adminwrapper