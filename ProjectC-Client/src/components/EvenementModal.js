// EventModal.js
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function EvenementModal({ isOpen, onRequestClose, eventData }) {


    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        location: '',
        level: 2,
        date: '',
        time: '',
        endJoinDate: '',
    });


    useEffect(() => {
        if (!isOpen) {
            // Form has been closed, reset the date and time
            setFormData(prevData => ({
                ...prevData,
            }));
        }
    }, [isOpen]);



    useEffect(() => {
        setFormData({
            title: eventData?.title || '',
            summary: eventData?.description || '',
            location: eventData?.location || '',
            level: eventData?.level || 2,
            date: eventData?.date || '',
            time: eventData?.time || '',
            endJoinDate: eventData?.endJoinDate || null,
        });
    }, [eventData]);

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

    const handleDateTimeChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            datetime: e.target.value,
        }));
    };

    const handleEndJoinDateChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            endJoinDate: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();



        try {
            if (formData.datetime) {
                const [date, time] = formData.datetime.split('T');
                formData.date = date
                formData.time = time
            }

            if (formData.endJoinDate) {
                console.log('formData.endJoinDate:', formData.endJoinDate);
                formData.endJoinDate = formData.endJoinDate.replace('T', ' ');
                console.log('formData.endJoinDate:', formData.endJoinDate);

                if (formData.endJoinDate.split(' ')[1] === '00:00') {
                    console.log(formData.endJoinDate.split(' ')[0].split('-')[2]);
                }
            }
            debugger;
            if (eventData) {

                await axios.post(`http://localhost:8080/edit_event/${eventData.id}`, formData);
            } else {
                // If eventData does not exist, make a POST request to the insert_event endpoint
                await axios.post('http://localhost:8080/insert_event', formData);
            } console.log('Form data submitted:', formData);
            onRequestClose(true); // Pass true to indicate successful submission

            // Reset the form data
            setFormData({
                title: '',
                summary: '',
                location: '',
                level: 2,
                date: '',
                time: '',
                endJoinDate: '',
            });
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

            <div className='flex flex-col gap-y-3 w-full'>
                <div>
                    <label className="block">
                        Titel:
                        <input type="text" placeholder="Naam van het evenement" name="title" value={formData.title} onChange={handleChange} required />
                    </label>
                </div>

                <div>
                    <label className="flex flex-col">
                        Beschrijving:
                        <textarea name="summary" placeholder='beschrijf het evenement' value={formData.summary} onChange={handleChange} required />
                    </label>
                </div>

                <div>
                    <label className="flex flex-col">
                        Locatie:
                        <input type="text" placeholder="Locatie evenement" name="location" value={formData.location} onChange={handleChange} required />
                    </label>
                </div>

                <label className='block' htmlFor="time-input">
                    Datum en tijd:
                    <input
                        type='datetime-local'
                        id="time-input"
                        value={eventData ? (formData?.datetime ? formData.datetime : new Date(formData.date).toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(' ', 'T')) : (formData.datetime)}
                        onChange={handleDateTimeChange}
                    />
                </label>

                <label className='block' htmlFor="end-join-date-input">
                    Einddatum voor registratie: {formData.endJoinDate ? `${formData.endJoinDate.toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(' ', 'T')}` : ''}
                    <input
                        type='datetime-local'
                        id="end-join-date-input"
                        value={eventData ? (formData?.endJoinDate ? new Date(formData.endJoinDate).toISOString().slice(0, 16) : '') : ''}
                        onChange={handleEndJoinDateChange}
                    />
                </label>


                <div className='flex'>
                    <label className="flex flex-row gap-x-2 text-gray-500 accent-cavero-purple">
                        <input type="checkbox" name="level" value={formData.level} onChange={handleCheckbox} checked={formData.level === 3} />
                        Is dit een belangrijke gebeurtenis?
                    </label>
                </div>

                <div className='flex flex-row-reverse'>
                    <button
                        type="submit"
                        className="bg-cavero-purple text-white rounded-md px-4 py-2 hover:bg-cavero-hover-purple duration-150 hover:scale-105"
                        onClick={handleSubmit}
                    >{eventData ? 'Edit' : 'Submit'}</button>
                </div>
            </div>
        </Modal>

    );
}

export default EvenementModal;