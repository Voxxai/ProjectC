// EventModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function EvenementModal({ isOpen, onRequestClose, eventData }) {

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        title: eventData?.Title || '',
        summary: eventData?.Description || '',
        location: eventData?.Location || '',
        date: eventData?.Date || null,
        time: eventData?.Time || null,
        level: eventData?.Level || 2,
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckbox = (e) => {
        const { name, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked ? 3 : 2,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.summary || !formData.location || !formData.date || !formData.time) {
            setError(true);
            setErrorMessage("Vul alle velden in");
            return;
        }
        try {
            await axios.post(process.env.REACT_APP_API_URL + '/insert_event', formData);
            console.log('Form data submitted:', formData);
            onRequestClose(true); // Pass true to indicate successful submission
        } catch (error) {
            console.error('Error submitting data: ', error);
            onRequestClose(false); // Pass false to indicate submission error
        }
    };


    return (

        <Modal
            isOpen={isOpen}
            onRequestClose={() => onRequestClose(false)}
            contentLabel="Add Event Modal"
            className="event-modal p-3 max-w-lg mx-auto bg-white rounded shadow-lg border-2 relative outline-none"
            overlayClassName="event-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
            <button className='flex justify-end' onClick={onRequestClose}>
                <FontAwesomeIcon icon={faTimes} className='fa-lg text-gray-400 ml-auto absolute top-1 right-1' />
            </button>
            <h2 className="text-2xl text-gray-700 font-semibold mb-4">{eventData ? 'Edit Event' : 'Voeg evenement toe'}</h2>
            <div className={`bg-red-200 h-13 rounded flex mb-3 ${!error && 'hidden'}`}>
                <p className='text-black my-auto p-2 text-sm'>{errorMessage}</p>
            </div>
            <form onSubmit={handleSubmit} >
                <div className='flex flex-col gap-y-3 w-full'>
                    <div>
                        <label className="block">
                            Titel:
                            <input type="text" placeholder="Naam van het evenement" name="title" value={formData.title} onChange={handleChange} />
                        </label>
                    </div>
                    
                    <div>
                        <label className="flex flex-col">
                            Beschrijving:
                            <textarea name="summary" placeholder='beschrijf het evenement' value={formData.summary} onChange={handleChange} />
                        </label>
                    </div>
                    
                    <div>
                        <label className="flex flex-col">
                            Location:
                            <input type="text" placeholder="Locatie evenement" name="location" value={formData.location} onChange={handleChange} />
                        </label>
                    </div>

                    <div className='flex flex-row gap-x-2'>
                        <label className="block">
                            Datum:
                            <input type="date" name="date" value={formData.Date} onChange={handleChange} placeholder="dd-mm-yyyy" />
                        </label>

                        <label className='block'>
                            Start tijd:
                            <input
                                type="time"
                                name="time"
                                value={formData.Time}
                                onChange={handleChange}
                                step="300" // Set step to 300 seconds (5 minutes)
                                required
                            />
                        </label>
                    </div>

                    <div className='flex'>
                        <label className="flex flex-row gap-x-2 text-gray-500 accent-cavero-purple">
                            <input type="checkbox" name="level" value={formData.level} onChange={handleCheckbox} />
                            Dit is een belangrijke gebeurtenis
                        </label>
                    </div>

                    <div className='flex flex-row-reverse'>
                        <button
                            type="submit"
                            className="bg-cavero-purple text-white rounded-md px-4 py-2 hover:bg-cavero-hover-purple duration-150 hover:scale-105"
                        >Submit</button>
                    </div>
                </div>
                
            </form>
        </Modal>

    );
}

export default EvenementModal;