import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBell,
  faChevronDown,
  faChevronUp,
  faCircleHalfStroke,
  faCircleUser,
  faGear,
  faSignOut,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import LogoIcon from '../images/Cavero_Icon_BW.png';
import useAuth from '../hooks/useAuth';

function Topbar({ openNavbar, toggleOpen, handleBellPress, bellPressed, setBellPressed }) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const settingMenu = useRef(null);
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();

  const Menus = [
    { title: 'Profiel weergeven', src: faUser, link: '/instellingen/profiel' },
    { title: 'Instellingen', src: faGear, link: '/instellingen/options' },
  ];

  // Fetching the notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + `/get_noticounter/${auth.ID}`);
        setNotificationCount(response.data[0].NotiCounter);
        
        await axios.get(process.env.REACT_APP_API_URL + `/reset_noticounter/${auth.ID}`);
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    setBellPressed(false)
    fetchNotificationCount();
    // every time the bell is pressed, fetch the notification count
  }, [bellPressed]);

  // Close the dropdown menu when clicking outside of it
  const closeOpenMenus = (e) => {
    if (settingMenu.current && open && !settingMenu.current.contains(e.target)) {
      setOpen(false);
    }
  };

  // Add event listener to close dropdown menu when clicking outside of it
  document.addEventListener('mousedown', closeOpenMenus);

  // Sign out
  const handleSignOut = () => {
    axios.get(process.env.REACT_APP_API_URL + `/signout`).then((response) => {
      if (response.data.signedOut === true) {
        // Redirect back to login
        navigate('/Login');
      }
    });
  };

  // Set the title of the page
  const setTitle = () => {
    if (location.pathname.split("/").length - 1 > 1) {
      return location.pathname.split("/")[2];
    }

    return location.pathname == "/" ? "Week Overzicht" : location.pathname.slice(1)
  }

  return (
    <div className="bg-white shadow-md w-full h-full max-h-20 flex justify-between items-center px-4">
      {/* Hamburger menu for mobile */}

      {/* Header */}
      <div className='items-center flex flex-row gap-x-2'>
        <FontAwesomeIcon icon={faBars} className="fa-xl text-slate-700 hidden max-sm:block hover:scale-110" onClick={toggleOpen} />
        <span className='font-medium text-3xl'>{setTitle()}</span>
      </div>

      {/* Account item */}
      <div ref={settingMenu} className="my-auto flex gap-x-4 items-center">
        <button className="flex gap-2 items-center" onClick={() => setOpen(!open)}>
          <FontAwesomeIcon icon={faCircleUser} className="fa-xl text-cavero-purple " />
          <span className="text-slate-700 max-sm:hidden">Hallo, {auth.FirstName}</span>
          <FontAwesomeIcon icon={faChevronDown} className={`${open && 'rotate-180'} duration-100 text-slate-700 max-sm:hidden`} />
        </button>

        {/* Dropdown menu */}
        <div
          ref={settingMenu}
          id="dropdown"
          className={`${open ? '' : 'hidden'} top-16 right-24 z-10 absolute bg-white divide-y rounded-lg shadow w-auto py-2`}
        >
          {Menus.map((Menu, index) => (
            <Link to={Menu.link} className="text-base text-gray-600 no-underline" key={index}>
              <li className="list-none p-2.5 flex items-center gap-x-2 hover:bg-gray-100">
                <FontAwesomeIcon icon={Menu.src} className="w-4" />
                <span>{Menu.title}</span>
              </li>
            </Link>
          ))}
        </div>

        {/* Next items */}
        <div className="flex gap-x-4 text-sm items-center relative">
          <Link to="/Nieuws" className="text-cavero-purple duration-300 hover:scale-110 relative">
            <FontAwesomeIcon icon={faBell} onClick={handleBellPress} className='fa-xl' />
          </Link>
          {notificationCount > 0 && (
            <Link to="/Nieuws" onClick={handleBellPress} className="absolute top-0 right-10 -mt-1.5 -mr-3">
              <span className="relative inline-flex h-4 w-4 bg-red-500 rounded-full">
                <span className="animate-ping absolute inset-0 rounded-full h-full w-full bg-red-500"></span>
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                  {notificationCount}
                </span>
              </span>
            </Link>
          )}
          <FontAwesomeIcon
            icon={faSignOut}
            className="text-cavero-purple duration-300 hover:scale-110 cursor-pointer fa-xl"
            onClick={handleSignOut}
          />
        </div>
      </div>
    </div>
  );
}

export default Topbar;