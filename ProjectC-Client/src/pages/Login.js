import React, { useState, useEffect } from 'react';
import axios, { Axios } from 'axios';
import "./Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Sha1 from 'sha1';

function Login() {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    axios.defaults.withCredentials = true;

    const RedeemCode = async () => {
        let difference = 999999 - 100000; 
        let rand = Math.random();

        rand = Math.floor( rand * difference);
        // Prevent the number being under 100000
        rand = rand + 100000;

        return rand;
    }

    const sendEmail = async () => {
        const mailOptions = {
            Code: await RedeemCode(),
            Email: values.email,
        }

        await axios.post(`http://localhost:8080/send-email`, mailOptions)
            .then(response => {
                if (response.data.status === 200) {
                    console.log('Email sent');
                }
            });
    };

    const getUser = async () => {
        if (!values.email.length > 0 || !values.password.length > 0) {
            setErrorMessage("Vul elk veld in!");
            setError(true);
            return;
        }
        
        setError(false);

        try {
            //Hashing the password
            values.password = Sha1(values.password);
            
            await axios.post(`http://localhost:8080/login`, values)
            .then(response => {
                if (response.data.Login) {
                    // Login succes
                    const ID = response.data.ID;
                    const FirstName = response.data.FirstName;
                    const LastName = response.data.LastName;
                    const Email = response.data.Email;
                    const Password = response.data.Wachtwoord;
                    const Level = response.data.Level;
                    const TFA = response.data.TFA;
    
                    setAuth({ ID, FirstName, LastName, Email, Password, Level, TFA });
                    navigate(from, { replace: true });
                } else {
                    setErrorMessage("Emailadres of wachtwoord klopt niet!");
                    setError(true);
                    return;
                }

            }).catch(err => {
                    console.log(err);
            });

        } catch (err) {
            console.log(err);
        }
    }

    const handleInput = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: [e.target.value] }));
    }

    useEffect(() => {
        // show loading spinner
        // setLoading(true);

        axios.get(`http://localhost:8080/login`).then((response) => {
            if (response.data.loggedIn == true) {
                const ID = response.data.user.ID;
                const FirstName = response.data.user.FirstName;
                const LastName = response.data.user.LastName;
                const Email = response.data.user.Email;
                const Password = response.data.user.Wachtwoord;
                const Level = response.data.user.Level;
                const TFA = response.data.user.TFA;
                
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

    return (
        <div className='bg-gradient-to-br from-white to-cavero-purple-light'>
            <div className='login-container h-screen w-screen flex items-center justify-center'>
                <div className='form-login mb-32 bg-white shadow-2xl shadow-cavero-purple-light rounded'>
                    <div className='mt-6'>
                        <h1 className='text-cavero-purple font-semibold'>Login bij Cavero</h1>
                        <button className='btn-register' onClick={sendEmail}>klik</button>
                        <p className='text-gray-600 text-md'>Je kunt bij Cavero inloggen met de volgende gegevens.</p>
                    </div>
                    <div className={`bg-red-200 h-10 rounded flex mb-1 ${!error && 'hidden'}`}>
                        <p className='text-black my-auto p-2 text-sm'>{errorMessage}</p>
                    </div>
                <form>
                    <div className='input-container'>
                    <div className='input-group'>
                        <FontAwesomeIcon icon={faEnvelope} color='black' className='field-icon'/>
                        <input type="email" className='field-input' name='email' id="email" placeholder="E-mailadres" onChange={handleInput} required/>
                    </div>
                    <div className='ColoredLine'></div>
                    </div>
                    
                    <div className='input-container'>
                    <div className='input-group'>
                        <FontAwesomeIcon icon={faLock} color='black' className='field-icon'/>
                        <input type="password" className='field-input' name='password' id="password" placeholder="Wachtwoord" onChange={handleInput} required/>
                    </div>
                    <div className='ColoredLine'></div>
                    </div>
                    <div className='form-extras'>
                    <a>Wachtwoord vergeten?</a>
                    <button type="button" className='btn-submit' onClick={getUser}>Login <FontAwesomeIcon icon={faArrowRightLong} color='white'/></button>
                    </div>
                    
                </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
