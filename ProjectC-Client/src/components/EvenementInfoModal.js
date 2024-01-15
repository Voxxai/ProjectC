import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserAlt, faUserCircle, faCalendarDays, faClock, faMapMarkerAlt, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';


function EvenementInfoModal({ isOpen, onRequestClose, event, joined, setJoined, isPastEvent, setRefreshTrigger, hasLiked, setHasLiked, getLikes, setHearts }) {


    const { auth } = useAuth();
    const closeModalAndRefresh = () => {
        onRequestClose(true); // Close the modal and indicate a refresh
    };

    function joinEvent() {
        axios.post(process.env.REACT_APP_API_URL + '/joinevent', {
            "EventId": event.id,
            "UserId": auth.ID
        })

            .then((response) => {
                setJoined(true);
                setRefreshTrigger(prevState => !prevState);
            }, (error) => {
                console.log(error);
            });
    }

    async function leaveEvent() {
        await axios.post(process.env.REACT_APP_API_URL + `/leaveevent/${event.id}/${auth.ID}`)
            .then((response) => {
                setJoined(false);
                setRefreshTrigger(prevState => !prevState);
            }, (error) => {
                console.log(error);
            });
    }

    async function toggleLikeEvent(eventId) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/like_event/${eventId}/${auth.ID}`);
            setHasLiked(response.data.hasLiked);

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }



    const renderButtons = () => {

        if (isPastEvent) {
            return (
                <div className='flex flex-row gap-x-2 justify-center'>
                    <button className='bg-gray-200 text-gray-500 rounded-md p-2 px-3' disabled>
                        Inschrijftijd is verlopen
                    </button>

                    {joined && (

                        <button className='bg-gray-200 text-white rounded-md p-2 px-3 text hover:bg-gray-300' onClick={() => { toggleLikeEvent(event.id); getLikes(event.id); }}>
                            {setHearts()}
                        </button>
                    )}

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
            <div className='flex flex-col gap-y-2'>
                <button className='flex justify-end' onClick={onRequestClose}>
                    <FontAwesomeIcon icon={faTimes} className='fa-lg text-gray-400 ml-auto absolute top-1 right-1' />
                </button>

                <div className='flex flex-row'>
                    <span className='text-2xl text-cavero-purple font-semibold'>{event.title}</span>
                </div>
                <div className='flex flex-row'>
                    <p className='text-md text-gray-500'>{event.description}</p>
                </div>
                <div className='flex flex-column gap-y-2.5'>
                    <div className='flex flex-row gap-x-3 items-center'>
                        <FontAwesomeIcon icon={faCalendarDays} className='text-2xl text-cavero-purple w-5' />
                        <span className='text-md text-gray-700 font-semibold'>{new Date(event.date).toLocaleDateString('nl-NL')}</span>
                    </div>
                    <div className='flex flex-row gap-x-3 items-center '>
                        <FontAwesomeIcon icon={faClock} className='text-2xl text-cavero-purple gap-3 w-5' />
                        <span className='text-md text-gray-700 font-semibold'>{event.time ? event.time.split(':').slice(0, 2).join(':') : ''}</span>
                    </div>
                    <div className='flex flex-row gap-x-3 items-center '>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className='text-2xl text-cavero-purple gap-3 w-5' />
                        <span className='text-md text-gray-700 font-semibold'>{event.location}</span>
                    </div>
                </div>


                <div className={`flex flex-row py-2 gap-x-2 ${event.endJoinDate ? "justify-center" : "justify-end"}`}>
                    {renderButtons()}
                </div>


                <div className='flex flex-col'>
                    <div className='flex flex-row gap-x-2 justify-evenly'>
                        <span className='text-md text-cavero-purple font-semibold'>Deelnemers</span>
                        <div className='flex-grow border-b bg-white opacity-0'></div>
                        <div className='flex flex-row items-center gap-x-1'>
                            <FontAwesomeIcon icon={faUserAlt} className='text-cavero-purple' />
                            <span className='text-md text-gray-700 font-semibold'>{event.currentParticipants ? event.currentParticipants.length : 0}</span>
                        </div>
                    </div>
                    <div className='flex flex-col bg-gray-100 w-full h-40 p-0.5 rounded-md overflow-y-auto gap-y-1'>
                        {event.currentParticipants.map((user, index) => (
                            <div className='flex flex-row bg-cavero-purple-light rounded-md p-2 font-semibold cursor-pointer' key={index}>
                                <div className='flex flex-row place-items-center gap-x-2'>
                                    <FontAwesomeIcon icon={faUserCircle} className='text-2xl text-cavero-purple' />
                                    <div className='flex flex-col leading-4 py-1'>
                                        <span className='text-black text-md font-semibold'>{user.FirstName} {user.LastName}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </Modal>
    )
}

export default EvenementInfoModal