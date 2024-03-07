import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Avatar } from "@material-tailwind/react";
import './navbar.css'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { set_authentication } from '../Redux/AuthanticationUser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  // State to manage the navbar's visibility on smaller screens
  const [nav, setNav] = useState(false);
  const dispatch =   useDispatch()
  const navigate = useNavigate()

  const { name, isAuthenticated } = useSelector((state) => state.authentication_user);
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
    { id: 1, text: 'Home' },
    { id: 4, text: 'About' },
    { id: 5, text: 'Contact' },
  ];

  return (
    <nav className='bg-cyan-950 flex justify-between items-center h-17 max-w-[1240%] mx-auto px-4 text-white'>
      <img className='w-24 h-24' src="/public/Screenshot_2024-02-19_151751-removebg-preview.png" alt="" />
  
      <ul className='hidden md:flex'>
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 hover:bg-[#4bc4d9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'
          >
            {item.text}
          </li>
        ))}
      </ul>
  
      {/* Searchbar */}
      <div className="input-wrapper">
        <button className="icon">
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M22 22L20 20"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
        <input type="text" name="text" className="input" placeholder="search.." />
      </div>
  
      {/* Patient and DocLogin buttons */}
      {!isAuthenticated ? (
        <>
          <div className="login-buttons">
            <Link to="/auth/login">
              <button className="UserLoginButton">Patient Login</button>
            </Link>
            <span style={{ fontSize: '0.8rem', margin: '0 0.5rem' }}></span>
            <Link to="/auth/doctor/login">
              <button className="UserLoginButton">Doctor Login</button>
            </Link>
          </div>
        </>

      ) : (
        <>
          {/* MyProfile */}
          <span style={{ fontSize: '0.8rem', margin: '0 10.9rem' }}></span>
          <span style={{ fontSize: '0.8rem', margin: '0 5.9rem' }}></span>
    

          <Avatar
            size="lg"
            alt="avatar"
            src="https://docs.material-tailwind.com/img/face-2.jpg"
            className="border rounded-xl border-green-500 shadow-xl shadow-green-900/20 ring-4 ring-green-500/30 max-w-11"
          />

          {/* LogoutButton */}
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
        </>
      )}
  
      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
  
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>DocTime</h1>
  
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'
          >
            {item.text}
          </li>
        ))}
      </ul>
      <ToastContainer />
    </nav>
  );
  
};

export default Navbar;
