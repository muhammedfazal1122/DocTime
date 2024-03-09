import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import React from 'react'
import { useDispatch } from 'react-redux'


const UpdateStaus = async () =>{

    const refreshToken = localStorage.getItem("refresh");
    const baseURL='http://127.0.0.1:8000'
    console.log(refreshToken);
    try {

        const res = await axios.post(baseURL+'/accounts/api/token/refresh/',{'refresh':refreshToken})

        if (res.status == 200){
            localStorage.setItem('access', res.data.access)
            localStorage.setItem('refresh', res.data.refresh)
            let decoded = jwtDecode(res.data.access);
            print("okkkkkkkkkkkkkkkk")
            return {'name':decoded.first_name,isAuthenticated:true}
        }else
        {
            return {'name':null,isAuthenticated:false}
        }  
        
    } catch (error) {
        console.log(error);
        return {'name':null,isAuthenticated:false}
    }
}




const isAuthAdmin = async () => {
    dispach = useDispatch()
    
    const token = localStorage.getItem('access')

    if (!token){
        return {'name':null,isAuthenticated:false}
    }
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp > currentTime){
        return {'name':decoded.fist_name, isAuthenticated:true}
    }else{
        const updataStutus = await UpdateStaus() 
        return updataStutus
    }
  return (
    <div>
        
    </div>
  )
}

export default isAuthAdmin