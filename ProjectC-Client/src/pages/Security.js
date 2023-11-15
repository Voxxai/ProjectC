import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../hooks/useAuth';
import { Link, Outlet } from 'react-router-dom';


function Profile() {
  const { auth } = useAuth();
  const [ ProfileValues, setProfileValues ] = useState({
    
  });

  console.log(auth.TFA);

  return (
    <div className='flex flex-col gap-y-2 p-4 w-full'>
      <div className='w-full'>
        <span className='font-semibold text-2xl text-cavero-purple'>Security</span>
      </div>

      <div className='flex-col'>
        <span className='font-semibold text-lg'>Two-Factor-Authenticatie</span>
        <p className='text-md text-gray-500'>Two-Factor-Authenticatie voegt een extra beveiligingslaag toe aan uw account doordat er meer dan alleen een wachtwoord nodig is om in te loggen.</p>
        <label for='check' className='bg-gray-100 cursor-pointer relative w-20 h-10 rounded-full hover:bg-gray-200 duration-200 scale-75'>
            <input type='checkbox' id='check' className='sr-only peer' defaultChecked={auth.TFA == 1 ? true : false}/>
            <span className='w-2/5 h-4/5 bg-gray-500 absolute rounded-full left-1 top-1 peer-checked:bg-cavero-purple peer-checked:left-11 transition-all duration-300 '></span>
        </label>
      </div>

      {/* <button className='flex flex-row gap-x-2 items-center justify-center w-full h-10 bg-cavero-purple rounded-md text-white hover:bg-cavero-purple-dark duration-200 scale-95' onClick={sendEmail()}>Klik me</button> */}
        
    </div>
  );
}

export default Profile;