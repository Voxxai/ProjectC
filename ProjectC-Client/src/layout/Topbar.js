import React from 'react';
import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCalendarDays, faChevronLeft, faDashboard, faHome, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import LogoIcon from '../images/Cavero_Icon_BW.png';

function Topbar({ title }) {
  return (
    <div className='Topbar bg-white shadow-md w-screen h-20'>
      <div className=''>
        <h2 className='flex items-center content-center h-20 align-middle pl-6'>{title}</h2>
      </div>
    </div>
  );
}

export default Topbar;
