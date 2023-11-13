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

            await axios.post('http://localhost:8080/insert_event', formData)
                .then((response) => {
                    console.log(response);
                });
            console.log('Form data submitted:', formData);
        } catch (error) {
            console.error('Error submitting data: ', error);
        }
        onRequestClose();
    };


    return (

        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add Event Modal"
            className="event-modal p-4 max-w-md mx-auto bg-white rounded shadow-lg"
            overlayClassName="event-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
            <button
                className="close-button absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={onRequestClose}
            >X</button>
            <h2 className="text-2xl font-bold mb-4">{eventData ? 'Edit Event' : 'Add Event'}</h2>

            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Title:
                    <input type="text" name="title" value={formData.title} onChange={handleChange} />
                </label>
                <label className="block mb-2">
                    Summary:
                    <textarea name="summary" value={formData.summary} onChange={handleChange} />
                </label>
                <label className="block mb-2">
                    Location:
                    <input type="text" name="location" value={formData.location} onChange={handleChange} />
                </label>
                <label className="block mb-2 gap-x-2">
                    Date:
                    <input type="date" name="date" value={formData.Date} onChange={handleChange} placeholder="dd-mm-yyyy" />
                </label>
                <label className='block mb-2'>
                    Time:
                    <input type="time" name="time" value={formData.Time} onChange={handleChange} />
                </label>
                <button
                    type="submit"
                    className="bg-cavero-purple text-white rounded-md px-4 py-2 hover:bg-cavero-purple-dark"
                >
                    Submit
                </button>
            </form>
        </Modal>

    );
}

export default EvenementModal;