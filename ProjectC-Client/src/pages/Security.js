import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../hooks/useAuth';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';


function Profile() {
  const { auth, setAuth } = useAuth();
  const [ ProfileValues, setProfileValues ] = useState({
    ID: auth.ID,
    TFA: auth.TFA == 0 ? 1 : 0 // Bug first console log is 0, second is 0, third is 1. TEMP FIX
  });

  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);

  const setSession = async (TFA) => {
    const userDetails = { TFA };

    try {
        await axios.post(`http://localhost:8080/session-update`, userDetails)
                    .then(response => {
                        return true;
                    });

    } catch (err) {
        console.log(err);

    }
  }

  const update_TFA = async () => {
    document.getElementById('TFA').setAttribute('disabled', 'disabled');

    setLoading(true);
    setHidden(false);
  
    try {
      const response = await axios.post(`http://localhost:8080/user_update`, ProfileValues);
  
      if (response) {
        // Change session values
        if (await setSession(ProfileValues.TFA) == true) {
          // Change auth values
          await setAuth({TFA: ProfileValues.TFA});
        }
  
        setTimeout(() => {
          setLoading(false);
          document.getElementById('TFA').removeAttribute('disabled');
        }, 1000);

      } else {
        console.log("Fout bij het updaten van de 2FA");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleInput = async (e) => {
    let isChecked = e.target.checked;
    const CheckboxValue = isChecked === true ? 0 : 1;
  
    await setProfileValues((prev) => ({ ...prev, TFA: CheckboxValue }));
    await update_TFA();
  }

  

  return (
    <div className='flex flex-col gap-y-2 p-4 w-full'>
      <div className='w-full'>
        <span className='font-semibold text-2xl text-cavero-purple'>Security</span>
      </div>

      <div className='flex-col'>
        <span className='font-semibold text-lg'>Two-Factor-Authenticatie</span>
        <p className='text-md text-gray-500'>Two-Factor-Authenticatie voegt een extra beveiligingslaag toe aan uw account doordat er meer dan alleen een wachtwoord nodig is om in te loggen.</p>
        <div className='flex flex-row items-center'>
        <label for='TFA' className='bg-gray-100 cursor-pointer relative w-20 h-10 rounded-full hover:bg-gray-200 duration-200 scale-75' >
            <input type='checkbox' id='TFA' className='sr-only peer' name='TFA' defaultChecked={auth.TFA == 1 ? true : false} onChange={(e) => handleInput(e)}/>
            <span className='w-2/5 h-4/5 bg-gray-500 absolute rounded-full left-1 top-1 peer-checked:bg-cavero-purple peer-checked:left-11 transition-all duration-300 '></span>
            
        </label>
        <FontAwesomeIcon icon={loading ? faSpinner : faCheck} className={`${loading ? "animate-spin text-gray-500" : "text-green-500"} ${hidden ? 'hidden' : ''}`}/>
        </div>
      </div>

      {/* <button className='flex flex-row gap-x-2 items-center justify-center w-full h-10 bg-cavero-purple rounded-md text-white hover:bg-cavero-purple-dark duration-200 scale-95' onClick={sendEmail()}>Klik me</button> */}
        
    </div>
  );
}

export default Profile;