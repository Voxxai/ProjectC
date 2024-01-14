// EventModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/dark.css';

function EvenementModal({ isOpen, onRequestClose, eventData }) {


    function roundToNearestMinutes(date, minutes) {
        const coeff = 1000 * 60 * minutes;
        return new Date(Math.ceil((date.getTime() + 1000) / coeff) * coeff);
    }
    function formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;
    }

    function getRoundedDateTime() {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1); // set the date to the next day
        const roundedDate = roundToNearestMinutes(currentDate, 5);

        // Create a new Date object for the endJoinDate
        const endJoinDate = new Date(roundedDate.getTime());
        endJoinDate.setHours(endJoinDate.getHours() - 2); // Subtract 2 hours

        return {
            date: roundedDate.toISOString().split('T')[0],
            time: roundedDate.toTimeString().split(' ')[0].slice(0, 5),
            endJoinDate: formatDate(endJoinDate),
        };
    }

    const [formData, setFormData] = useState(() => ({
        title: eventData?.Title || '',
        summary: eventData?.Description || '',
        location: eventData?.Location || '',
        level: eventData?.Level || 2,
        ...getRoundedDateTime(),
    }));

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

    const handleDateTimeChange = (date) => {
        const value = date[0];
        value.setSeconds(0); // Set the seconds to 00
        setFormData((prevData) => ({
            ...prevData,
            date: value.toISOString().split('T')[0], // Get the date part
            time: value.toTimeString().split(' ')[0].slice(0, 5), // Get the time part
        }));
    };

    const handleEndJoinDateChange = (date) => {
        const value = date[0];
        value.setSeconds(0); // Set the seconds to 00

        // Format the date as a string in the format 'YYYY-MM-DD HH:MM:00'
        const formattedDate = `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')} ${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}:00`;

        setFormData((prevData) => ({
            ...prevData,
            endJoinDate: formattedDate,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:8080/insert_event', formData);
            console.log('Form data submitted:', formData);
            onRequestClose(true); // Pass true to indicate successful submission

            // Reset the form data
            setFormData({
                title: '',
                summary: '',
                location: '',
                level: 2,
                ...getRoundedDateTime(),
            });
        } catch (error) {
            console.error('Error submitting data: ', error);
            onRequestClose(false); // Pass false to indicate submission error
        }
    };

    useEffect(() => {
        if (!isOpen) {
            // Form has been closed, reset the date and time
            setFormData(prevData => ({
                ...prevData,
                ...getRoundedDateTime(),
            }));
        }
    }, [isOpen]);

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

            <form onSubmit={handleSubmit} >
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
                            Location:
                            <input type="text" placeholder="Locatie evenement" name="location" value={formData.location} onChange={handleChange} required />
                        </label>
                    </div>



                    <label className='block' for="time-input">
                        Datum en tijd:
                        <Flatpickr
                            data-enable-time
                            options={{
                                dateFormat: "d-M-Y H:i",
                                enableTime: true,
                                time_24hr: true,
                                minuteIncrement: 5,
                                minDate: formData.date && formData.time ? new Date(`${formData.date}T${formData.time}`) : roundToNearestMinutes(new Date(), 5),
                            }}
                            value={formData.date && formData.time ? new Date(`${formData.date}T${formData.time}`) : roundToNearestMinutes(new Date(), 5)}
                            onChange={handleDateTimeChange}
                        />
                    </label>

                    <label className='block' for="end-join-date-input">
                        Einddatum voor registratie:
                        <Flatpickr
                            data-enable-time
                            options={{
                                dateFormat: "d-M-Y H:i",
                                enableTime: true,
                                time_24hr: true,
                                minuteIncrement: 5,
                                minDate: formData.endJoinDate ? new Date(formData.endJoinDate) : roundToNearestMinutes(new Date(), 5),
                            }}
                            value={formData.endJoinDate ? new Date(formData.endJoinDate) : roundToNearestMinutes(new Date(), 5)}
                            onChange={handleEndJoinDateChange}
                        />
                    </label>


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