import React, { useState, useEffect, useRef } from 'react';
import axios, { Axios } from 'axios';
import "./Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong, faArrowRightLong, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Sha1 from 'sha1';

function Login() {
    const { setAuth } = useAuth();

    const [TFAContainer, setTFAContainer] = useState(false);
    const [TFATimer, setTFATimer] = useState(true);
    const [TFATimerResend, setTFATimerResend] = useState(false);
    const [TFACode, setTFACode] = useState('');
    const initialTFAInputValues = ['', '', '', '', '', ''];
    const [TFAInputValues, setTFAInputValues] = useState(initialTFAInputValues);

    const [FPWContainer, setFPWContainer] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const [responseValues, setResponseValues] = useState({});

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    axios.defaults.withCredentials = true;

    // Getting a random code between 100000 and 999999
    const RedeemCode = async () => {
        let difference = 999999 - 100000;
        let rand = Math.random();

        rand = Math.floor(rand * difference);
        // Prevent the number being under 100000
        rand = rand + 100000;

        return rand;
    }

    const setTimer = async () => {
        setTFATimer(true);

        setTimeout(() => {
            setTFATimer(false);
        }, 300000); // 5 min timer for the code or the user has to request a new code
    }

    const setTimerTenSeconds = async () => {
        setTFATimerResend(true);

        setTimeout(() => {
            setTFATimerResend(false);
        }, 10000); // 10 sec timer for the code or the user has to request a new code
    }

    // Resend the email with the code
    const ResendMail = async () => {
        setTFAInputValues(initialTFAInputValues);

        // We don't want the user to spam the button so we set a timer for 10 sec
        if (!TFATimerResend) {
            sendEmail();
            return;
        }
    }

    // Send the email with the code
    const sendEmail = async () => {
        const mailOptions = {
            // redeeming the code
            Code: await RedeemCode(),
            Email: values.email,
        }

        setError(false);

        setTFACode(mailOptions.Code);
        // Set the timer for the code and for the resend button
        setTimerTenSeconds();
        setTimer();

        // Send the email
        await axios.post(process.env.REACT_APP_API_URL + `/send-email`, mailOptions)
            .then(response => {
                if (response.data.status === 200) {
                    console.log('Email sent');
                }
            });
    };

    // Creating a session with the user details
    const setSession = async (ID, FirstName, LastName, Email, Password, Level, TFA) => {
        const userDetails = { ID, FirstName, LastName, Email, Password, Level, TFA };

        try {
            await axios.post(process.env.REACT_APP_API_URL + `/session-create`, userDetails)
                .then(response => {
                    return;
                });

        } catch (err) {
            console.log(err);

        }
    }

    // Getting the user details
    const getUser = async () => {
        // if one of the fields is empty
        if (!values.email.length > 0) {
            setErrorMessage("Vul elk veld in!");
            setError(true);
            return;
        }

        setError(false);
      
        // trying to login the user
            try {                
                await axios.post(process.env.REACT_APP_API_URL + `/login`, values)
                .then(response => {
                    if (response.data.Login) {
                        // Login succes
                        const ID = response.data.ID;
                        const FirstName = response.data.FirstName;
                        const LastName = response.data.LastName;
                        const Email = response.data.Email;
                        const Password = response.data.Password;
                        const Level = response.data.Level;
                        const TFA = response.data.TFA;

                        setResponseValues({ ID, FirstName, LastName, Email, Password, Level, TFA });

                        // Checking if 2FA is enabled
                        if (TFA == 1) {
                            setTFAContainer(true);
                            sendEmail();
                            return;

                        } else {
                            // If not 2FA is enabled set the user details to the authenticate and session
                            setSession(ID, FirstName, LastName, Email, Password, Level, TFA);

                            setAuth({ ID, FirstName, LastName, Email, Password, Level, TFA });
                            navigate(from, { replace: true });
                        }

                    } else {
                        setErrorMessage("Emailadres of wachtwoord klopt niet!");
                        setError(true);
                        return;
                    }

                }).catch(err => {
                    setErrorMessage("Er is iets fout gegaan bij het ophalen!");
                    setError(true);
                    console.log(err);
                    return;
                });

        } catch (err) {
            setErrorMessage("Er is iets fout gegaan bij het versturen!");
            setError(true);
            console.log(err);
            return;
        }


    }

    // Handling the input, encrypting the password
    const handleInput = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.name == 'password' ? [Sha1(e.target.value)] : [e.target.value] }));
    }

    useEffect(() => {
        // show loading spinner
        // setLoading(true);

        axios.get(process.env.REACT_APP_API_URL + `/login`).then((response) => {
            if (response.data.loggedIn == true) {
                const ID = response.data.user.ID;
                const FirstName = response.data.user.FirstName;
                const LastName = response.data.user.LastName;
                const Email = response.data.user.Email;
                const Password = response.data.user.Password;
                const Level = response.data.user.Level;
                const TFA = response.data.user.TFA;

                // Creating a session with the user details
                setSession(ID, FirstName, LastName, Email, Password, Level, TFA);

                // Storing the user details to the authenticate
                setAuth({ ID, FirstName, LastName, Email, Password, Level, TFA });

                // hide loading spinner
                // setTimeout(() => {
                //     setLoading(false);
                // },1000);

                // Redirect back to url
                navigate(from, { replace: true });

            }
        }, [])


    }, [])



    {/* 2FA SECTION */ }
    const handlePaste = (e) => {
        e.preventDefault();

        // Get the users clipboard data
        const pastedNumbers = e.clipboardData.getData('text');

        // Split the characters
        const Numbers = pastedNumbers.split('');

        // Check if the user pastes letters
        if (Numbers.some((number) => isNaN(number))) {
            return;
        }

        // Adding empty slots if the user pastes les than 6 characters
        const paddedNumbers = Numbers.concat(Array(6 - Numbers.length).fill(''));

        // Update the input values with the first 6 characters
        const newInputValues = paddedNumbers.slice(0, 6);
        setTFAInputValues(newInputValues);
    };

    const handleTFAchange = (index, value) => {
        // First set erros to false and check for junk
        setError(false);

        preventJunk(index, value);

        // Update the input values with the changed value at the specified index
        const newInputValues = [...TFAInputValues];
        newInputValues[index] = value;
        setTFAInputValues(newInputValues);
    };

    const handleTFAchangeFocus = (index, value, event) => {
        var keyCode = event.keyCode || event.which;
        // If backspace or delete is pressed, focus the previous input
        if (keyCode === 8 || keyCode === 46) {
            // Prevent first one from focusing
            if (index === 0) return;
            
            var previousInput = document.getElementById(`input-${index - 1}`);
            previousInput.focus();
            return;
        }
    
        // If the input value is not empty, focus the next input
        if (value !== '') {
            // Prevent last one from focusing
            if (index === 5) return;
    
            var nextInput = document.getElementById(`input-${index + 1}`);
            nextInput.focus();
            return;
        }
    };

    // Preventing the user from pasting letters or other characters besides numbers
    const preventJunk = (index, value) => {
        if (value === '' || !value.match(/[0-9]/)) {
            return;
        }
        else {
            const newInputValues = [...TFAInputValues];
            newInputValues[index] = "";
        }
    }

    // Confirming the code
    const ConfirmCode = async () => {
        setError(false);

        // Check if the code is expired
        if (TFATimer) {
            // Check if the code is correct
            if (TFAInputValues.join('') == TFACode.toString()) {
                await setSession(responseValues.ID, responseValues.FirstName, responseValues.LastName, responseValues.Email, responseValues.Password, responseValues.Level, responseValues.TFA);
                setAuth(responseValues.ID, responseValues.FirstName, responseValues.LastName, responseValues.Email, responseValues.Password, responseValues.Level, responseValues.TFA);

                navigate(from, { replace: true });
            }
            else {
                setErrorMessage('Code is niet gelijk aan de code die is verstuurd!');
                setError(true);
            }
        } else {
            setError(true);
            setErrorMessage('Code is verlopen! Vraag een nieuwe code aan.');
            return;
        }
    }

    // Forgot password section
    const ForgotPasswordSendEmail = async () => {
        try {
            // Check if the email is valid
            const userID = await GetIDbyEmail(values.email);
    
            // If the email is not found
            if (userID === null) {
                setError(true);
                setErrorMessage('Emailadres is niet gevonden!');
                return;
            }
    
            // Set the email options
            const mailOptions = {
                ID: userID,
                Email: values.email,
            };
    
            // Send the email
            await axios.post(`http://localhost:8080/forgot-password-email`, mailOptions)
                .then(response => {
                    if (response.data.EmailSent == true) {
                        setFPWContainer(false);
                    }
                });
        } catch (err) {
            console.log(err);
        }
    };    

    // Get the user ID by email
    const GetIDbyEmail = async (Email) => {
        try {
            const response = await axios.get(`http://localhost:8080/get-id-by-email/${Email}`);
    
            if (response.status === 200) {
                // Return the ID
                return response.data[0].ID;
            }
    
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    return (
        <div className='bg-gradient-to-br from-white to-cavero-purple-light'>
            <div className='h-screen w-screen flex items-center justify-center'>

                {/* Login container */}
                <div className={`${TFAContainer && 'hidden' || FPWContainer && 'hidden'} w-[550px] p-12 py-24 bg-white shadow-2xl shadow-cavero-purple-light rounded`}>
                    <div className='mb-3'>
                        <h1 className='text-cavero-purple font-semibold'>Login bij Cavero</h1>
                        <p className='text-gray-600 text-md'>Je kunt bij Cavero inloggen met de volgende gegevens.</p>
                    </div>
                    <div className={`bg-red-200 h-10 rounded flex mb-3 ${!error && 'hidden'}`}>
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
                        <div className='flex flex-row items-center mb-3'>
                            <div className='flex-col'>
                                <a href='/register' className='flex-1'>Nog geen account?</a> <br />
                                <a className='flex-1 cursor-pointer' onClick={() => setFPWContainer(true)}>Wachtwoord vergeten?</a>
                            </div>
                            <div className='flex-1'></div>
                            <button type="button" className='bg-gradient-to-r from-cavero-purple to-[#c279cc] text-white w-32 h-9 rounded-full duration-300 hover:scale-105 hover:shadow-lg' onClick={getUser}>Login <FontAwesomeIcon icon={faArrowRightLong} color='white' /></button>
                        </div>

                    </form>
                </div>

                {/* 2FA container */}
                <div className={`${!TFAContainer && 'hidden'} w-[550px] p-12 py-24 bg-white shadow-2xl shadow-cavero-purple-light rounded`}>
                    <div className=''>
                        <h2 className='text-cavero-purple font-semibold'>Two Factor Authenticate</h2>
                        <p className='text-gray-600 text-md'>Er is een bericht naar uw email gestuurd met de 2FA code. Deze code is voor 5 min geldig.</p>
                    </div>

                    <div className={`bg-red-200 h-10 rounded flex ${!error && 'hidden'}`}>
                        <p className='text-black my-auto p-2 text-sm'>{errorMessage}</p>
                    </div>

                    <div className='mt-4'>
                        <p className='text-cavero-purple font-semibold'>Voer hieronder uw 6 digit code in.</p>
                    </div>

                    <form>
                        <div className='flex flex-row gap-x-2'>
                            {TFAInputValues.map((value, index) => (
                                <input
                                    key={index}
                                    id={`input-${index}`}
                                    type='tel'
                                    maxLength={1}
                                    className='shadow-none text-center h-20 text-4xl border-b-4 duration-300 focus:border-b-cavero-purple'
                                    pattern='[\d]*'
                                    value={value}
                                    onChange={(e) => handleTFAchange(index, e.target.value)}
                                    onPaste={handlePaste}
                                    onKeyUp={(e) => handleTFAchangeFocus(index, e.target.value, e)}
                                />
                            ))}
                        </div>
                    </form>

                    <div className='flex flex-row items-center mt-4'>
                        <a className='flex-1 cursor-pointer' onClick={ResendMail}>Opnieuw code sturen</a>
                        <button type="button" className='bg-gradient-to-r from-cavero-purple to-[#c279cc] text-white w-32 h-9 rounded-full duration-300 hover:scale-105 hover:shadow-lg' onClick={ConfirmCode}>Continue <FontAwesomeIcon icon={faArrowRightLong} color='white' /></button>
                    </div>
                </div>

                {/* Forgot Password Container */}
                <div className={`${!FPWContainer && 'hidden'} w-[550px] p-12 py-24 bg-white shadow-2xl shadow-cavero-purple-light rounded`}>
                    <div className='' >
                        <button className='flex flex-row items-center gap-1' onClick={() => setFPWContainer(false)}>
                            <FontAwesomeIcon icon={faArrowLeftLong} className='text-gray-400' onClick={() => setTFAContainer(false)} />
                            <span className='font-medium text-gray-400'>Terug</span>
                        </button>
                    </div>
                    <div className=''>
                        <div>
                            <h2 className='text-cavero-purple font-semibold'>Wachtwoord vergeten</h2>
                            <p className='text-gray-600 text-md'>Er wordt een e-mail gestuurd naar u met een link waarmee u uw wachtwoord kunt aanpassen.</p>
                        </div>
                        <div className={`bg-red-200 h-10 rounded flex mb-3 ${!error && 'hidden'}`}>
                            <p className='text-black my-auto p-2 text-sm'>{errorMessage}</p>
                        </div>

                        <div className='mt-4'>
                            <div className='input-container mb-4'>
                                <div className='flex relative items-center'>
                                    <FontAwesomeIcon icon={faEnvelope} color='black' className='w-6 h-6 text-gray-500 p-1' />
                                    <input type="email" className='w-full h-12 border-none outline-none rounded shadow-none' name='email' id="email" placeholder="E-mailadres" onChange={handleInput} required />
                                </div>
                                <div className='h-[3px] bg-cavero-purple duration-300 rounded-full ColoredLine'></div>
                            </div>

                            <div className='flex flex-row-reverse items-center mb-3'>
                                <button type="button" className='bg-gradient-to-r from-cavero-purple to-[#c279cc] text-white w-32 h-9 rounded-full duration-300 hover:scale-105 hover:shadow-lg' onClick={ForgotPasswordSendEmail}>Versturen <FontAwesomeIcon icon={faArrowRightLong} color='white' /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
