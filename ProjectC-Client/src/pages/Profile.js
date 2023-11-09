import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../hooks/useAuth';
import { Link, Outlet } from 'react-router-dom';


function Profile() {
  const { auth } = useAuth();
  const [ ProfileValues, setProfileValues ] = useState({
    
  });

  return (
    <div className='flex flex-col gap-y-2 p-4 w-full'>
      <div className='flex'>
      <span className='font-semibold text-2xl text-cavero-purple'>Uw profiel</span>
      </div>
      <div className='flex flex-col mb-10'>
        <span className='font-semibold text-lg'>Account gegevens</span>
        <div className='flex flex-col gap-x-2'>
          <label className='w-full'>Email</label>
          <input type="text" defaultValue={auth.Email} className='shadow-md appearance-none border rounded w-min-2 w-4/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' placeholder='Email'/>
        </div>
      </div>
      

      <div className='flex flex-col'>
        <span className='font-semibold text-lg'>Persoonlijke gegevens</span>
        <div className='flex flex-row gap-x-2 '>

          <div className='flex flex-col gap-x-2 w-full'>
            <label className='w-full'>Voornaam</label>
            <input type="text" defaultValue={auth.FirstName} className='shadow-md appearance-none border rounded w-min-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none' placeholder='Voornaam'/>
          </div>

          <div className='flex flex-col gap-x-2 w-full'>
            <label className='w-full'>Achternaam</label>
            <input type="text" defaultValue={auth.LastName}  className='shadow-md appearance-none border rounded w-min-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none' placeholder='Achternaam'/>
          </div>     

        </div>
      </div>
        
    </div>
  );
}

export default Profile;