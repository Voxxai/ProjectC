import React, { useState, useEffect } from 'react';
import axios, { Axios, all } from 'axios';
import "./Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong, faEnvelope, faLayerGroup, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { redirect } from 'react-router-dom';
import Sha1 from 'sha1';

function Register() {

    const [values, setValues] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        level: 1
    });

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    axios.defaults.withCredentials = true;


    const registerUser = async () => {
        // if one of the fields is empty
        if (values.email == '' || values.password == '' || values.firstname == '' || values.lastname == '') {
            setError(true);
            setErrorMessage("Vul alle velden in");
            return;
        }
        // if email is not valid or password is not valid
        else if (!values.email.toString().includes('@')) {
              setError(true);
            setErrorMessage("Email moet een @ bevatten");
            return;
        }
        else if (values.password.toString().length < 6) {
            setError(true);
            setErrorMessage("Wachtwoord moet minimaal 6 tekens bevatten.");
            return;
        }

        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + '/register', values);
            console.log(response);
            if (response.data.error) {
                setError(true);
                setErrorMessage(response.data.error);
            } else {
                setError(false);
                setErrorMessage("");
                window.location.href = '/login';
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleInput = (e) => {

        setValues(prev => ({ ...prev, [e.target.name]: e.target.name == 'password' ? [Sha1(e.target.value)] : [e.target.value] }));
    }


  return (
<div className='bg-gradient-to-br from-white to-cavero-purple-light'>
            <div className='h-screen w-screen flex items-center justify-center'>

                {/* Login container */}
                <div className="w-[550px] p-12 py-24 bg-white shadow-2xl shadow-cavero-purple-light rounded">
                    <div className='mb-3'>
                        <h1 className='text-cavero-purple font-semibold'>Account Registreren</h1>
                        <p className='text-gray-600 text-md'>Op deze pagina kan je registreren</p>
                    </div>
                    <div className={`bg-red-200 h-13 rounded flex mb-3 ${!error && 'hidden'}`}>
                        <p className='text-black my-auto p-2 text-sm'>{errorMessage}</p>
                    </div>

                    <form>
                        <div className='input-container mb-4'>
                            <div className='flex relative items-center'>
                                <FontAwesomeIcon icon={faEnvelope} color='black' className='absolute w-6 h-6 text-gray-500 p-1' />
                                <input type="email" className='w-full h-12 pl-9 border-none outline-none rounded shadow-none ml-6' name='email' id="email" placeholder="E-mailadres" onChange={handleInput} required />
                            </div>
                            <div className='h-[3px] bg-cavero-purple duration-300 rounded-full ColoredLine'></div>
                        </div>

                        <div className='input-container mb-4'>
                            <div className='flex relative items-center'>
                                <FontAwesomeIcon icon={faLock} color='black' className='absolute w-6 h-6 text-gray-500 p-1' />
                                <input type="password" className='w-full h-12 pl-9 border-none outline-none rounded shadow-none ml-6' name='password' id="password" placeholder="Wachtwoord" onChange={handleInput} required />
                            </div>
                            <div className='h-[3px] bg-cavero-purple duration-300 rounded-full ColoredLine'></div>
                        </div>
                        <div className='input-container mb-4'>
                            <div className='flex relative items-center'>
                                <FontAwesomeIcon icon={faUser} color='black' className='absolute w-6 h-6 text-gray-500 p-1' />
                                <input type="text" className='w-full h-12 pl-9 border-none outline-none rounded shadow-none ml-6' name='firstname' id="firstname" placeholder="Voornaam" onChange={handleInput} required />
                            </div>
                            <div className='h-[3px] bg-cavero-purple duration-300 rounded-full ColoredLine'></div>
                        </div>
                        <div className='input-container mb-4'>
                            <div className='flex relative items-center'>
                                <FontAwesomeIcon icon={faUser} color='black' className='absolute w-6 h-6 text-gray-500 p-1' />
                                <input type="text" className='w-full h-12 pl-9 border-none outline-none rounded shadow-none ml-6' name='lastname' id="lastname" placeholder="Achternaam" onChange={handleInput} required />
                            </div>
                            <div className='h-[3px] bg-cavero-purple duration-300 rounded-full ColoredLine'></div>
                        </div>
                        <div className='flex flex-row items-center mb-3'>
                            <div className='flex-col'>
                                <a href='/Login' className='flex-1'>Hier inloggen</a> <br />
                            </div>
                            <div className='flex-1'></div>
                            <button type="button" className='bg-gradient-to-r from-cavero-purple to-[#c279cc] text-white w-32 h-9 rounded-full duration-300 hover:scale-105 hover:shadow-lg' onClick={registerUser}>Registreer <FontAwesomeIcon icon={faArrowRightLong} color='white' /></button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;