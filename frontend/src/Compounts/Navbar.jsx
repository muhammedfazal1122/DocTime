import React, { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Avatar } from "@material-tailwind/react";
import './navbar.scss'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { set_authentication } from '../Redux/AuthanticationUser';
import { ToastContainer, toast } from 'react-toastify';
import UserProfileBox from '../pages/Patient/UserProfile/UserProfileBox';
import axios from 'axios'; // Import axios
import { jwtDecode } from 'jwt-decode';
import { baseUrl } from '../utils/constants/Constants';
import logo from '../../public/Screenshot_2024-02-19_151751-removebg-preview.png';
import logoss from '../../public/assets/avatar/avatar_6.jpg';

const Navbar = () => {
  // State to manage the navbar's visibility on smaller screens
  const [nav, setNav] = useState(false);
  const dispatch =   useDispatch()
  const navigate = useNavigate()
  const [showProfileBox, setShowProfileBox] = useState(false); 
  const [Dp, setDp] = useState("")
  const [profilepic, setprofilepic] = useState('')
  const { name, isAuthenticated } = useSelector((state) => state.authentication_user);
  const {  is_doctor } = useSelector((state) => state.authentication_user);
  const {  isAdmin } = useSelector((state) => state.authentication_user);
  

  const [doctorDetails, setDoctorDetails] = useState(null);
  const [profileSucess, setprofileSucess] = useState(0)
  
  if (isAuthenticated){
    

  
  const authToken = localStorage.getItem('access')
  const decoder = jwtDecode(authToken)
  const userId = decoder.user_id
  
  
  }


  const GotoHome = () =>{ 
    navigate('/')
  }
  const handleAvatarClick = () => {

    navigate('/myprofile')
  }

// *************************  PROFILE PIC SHOW ******************************************************************

const showProfile = async () => {
  try {
    
     const response = await axios.get(`${baseUrl}auth/doc/update/${userId}`);
     // Assuming setprofilepic is a state setter function
     // You might need to adjust this line based on how you're managing state
     setprofilepic(response.data.profile_picture);
  } catch (error) {
     
  }
 };
 


  const HandleLogout = () =>{

    localStorage.clear();

    dispatch(
      set_authentication({
        name:null,
        isAuthenticated:false,
        isAdmin:false
      })
    )
    navigate('/')
      toast.success('You have been successfully logged out!', {
      // position: toast.POSITION.TOP_RIGHT
    });
  }
  
  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: 'Home', path: '/' },
    { id: 4, text: 'About', path: '/DoctorShow/about' },
 ];

 const handleNavigation = (path) => {
    navigate(path);
 };



  useEffect(() => {

    showProfile()
  }, [profilepic]); 
 

  
  return (
    <nav className='bg-cyan-950 flex justify-between items-center h-17 max-w-full mx-auto px-4 text-white'>
    <img
      className='w-24 h-24 cursor-pointer'
      src={logo}
      alt=""
      onClick={GotoHome}
    />

    <ul className='hidden md:flex'>
      {navItems.map(item => (
        <li
          key={item.id}
          className='p-4 hover:bg-[rgb(75,196,217)] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'
          onClick={() => handleNavigation(item.path)}
        >
          {item.text}
        </li>
        ))}
      </ul>

      <div className='flex md:hidden items-center'>
        <div onClick={handleNav} className='block'>
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>
      </div>

      <ul
        className={
          nav
            ? 'fixed left-0 top-0 w-[30%] h-full border-r border-r-gray-900 bg-transparent backdrop-blur-md ease-in-out duration-500 z-50'
            : 'ease-in-out w-[40%] duration-500 fixed top-0 bottom-0 left-[-100%] bg-transparent backdrop-blur-md z-50'
        }
      >
        <div className="flex justify-end p-4">
          <button onClick={handleNav} className="text-white">
            <AiOutlineClose size={20} />
          </button>
        </div>
        <h1 className='w-full text-3xl font-bold text-[rgb(75,196,217)] m-4'>DocTime</h1>

        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 border-b rounded-xl hover:bg-[rgb(75,196,217)] duration-300 hover:text-black cursor-pointer border-gray-600'
          >
            {item.text}
          </li>
        ))}
      </ul>

      <div className='flex items-center space-x-4'>
        {isAuthenticated && !is_doctor&& !isAdmin ? (
          <>
         <div className='flex-grow'></div> {/* Empty flex-grow to push items to the right */}
         <div className='Buttonparant'>
           
         </div>

         {/* Avatar */}
         <Avatar
           size="lg"
           alt="avatar"
           src={profilepic ? profilepic : logoss}
           className="border rounded-xl border-green-500 shadow-xl shadow-green-900/20 ring-4 ring-green-500/30 max-w-11"
           onClick={handleAvatarClick}
         />

         {/* Logout Button */}
         <div className='Buttonparant'>
           <button className="Btn" onClick={HandleLogout}>
             <div className="sign">
              <svg viewBox="0 0 512 512">
                 <path
                   d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                 ></path>
              </svg>
             </div>
             <div className="text">Logout</div>
           </button>
         </div>
          </>
        ) : (
          <>
            <div className='Buttonparant '>
            <div className="login-buttons">
              <Link to="/auth/login">
                <button className="UserLoginButton">Patient Login</button>
              </Link>
              <span style={{ fontSize: '0.8rem', margin: '0 0.5rem' }}></span>
              <Link to="/auth/doctor/login">
                <button className="UserLoginButton">Doctor Login</button>
              </Link>
            </div>
            </div>
           
          </>
        )}
      </div>

      <ToastContainer />
    </nav>
 );
};

export default Navbar;