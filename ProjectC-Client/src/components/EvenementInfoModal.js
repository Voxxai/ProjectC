import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';


function EvenementInfoModal({ isOpen, onRequestClose, event, joined, setJoined, isPastEvent }) {


    const { auth } = useAuth();
    const closeModalAndRefresh = () => {
        onRequestClose(true); // Close the modal and indicate a refresh
    };

    function joinEvent() {
        axios.post('http://localhost:8080/joinevent', {
            "EventId": event.id,
            "UserId": auth.ID
        })
            .then((response) => {
                setJoined(true);
            }, (error) => {
                console.log(error);
            });
    }

    async function leaveEvent() {
        await axios.post(`http://localhost:8080/leaveevent/${event.id}/${auth.ID}`)
            .then((response) => {
                setJoined(false);
            }, (error) => {
                console.log(error);
            });
    }


    const renderButtons = () => {
        if (isPastEvent) {
            return (
                <div className='flex flex-row gap-x-2 justify-center'>
                    <button className='bg-gray-200 text-gray-500 rounded-md p-2 px-3' disabled>
                        Inschrijftijd is verlopen
                    </button>
                </div>
            );
        } else {
            return (
                <div className='flex flex-row gap-x-2 justify-end'>
                    <button
                        className={`${joined ? 'bg-red-500 text-slate-50' : 'bg-cavero-purple text-white'
                            } rounded-md p-2 px-3`}
                        onClick={() => (joined ? leaveEvent() : joinEvent())}
                    >
                        {joined ? 'Verlaten' : 'Deelnemen'}
                    </button>
                </div>
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => closeModalAndRefresh()}
            className="event-modal p-3 max-w-md mx-auto max-sm:w-11/12 w-1/2 h-fit bg-white rounded shadow-lg border-2 relative outline-none"
            overlayClassName="event-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
            <button className='flex justify-end' onClick={onRequestClose}>
                <FontAwesomeIcon icon={faTimes} className='fa-lg text-gray-400 ml-auto absolute top-1 right-1' />
            </button>
            <h1 className="text-3xl text-cavero-purple font-bold mb-4">{event ? event.title : onRequestClose}</h1>

            <div className="flex flex-col items-start text-left text-gray-700 gap-y-2 bg-gray-100 rounded-md p-1 border-1">
                <div className="flex flex-row items-center text-left text-xl w-full gap-x-2">
                    {renderButtons()}
                </div>

                <div className="flex flex-col items-start bg-gray-200 p-1 rounded-sm text-left text-xl w-full gap-x-2">
                    <label className="font-semibold block">Beschrijving:</label>
                    <txt className="text-lg">{event.description}</txt>
                </div>

                <div className="flex flex-row items-center text-left text-xl w-full gap-x-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                    <label className="font-semibold ">Locatie:</label>
                    <txt className="text-lg ">{event.location}</txt>
                </div>

                <div className="flex flex-row items-center text-left text-xl w-full gap-x-2">
                    <FontAwesomeIcon icon={faClock} className='mr-1' />
                    <label className="font-semibold">Tijd:</label>
                    <txt className="text-lg">{event.time.split(':').slice(0, 2).join(':')}</txt>
                </div>

                <div className="flex flex-row items-center text-left text-xl w-full gap-x-2 ">
                    <FontAwesomeIcon icon={faCalendar} className='mr-1' />
                    <label className="font-semibold ">Datum:</label>
                    <txt className="text-lg">{new Date(event.date).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' })}</txt>
                </div>

            </div>
        </Modal>


    )
}

export default EvenementInfoModal