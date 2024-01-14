import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faGear, faGears, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../hooks/useAuth';
import { Link, Outlet } from 'react-router-dom';


function Settings() {
  const { auth } = useAuth();

  const Menus = [
    { title: "Profiel", src: faUser, link: "/instellingen/profiel" },
    { title: "Beveiliging", src: faLock, link: "/instellingen/security" },
    // { title: "Standaard Evenementen", src: faCalendar, link: "/instellingen/evenementen" },
    { title: "Instellingen", src: faGear, link: "/instellingen/options" },
  ];

  return (
    <div className="flex h-full bg-slate-100 ">
      <div className='flex bg-white h-5/6 m-auto w-4/6 p-4 rounded-md shadow-md'>
        <div className='flex flex-col w-3/12'>
          <span className='text-md italic font-semibol text-gray-400'>Account</span>
          <span className='text-xl'>{auth.FirstName} {auth.LastName}</span>

          {/* Nav Items */}
          <div className='flex flex-col mt-4'>
            {Menus.map((Menu, index) => (
              <Link to={Menu.link} className='no-underline text-slate-700'>
                <li className={`flex h-10 hover:bg-gray-100 cursor-pointer items-center gap-x-3 rounded-md px-2`}>
                  <FontAwesomeIcon icon={Menu.src} />
                  <span>{Menu.title}</span>
                </li>
              </Link>
            ))}
          </div>

        </div>
        <div className="flex-1 flex flex-col h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Settings;