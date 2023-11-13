// EventModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';



function EvenementModal({ isOpen, onRequestClose, eventData }) {

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:8080/insert_event', formData);
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
            className="event-modal p-4 max-w-md mx-auto bg-white rounded shadow-lg border-2 border-cavero-purple"
            overlayClassName="event-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
            <h2 className="text-2xl font-bold mb-4">{eventData ? 'Edit Event' : 'Voeg evenement toe'}</h2>

            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Titel:
                    <input type="text" placeholder="Naam van het evenement" name="title" value={formData.title} onChange={handleChange} />
                </label>

                <label className="block mb-2">
                    Beschrijving:
                </label>
                <textarea name="summary" placeholder='beschrijf het evenement' value={formData.summary} onChange={handleChange} />

                <label className="block mb-2">
                    Location:
                    <input type="text" placeholder="Locatie evenement" name="location" value={formData.location} onChange={handleChange} />
                </label>

                <label className="block mb-2 gap-x-2">
                    Datum:
                    <input type="date" name="date" value={formData.Date} onChange={handleChange} placeholder="dd-mm-yyyy" />
                </label>

                <label className='block mb-2'>
                    Start tijd:
                    <input type="time" name="time" step="300" placeholder='00-00-AM' value={formData.Time} onChange={handleChange} />
                </label>

                <button
                    type="submit"
                    className="bg-cavero-purple text-white rounded-md px-4 py-2 hover:bg-cavero-purple-dark"
                >Submit</button>
            </form>
        </Modal>

    );
}

export default EvenementModal;