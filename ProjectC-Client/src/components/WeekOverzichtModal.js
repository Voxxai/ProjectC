import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function WeekOverzichtModal({isOpen, onRequestClose, eventData}) {

    return (
      <Modal 
        isOpen={isOpen} 
        onRequestClose={onRequestClose} 
        contentLabel="Example Modal"
        className="event-modal p-3 mx-auto bg-white rounded-md shadow-lg relative"
        overlayClassName="event-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className='flex flex-col'>
          <button className='flex justify-end' onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} className='ml-auto absolute top-1 right-1'/>
          </button>

          <div className='flex flex-row'>
            <span className='text-2xl text-cavero-purple font-semibold'>{eventData.Title}</span>
          </div>
          <div className='flex flex-row'>
            <p className='text-md text-gray-500'>De {eventData.Title} start om {eventData.Time}. Geef hieronder aan of je aanwezig gaat zijn</p>
          </div>
          <div className='flex flex-row gap-x-2 justify-end'>
            <button className='bg-cavero-purple text-white rounded-md p-2 px-3 mt-2'>Deelnemen</button>
            <button className='bg-gray-200 text-gray-500 rounded-md p-2 px-3 mt-2'>Afwijzen</button>
        </div>
        </div>
      </Modal>
    );
}

export default WeekOverzichtModal;