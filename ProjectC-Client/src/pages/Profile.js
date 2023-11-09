import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckCircle, faPen, faUser } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../hooks/useAuth';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';


function Profile() {
  const { auth, setAuth } = useAuth();
  const [ error, setError ] = useState(false);
  const [ errorSuccesfull, seterrorSuccesfull ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState("Gegevens zijn aangepast!");
  const [ ProfileValues, setProfileValues ] = useState({
    ID: auth.ID,
    FirstName: auth.FirstName,
    LastName: auth.LastName,
    Email: auth.Email
  });

  const SaveProfile = async (e)=>{
    try {
      await axios.post(`http://localhost:8080/user_update`, ProfileValues)
      .then(response => {
          if (response) {
              // Update succesfull
              setAuth(
                {
                  FirstName: ProfileValues.FirstName,
                  LastName: ProfileValues.LastName,
                  Email: ProfileValues.Email
                }
              );

            return
          } else {
              return;
          }

      }).catch(err => {
              console.log(err);
      });

    } catch (err) {
        console.log(err);
    }
  }

  const onChangeValues = (e) => {
    setProfileValues(prev => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  return (
    <div className='flex flex-col gap-y-2 p-4 w-full'>
      <div className='flex'>
      <span className='font-semibold text-2xl text-cavero-purple'>Uw profiel</span>
      </div>

      <div className={`bg-red-200 h-10 rounded flex mb-1 ${!error && 'hidden'}`}>
        <span>{errorMessage}</span>
      </div>

      <div className='flex flex-col mb-10'>
        <span className='font-semibold text-lg'>Account gegevens</span>
        <div className='flex flex-col gap-x-2'>
          <label className='w-full'>Email</label>
          <input type="text" name='Email' defaultValue={auth.Email} onChange={onChangeValues} className='shadow-md appearance-none border rounded w-min-2 w-4/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' placeholder='Email'/>
        </div>
      </div>
      

      <div className='flex flex-col mb-5'>
        <span className='font-semibold text-lg'>Persoonlijke gegevens</span>
        <div className='flex flex-row gap-x-2 '>

          <div className='flex flex-col gap-x-2 w-full'>
            <label className='w-full'>Voornaam</label>
            <input type="text" name='FirstName' defaultValue={auth.FirstName} onChange={onChangeValues} className='shadow-md appearance-none border rounded w-min-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none' placeholder='Voornaam'/>
          </div>

          <div className='flex flex-col gap-x-2 w-full'>
            <label className='w-full'>Achternaam</label>
            <input type="text" name='LastName' defaultValue={auth.LastName} onChange={onChangeValues} className='shadow-md appearance-none border rounded w-min-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none' placeholder='Achternaam'/>
          </div>     

        </div>
      </div>

      <div className='flex flex-row-reverse'>
        <button type='submit' onClick={SaveProfile} className='flex gap-x-1.5 items-center justify-center px-4 py-1.5 bg-cavero-purple rounded-md text-white hover:bg-cavero-purple-dark hover:scale-105 duration-200'>
          Opslaan
          <FontAwesomeIcon icon={faCheck}/>
          </button>
      </div>
        
    </div>
  );
}

export default Profile;