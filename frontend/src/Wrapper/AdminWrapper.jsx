import React from 'react'
import { Outlet, useRoutes } from 'react-router-dom'
import AdminLogin from '../pages/Admin/AdminLogin'
import DashboardLayout from '../pages/Admin/DashboardLayout'
import Dashboard from '../pages/Admin/Dashboard'
import Page404 from '../Compounts/Page404'; 

const Adminwrapper = () => {

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