import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';


function EvenementInfoModal({ isOpen, onRequestClose, event }) {


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => onRequestClose(false)}
            className="event-modal p-3 max-w-md mx-auto w-1/2 h-fit bg-white rounded shadow-lg border-2 relative outline-none"
            overlayClassName="event-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
            <button className='flex justify-end' onClick={onRequestClose}>
                <FontAwesomeIcon icon={faTimes} className='fa-lg text-gray-400 ml-auto absolute top-1 right-1' />
            </button>
            <h1 className="text-3xl text-center text-cavero-purple font-bold mb-4">{event ? event.title : onRequestClose}</h1>

            <div className="flex flex-col items-start text-left text-gray-700 gap-y-2 bg-gray-100 rounded-md p-1 border-1">
                <div className="flex flex-row items-center text-left text-xl w-full gap-x-2 ">
                    <FontAwesomeIcon icon={faCalendar} className='mr-1' />
                    <label className="font-semibold ">Datum:</label>
                    <txt className="text-lg">{new Date(event.date).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' })}</txt>
                </div>

                <div className="flex flex-row items-center text-left text-xl w-full gap-x-2">
                    <FontAwesomeIcon icon={faClock} className='mr-1' />
                    <label className="font-semibold">Tijd:</label>
                    <txt className="text-lg">{event.time.split(':').slice(0, 2).join(':')}</txt>
                </div>

                <div className="flex flex-row items-center text-left text-xl w-full gap-x-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                    <label className="font-semibold ">Locatie:</label>
                    <txt className="text-lg ">{event.location}</txt>
                </div>

                <div className="flex flex-col items-start bg-gray-200 p-1 rounded-sm text-left text-xl w-full gap-x-2">
                    <label className="font-semibold block">Beschrijving:</label>
                    <txt className="text-lg">{event.description}</txt>
                </div>
            </div>
        </Modal>


    )
}

export default EvenementInfoModal