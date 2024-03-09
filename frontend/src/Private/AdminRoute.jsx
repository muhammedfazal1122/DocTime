import React from 'react'
import { useSelector } from 'react-redux'
import isAuthAdmin from '../utils/isAuthAdmin'
import { set_authentication } from '../Redux/AuthanticationUser'
import { useNavigate } from 'react-router-dom'

const AdminRoute = ({children}) => {
  
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setLoading] = useState(true);
    navigate = useNavigate()
    
     useEffect (()=>{
        const fetchData = async () => {

            const admininfo = await isAuthAdmin() 
            set_authentication(()=>admininfo.set_authentication, admininfo.isAuthenticated)
            setTimeout(() => { setLoading(false); }, 1000);

        }
        fetchData();
    },[]);

    if(isLoading){
        return(
            <div>
                <div className='parantloding'>  
                <div className="loading">
                <svg width="64px" height="48px">
                <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
                <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
                </svg>
                </div>
                </div>
            </div>
        )
    }
    



    if (!isAuthenticated) {
        // If not authenticated, redirect to login page with the return URL
        // toast.warning("please login for get the full access")
        return navigate ("admincontrol/login")
      }
    
      // If authenticated, render the child components
      return children;
    }
    
    

export default AdminRoute