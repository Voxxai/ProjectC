import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCalendarDays, faChevronLeft, faDashboard, faHome, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import LogoIcon from '../images/Cavero_Icon_BW.png';

function Navbar({ openNavbar, toggleOpen, toggleClose}) {
  // const [open, setOpen] = useState(false);
  const Menus = [
    { title: "Week Overzicht", src: faHome, link: "/" },
    { title: "Evenementen", src: faCalendarDays, link: "/Evenementen" },
    { title: "Nieuws", src: faBell, link: "/Nieuws" },
    { title: "Morgen ", src: faUsers, link: "/Morgen" },
  ];

  return (
    <div className=''>
      <div className="flex">
        <div
          className={`${openNavbar ? "w-72 max-sm:absolute max-sm:z-10 max-sm:pr-4" : "w-20 max-sm:w-0 max-sm:z-10"
            } bg-cavero-purple h-screen pt-2.5 max-sm:absolute relative duration-300 `}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            color='white'
            className={`${!openNavbar ? "bg-cavero-hover-purple absolute cursor-pointer -right-3 top-6 w-4 border-dark-purple p-2 rounded-full duration-300 bg-opacity-75 hover:bg-opacity-100 rotate-180 max-sm:hidden" : 
            "bg-cavero-hover-purple absolute cursor-pointer -right-3 top-6 w-4 border-dark-purple p-2 rounded-full duration-300 bg-opacity-75 hover:bg-opacity-100"}`}
            onClick={toggleOpen}
          />
          <div className="flex min-w-max gap-x-2 items-center mb-4 max-sm:hidden">
            <img
              src={LogoIcon}
              className={`cursor-pointer duration-500 w-20 px-2`}
            />
            <h1
              className={`text-white mt-2 text-sm  ${!openNavbar && "invisible"
                }`}
            >
              Cavero<br />
              IT Consultancy
            </h1>
          </div>
          {Menus.map((Menu, index) => (
            <Link to={Menu.link} className="no-underline" key={index} onClick={toggleClose}>
              <li
                className={`flex h-16 min-w-max rounded-md mx-2 p-3 cursor-pointer hover:bg-cavero-hover-purple text-white text-large items-center gap-x-4 relative max-sm:${!openNavbar ? "hidden" : ""}`}
              >
                <FontAwesomeIcon icon={Menu.src} className="w-8 fa-lg" />
                <span className={`${!openNavbar && "hidden"} origin-left text-white no-underline text-base`}>
                  {Menu.title}
                </span>
              </li>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
