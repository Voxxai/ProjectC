import React, { useState } from 'react';
import axios from 'axios';
import { Outlet, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCalendarDays, faChevronLeft, faCircleUser, faDashboard, faHome, faSignOut, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import LogoIcon from '../images/Cavero_Icon_BW.png';
import useAuth from '../hooks/useAuth';

function Topbar() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    axios.get(`http://localhost:8080/signout`).then((response) => {
            if (response.data.signedOut == true) {
              // Redirect back to login
              navigate("/Login");
            }
        })
  }

  return (
    <div className='bg-white shadow-md w-full h-20 flex justify-between items-center px-4'>
        <div className='items-center mt-2'>
            <h2 className=''>Week Overzicht</h2>
        </div>
        <div className='my-auto flex gap-10 items-center'>
          <div className='flex gap-2 items-center'>
            <FontAwesomeIcon icon={faCircleUser} className='fa-xl text-cavero-purple'/>
            <span className=''>Hallo, {auth.FirstName}</span>
          </div>
          <div className='flex gap-3 fa-lg items-center'>
            <FontAwesomeIcon icon={faBell} className='text-cavero-purple duration-300 hover:scale-110'/>
            <FontAwesomeIcon icon={faSignOut} className='text-cavero-purple duration-300 hover:scale-110' onClick={handleSignOut}/>
          </div>
        </div>
    
    </div>
  );
};
export default Topbar;
