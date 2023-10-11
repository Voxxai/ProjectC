import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'

function Login() {
    const apiCall = () => {
        axios.get('http://localhost:8080/').then((data) => {
            console.log(data);
        })
    }

    return (
        <div className='login-container h-screen w-screen flex items-center justify-center'>
            <div className='form-login mb-32'>
            <div>
                <h1>Login bij Cavero</h1>
                <p>Je kunt bij Cavero inloggen met de volgende gegevens.</p>
            </div>
            <form>
                <div className='input-container'>
                <div className='input-group'>
                    <FontAwesomeIcon icon={faEnvelope} color='black' className='field-icon'/>
                    <input type="email" className='field-input' id="email" placeholder="E-mailadres"/>
                </div>
                <div className='ColoredLine'></div>
                </div>
                
                <div className='input-container'>
                <div className='input-group'>
                    <FontAwesomeIcon icon={faLock} color='black' className='field-icon'/>
                    <input type="password" className='field-input' id="password" placeholder="Wachtwoord"/>
                </div>
                <div className='ColoredLine'></div>
                </div>
                <div className='form-extras'>
                <a>Wachtwoord vergeten?</a>
                <button type="button" className='btn-submit' onClick={apiCall}>Login <FontAwesomeIcon icon={faArrowRightLong} color='white'/></button>
                </div>
                
            </form>
            </div>
        </div>
    );
}

export default Login;
