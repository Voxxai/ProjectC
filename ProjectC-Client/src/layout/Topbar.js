import React, { useState } from 'react';
import { Outlet, Link } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCalendarDays, faChevronLeft, faCircleUser, faDashboard, faHome, faSignOut, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import LogoIcon from '../images/Cavero_Icon_BW.png';

function Topbar() {
  const [username, setUsername] = useState("Karsten");
  
  return (
    <div className='Topbar bg-white shadow-md w-full h-20 flex justify-between items-center px-4'>
        <div className='my-auto items-center mb-none'>
            <h2 className=''>Week Overzicht</h2>
        </div>
        <div className='my-auto flex gap-10 items-center'>
          <div className='flex gap-2 items-center'>
            <FontAwesomeIcon icon={faCircleUser} className='fa-xl text-cavero-purple'/>
            <span className=''>Hallo, {username}</span>
          </div>
          <div className='flex gap-3 fa-lg items-center'>
            <FontAwesomeIcon icon={faBell}/>
            <FontAwesomeIcon icon={faSignOut}/>
          </div>
        </div>
    
    </div>
  );
};
export default Topbar;
