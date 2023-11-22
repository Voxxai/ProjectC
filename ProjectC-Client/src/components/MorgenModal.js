import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserAlt, faUserCircle, faCalendarDays, faClock, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import axios, { all } from 'axios';
import useAuth from '../hooks/useAuth';


function MorgenModal({isOpen, onRequestClose, }) {

  const { auth } = useAuth();

  const Menus = [
    ["Maandag"],
    ["Dinsdag"],
    ["Woensdag"],
    ["Donderdag"],
    ["Vrijdag"],
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      contentLabel="Example Modal"
      className="event-modal p-3 max-w-md mx-auto bg-white rounded shadow-lg border-2 relative outline-none w-1/4"
      overlayClassName="event-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className='flex flex-col gap-y-2'>
        <button className='flex justify-end' onClick={onRequestClose}>
          <FontAwesomeIcon icon={faTimes} className='fa-lg text-gray-400 ml-auto absolute top-1 right-1'/>
        </button>

        <div className='flex flex-row'>
          <span className='text-2xl text-cavero-purple font-semibold'>Week invoeren</span>
        </div>

        <div className='flex flex-col w-full'>
          <div className='w-3/5'>
              {Menus.map((menu, index) => (
                <label className='text-md text-gray-700 font-semibold w-full'>{menu}
                  <select type="text" id='Maandag' name='Maandag' className='font-normal w-full' placeholder='Maandag'>
                    <option>Stille ruimte</option>
                    <option>Werk Ruimte 1</option>
                    <option>Werk Ruimte 2</option>
                    <option>Werk Ruimte 3</option>
                    <option>Thuis</option>
                  </select>
                </label>
                ))}            
          </div>
        </div>
        
      </div>
    </Modal>
  );
}

export default MorgenModal;