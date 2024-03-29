import React, { useState, useEffect, useRef } from 'react';
import axios, { Axios } from 'axios';
import "./Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong, faArrowRightLong, faCheck, faEnvelope, faLock, faPencilSquare, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Sha1 from 'sha1';
import { useParams } from 'react-router-dom';

function ForgotPassword() {
    const { setAuth } = useAuth();  
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [ error, setError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    
    const [values, setValues] = useState({
        password: '',
        passwordConfirm: ''
    });

    // handle input change
    const handleInput = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    // check if password is correct
    const CorrectPassword = () => {
        if (values.password.length < 6 || values.passwordConfirm.length < 6) {
            return false;
        } else {
            return true;
        }
    }

    const ResetPassword = async () => {
        let tempPassword = '';
        setError(false);

        // check if password is correct length
        if (!CorrectPassword()) {
            setErrorMessage('Wachtwoord moet minimaal 6 tekens bevatten.');
            setError(true);
            return;
        }

        // check if passwords match
        if (values.password != values.passwordConfirm) {
            setErrorMessage('Wachtwoorden komen niet overeen.');
            setError(true);
            return;
        }

        // hash password
        tempPassword = Sha1(values.password);

        // send request to reset password
        try {
            await axios.post('http://localhost:8080/resetpassword', { id: id, password: tempPassword })
                    .then((response) => {
                        if (response.data.status == 'success') {
                            navigate('/login');
                        } else {
                            setError(true);
                            setErrorMessage('Er is iets fout gegaan. Wachtwoord is niet gereset.');
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } catch (error) {
                console.log(error);
            }
    }

    return (
        <div className='bg-gradient-to-br from-white to-cavero-purple-light'>
            <div className='h-screen w-screen flex items-center justify-center'>

            <div className={`w-[550px] p-12 py-24 bg-white shadow-2xl shadow-cavero-purple-light rounded`}>
                    <div className=''>
                        <div>
                            <h2 className='text-cavero-purple font-semibold'>Wachtwoord resetten</h2>
                            <p className='text-gray-600 text-md'>Voer hieronder uw nieuwe wachtwoord in. Nadat u het hebt opgeslagen, wordt u doorgestuurd naar de inlogpagina om opnieuw in te loggen.</p>
                        </div>
                        <div className={`bg-red-200 h-10 rounded flex mb-3 ${!error && 'hidden'}`}>
                            <p className='text-black my-auto p-2 text-sm'>{errorMessage}</p>
                        </div>

                        <div className='mt-4'>
                            <div className='input-container mb-4'>
                                <div className='flex relative items-center'>
                                    <FontAwesomeIcon icon={faLock} color='black' className='w-6 h-6 text-gray-500 p-1' />
                                    <input type="password" className='w-full h-12 border-none outline-none rounded shadow-none' name='password' id="password" placeholder="Nieuw Wachtwoord" onChange={(e) => handleInput(e)} required />
                                </div>
                                <div className='h-[3px] bg-cavero-purple duration-300 rounded-full ColoredLine'></div>
                            </div>

                            <div className='input-container mb-4'>
                                <div className='flex relative items-center'>
                                    <FontAwesomeIcon icon={faLock} color='black' className='w-6 h-6 text-gray-500 p-1' />
                                    <input type="password" autocomplete="off" className='w-full h-12 border-none outline-none rounded shadow-none' name='passwordConfirm' id="passwordConfirm" placeholder="Herhaal wachtwoord" onChange={(e) => handleInput(e)} required />
                                </div>
                                <div className='h-[3px] bg-cavero-purple duration-300 rounded-full ColoredLine'></div>
                            </div>

                            <div className='flex flex-row-reverse items-center mb-3'>
                                <button type="button" autocomplete="off" className='bg-gradient-to-r from-cavero-purple to-[#c279cc] text-white w-32 h-9 rounded-full duration-300 hover:scale-105 hover:shadow-lg' onClick={() => ResetPassword()}>Opslaan <FontAwesomeIcon icon={faArrowRightLong} color='white' /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
