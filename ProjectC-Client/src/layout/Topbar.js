import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCalendarDays, faChevronDown, faChevronUp, faCircleHalfStroke, faCircleUser, faDashboard, faGear, faHome, faMoon, faSignOut, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import LogoIcon from '../images/Cavero_Icon_BW.png';
import useAuth from '../hooks/useAuth';

function Topbar() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const settingMenu = useRef(null)
  const [open, setOpen] = useState(false);

  const Menus = [
        { title: "Profiel weergeven", src: faUser, link: "/instellingen/profiel" },
        { title: "Theme", src: faCircleHalfStroke, link: "/" },
        { title: "Instellingen", src: faGear, link: "/instellingen" },
    ];

  const closeOpenMenus = (e)=>{
      if (settingMenu.current && open && !settingMenu.current.contains(e.target)) {
        setOpen(false)
      }
  }

  document.addEventListener('mousedown',closeOpenMenus);

  const handleSignOut = () => {
    axios.get(`http://localhost:8080/signout`).then((response) => {
            if (response.data.signedOut == true) {
              // Redirect back to login
              navigate("/Login");
            }
        })
  }
  
  // console.log(auth);
  return (
    <div className='bg-white shadow-md w-full h-20 flex justify-between items-center px-4'>
        {/* Header */}
        <div className='items-center mt-2'>
            <h2 className=''>Week Overzicht</h2>
        </div>

        {/* Account item */}
        <div ref={settingMenu} className='my-auto flex gap-10 items-center'>
          <button className='flex gap-2 items-center' onClick={() => setOpen(!open)}>
            <FontAwesomeIcon icon={faCircleUser} className='fa-xl text-cavero-purple'/>
            <span className=''>Hallo, {auth.FirstName}</span>
            <FontAwesomeIcon icon={faChevronDown} className={`${open && "rotate-180"} duration-100`}/>
          </button>

          {/* Dropdown menu */}
          <div ref={settingMenu} id="dropdown" className={`${ open ? "" : "hidden" } top-16 right-24 z-10 absolute bg-white divide-y rounded-lg shadow w-auto py-2`}>
              {Menus.map((Menu, index) => (
                <Link to={Menu.link} className='text-base text-gray-600 no-underline'>
                  <li className='list-none p-2.5 flex items-center gap-x-2 hover:bg-gray-100'>
                    <FontAwesomeIcon icon={Menu.src} className='w-4'/>
                    <span>{Menu.title}</span>
                  </li>
                </Link>
              ))}
          </div>

          {/* Next items */}
          <div className='flex gap-3 fa-lg items-center'>
            <FontAwesomeIcon icon={faBell} className='text-cavero-purple duration-300 hover:scale-110'/>
            <FontAwesomeIcon icon={faSignOut} className='text-cavero-purple duration-300 hover:scale-110' onClick={handleSignOut}/>
          </div>
        </div>
    </div>
  );
}

export default Topbar;
