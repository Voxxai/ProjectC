import React, { useState } from 'react';
import { Outlet, Link } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCalendarDays, faChevronLeft, faDashboard, faHome, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import LogoIcon from '../images/Cavero_Icon_BW.png';

function Navbar() {

    const [open, setOpen] = useState(true);
    const Menus = [
        { title: "Week Overzicht", src: faHome },
        { title: "Evenementen", src: faCalendarDays },
        { title: "Nieuws", src: faBell },
        { title: "Morgen ", src: faUsers },
    ];
  return (
    <div>
    <div className="flex">
      <div
        className={` ${
          open ? "w-72" : "w-20"
        } bg-cavero-purple h-screen pt-2.5 relative duration-300`}
      >
        <FontAwesomeIcon icon={faChevronLeft} color='white'
          className={`bg-cavero-hover-purple absolute cursor-pointer -right-3 top-6 w-4 border-dark-purple p-2 rounded-full duration-300  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex min-w-max gap-x-2 items-center mb-4">
          <img
            src={LogoIcon}
            className={`cursor-pointer duration-500 w-16 ml-1`}
          />
          <h1
            className={`text-white mt-2 text-sm  ${
              !open && "invisible"
            }`}
          >
            Cavero<br/>
            IT Consultancy
          </h1>
        </div>
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex min-w-max rounded-md mx-2 p-3 cursor-pointer hover:bg-cavero-hover-purple text-white text-large items-center gap-x-4`}>
              <FontAwesomeIcon icon={Menu.src} size='1x'/>
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
      </div>
      </div>
    </div>
  );
};
export default Navbar;