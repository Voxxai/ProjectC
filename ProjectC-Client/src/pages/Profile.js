import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckCircle, faPen, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../hooks/useAuth';
import axios from 'axios';


function Profile() {
  const { auth, setAuth } = useAuth();

  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);

  const [error, setError] = useState(false);

  const [changed, setChanged] = useState(false);

  // Setting default values to fields
  const [ProfileValues, setProfileValues] = useState({
    ID: auth.ID,
    FirstName: auth.FirstName,
    LastName: auth.LastName,
    Email: auth.Email
  });

  const SaveProfile = async (e) => {
    // Check if values are changed before sending request
    if (!changed) return;

    // Disable button and inputs
    document.getElementById('ChangeProfile').setAttribute('disabled', 'disabled');
    document.getElementById('Email').setAttribute('disabled', 'disabled');
    document.getElementById('FirstName').setAttribute('disabled', 'disabled');
    document.getElementById('LastName').setAttribute('disabled', 'disabled');

    // Show loading icon
    setLoading(true);
    setHidden(false);

    // Trying to update user to new values
    try {
      await axios.post(process.env.REACT_APP_API_URL + `/user_update`, ProfileValues)
        .then(response => {
          if (response) {
            // Update succesfull
            setChanged(false);

            // Change auth values
            setAuth(
              {
                FirstName: ProfileValues.FirstName,
                LastName: ProfileValues.LastName,
                Email: ProfileValues.Email
              }
            );

            // Trying to update session cookie to new values
            try {
              axios.post(process.env.REACT_APP_API_URL + `/session-update`, ProfileValues)
                .then(response => {
                  if (response) {
                    // Sesison update succesfull
                    return;
                  } else {
                    console.log("Opnieuw inloggen");
                  }

                }).catch(err => {
                  console.log(err);
                });

            } catch (err) {
              console.log(err);
            }

            // Hide loading icon
            setTimeout(() => {
              setLoading(false);

              // Enable button and inputs
              document.getElementById('ChangeProfile').removeAttribute('disabled');
              document.getElementById('Email').removeAttribute('disabled');
              document.getElementById('FirstName').removeAttribute('disabled');
              document.getElementById('LastName').removeAttribute('disabled');
            }, 1500)


            return
          }

        }).catch(err => {
          console.log(err);
        });

    } catch (err) {
      console.log(err);
    }
  }

  // Update values on change and set changed to true for the request to be send
  const onChangeValues = (e) => {
    setProfileValues(prev => ({ ...prev, [e.target.name]: [e.target.value] }));
    setChanged(true);
  };

  return (
    <div className='flex flex-col gap-y-2 w-full p-4'>
      <div className='flex'>
        <span className='font-semibold text-2xl text-cavero-purple'>Uw profiel</span>
      </div>

      <div className='flex flex-col mb-10'>
        <span className='font-semibold text-lg'>Account gegevens</span>
        <div className='flex flex-col gap-x-2'>
          <label className='w-full'>Email
            <div className='w-full'>
              <input type="text" id='Email' name='Email' defaultValue={auth.Email} onChange={onChangeValues} className='w-3/4' placeholder='Email' />
            </div>
          </label>
        </div>
      </div>


      <div className='flex flex-col mb-5'>
        <span className='font-semibold text-lg'>Persoonlijke gegevens</span>
        <div className='flex gap-2 max-sm:flex-col max-lg:flex-row'>

          <div className='flex-col gap-x-2 w-2/5 max-sm:w-full'>
            <label className='w-full'>Voornaam
              <input type="text" id='FirstName' name='FirstName' defaultValue={auth.FirstName} onChange={onChangeValues} placeholder='Voornaam' />
            </label>
          </div>

          <div className='flex-col gap-x-2 w-3/5 max-sm:w-full'>
            <label className='w-full'>Achternaam
              <input type="text" id='LastName' name='LastName' defaultValue={auth.LastName} onChange={onChangeValues} placeholder='Achternaam' />
            </label>
          </div>

        </div>
      </div>

      <div className='flex flex-row-reverse'>
        <button type='submit' onClick={SaveProfile} id='ChangeProfile' className='flex gap-x-1.5 items-center justify-center px-4 py-1.5 bg-cavero-purple rounded-md text-white hover:bg-cavero-purple-dark hover:scale-105 duration-200'>
          Opslaan
          <FontAwesomeIcon icon={loading ? faSpinner : faCheck} className={`${loading ? "animate-spin" : ""} ${hidden ? 'hidden' : ''}`} />
        </button>
      </div>

    </div>
  );
}

export default Profile;