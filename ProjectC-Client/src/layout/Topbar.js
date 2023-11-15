import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
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

function Topbar() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const settingMenu = useRef(null);
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const Menus = [
    { title: 'Profiel weergeven', src: faUser, link: '/instellingen/profiel' },
    { title: 'Instellingen', src: faGear, link: '/instellingen/options' },
  ];

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/get_noticounter/${auth.ID}`);
        setNotificationCount(response.data[0].NotiCounter);
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    fetchNotificationCount();
  }, [auth.ID]);

  const closeOpenMenus = (e) => {
    if (settingMenu.current && open && !settingMenu.current.contains(e.target)) {
      setOpen(false);
    }
  };

  document.addEventListener('mousedown', closeOpenMenus);

  const handleSignOut = () => {
    axios.get(`http://localhost:8080/signout`).then((response) => {
      if (response.data.signedOut === true) {
        // Redirect back to login
        navigate('/Login');
      }
    });
  };

  return (
    <div className="bg-white shadow-md w-full h-full max-h-20 flex justify-between items-center px-4">
      {/* Header */}
      <div className="items-center mt-2">
        <h2 className="">Week Overzicht</h2>
      </div>

      {/* Account item */}
      <div ref={settingMenu} className="my-auto flex gap-10 items-center">
        <button className="flex gap-2 items-center" onClick={() => setOpen(!open)}>
          <FontAwesomeIcon icon={faCircleUser} className="fa-xl text-cavero-purple" />
          <span className="">Hallo, {auth.FirstName}</span>
          <FontAwesomeIcon icon={faChevronDown} className={`${open && 'rotate-180'} duration-100`} />
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
        <div className="flex gap-3 fa-lg items-center relative">
          <Link to="/Nieuws" className="text-cavero-purple duration-300 hover:scale-110 relative fa-lg">
            <FontAwesomeIcon icon={faBell} />
          </Link>
          {notificationCount > 0 && (
          <span className="absolute top-0 right-10 -mt-1 -mr-1">
            <span className="relative inline-flex h-4 w-4 bg-red-600 rounded-full">
              <span className="animate-ping absolute inset-0 rounded-full h-full w-full bg-red-600"></span>
              <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                {notificationCount}
              </span>
            </span>
          </span>
          )}
          <FontAwesomeIcon
            icon={faSignOut}
            className="text-cavero-purple duration-300 hover:scale-110 cursor-pointer fa-lg"
            onClick={handleSignOut}
          />
        </div>
      </div>
    </div>
  );
}

export default Topbar;