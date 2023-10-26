import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from "react-router-dom";

//TODO encrypt wachtwoord voordat het gestuurd wordt naar de server op de params.
//Token meesturen als je bent ingelogd.

function Login() {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getUser = async () => {
        if (!email.length > 0 || !password.length > 0) {
            setErrorMessage("Vul elk veld in!");
            setError(true);
            return;
        }
        
        setError(false);

        try {
            const response = await axios.get(`http://localhost:8080/login/${email}&${password}`);
            if (response.data.length > 0) {
                // Login succes
                const ID = response.data[0].ID;
                const FirstName = response.data[0].Voornaam;
                const LastName = response.data[0].Achternaam;
                const Email = response.data[0].Email;
                const Password = response.data[0].Wachtwoord;
                const Level = response.data[0].Level;

                setAuth({ ID, FirstName, LastName, Email, Password, Level});
                navigate(from, { replace: true });
            } else {
                setErrorMessage("Emailadres of wachtwoord klopt niet!");
                setError(true);
                return;
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='bg-gradient-to-br from-white to-cavero-purple-light'>
            <div className='login-container h-screen w-screen flex items-center justify-center'>
                <div className='form-login mb-32 bg-white shadow-2xl shadow-cavero-purple-light rounded'>
                    <div className='mt-6'>
                        <h1>Login bij Cavero</h1>
                        <p>Je kunt bij Cavero inloggen met de volgende gegevens.</p>
                    </div>
                    <div className={`bg-red-200 h-10 rounded flex ${!error && 'hidden'}`}>
                        <p className='text-black my-auto p-2 text-sm'>{errorMessage}</p>
                    </div>
                <form>
                    <div className='input-container'>
                    <div className='input-group'>
                        <FontAwesomeIcon icon={faEnvelope} color='black' className='field-icon'/>
                        <input type="email" className='field-input' id="email" placeholder="E-mailadres" onChange={e => setEmail(e.target.value)} required/>
                    </div>
                    <div className='ColoredLine'></div>
                    </div>
                    
                    <div className='input-container'>
                    <div className='input-group'>
                        <FontAwesomeIcon icon={faLock} color='black' className='field-icon'/>
                        <input type="password" className='field-input' id="password" placeholder="Wachtwoord" onChange={e => setPassword(e.target.value)} required/>
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
