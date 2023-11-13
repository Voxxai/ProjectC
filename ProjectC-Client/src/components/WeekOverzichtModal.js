import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function WeekOverzichtModal({isOpen, onRequestClose, eventData, eventUsersData }) {

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      contentLabel="Example Modal"
      className="event-modal p-3 max-w-md mx-auto bg-white rounded shadow-lg border-2 relative outline-none"
      overlayClassName="event-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className='flex flex-col gap-y-2'>
        <button className='flex justify-end' onClick={onRequestClose}>
          <FontAwesomeIcon icon={faTimes} className='fa-lg text-gray-400 ml-auto absolute top-1 right-1'/>
        </button>

        <div className='flex flex-row'>
          <span className='text-2xl text-cavero-purple font-semibold'>{eventData.Title}</span>
        </div>
        <div className='flex flex-row'>
          <p className='text-md text-gray-500'>De {eventData.Title} start om {eventData.Time}. Geef hieronder aan of je aanwezig gaat zijn</p>
        </div>
        <div className='flex flex-row gap-x-2 justify-end'>
          <button className='bg-cavero-purple text-white rounded-md p-2 px-3'>Deelnemen</button>
          <button className='bg-gray-200 text-gray-500 rounded-md p-2 px-3'>Afwijzen</button>
        </div>

        <div className='flex flex-col'>
          <span className='text-md text-cavero-purple font-semibold'>Deelnemers</span>        
          <div className='bg-gray-100 w-full h-40 p-0.5 rounded-md'>
            
            {eventUsersData.map((user, index) => (
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
  );
}

export default WeekOverzichtModal;