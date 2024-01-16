import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserAlt, faUserCircle, faCalendarDays, faClock, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import axios, { all } from 'axios';
import useAuth from '../hooks/useAuth';


function WeekOverzichtModal({isOpen, onRequestClose, eventData, eventUsersData, joined, SetJoined, endJoinDate, reloadEventUsers}) {

  const { auth } = useAuth();

  // re-fetching the event users when the joined state changes
  useEffect(() => {
    reloadEventUsers(eventData.ID);
  }, [joined]);

  // joining an event
  function joinEvent() {
    axios.post(process.env.REACT_APP_API_URL + '/joinevent', {
      "EventId": eventData.ID,
      "UserId": auth.ID
    })
    .then((response) => {
      SetJoined(true);
    }, (error) => {
      console.log(error);
    });
  }

  // leaving an event
  async function leaveEvent() {
    await axios.post(process.env.REACT_APP_API_URL + `/leaveevent/${eventData.ID}/${auth.ID}`)
    .then((response) => {
      SetJoined(false);
    }, (error) => {
      console.log(error);
    });
  }

  // rendering the buttons
  function renderButtons() {
    // register time expired when endJoinDate is true or when current time is greater than the endJoinDate -1 day
    if (endJoinDate == true || Date.now() > new Date(eventData.Date).setDate(new Date(eventData.Date).getDate() - 1)) {
      return (
          <button className='bg-gray-200 text-gray-500 rounded-md p-2 px-3' disabled>Inschrijftijd is verlopen</button>
      )
    }
    else {
      if (joined == false){
        return (
          <div className='flex gap-x-2'>
            <button className='bg-cavero-purple text-white rounded-md p-2 px-3' onClick={() => joinEvent()}>Deelnemen</button>
            {/* <button className='bg-gray-200 text-gray-500 rounded-md p-2 px-3' onClick={() => leaveEvent()}>Afwijzen</button> */}
          </div>
        )
      } else {
        return (
            <button className='bg-red-500 text-slate-50 rounded-md p-2 px-3' onClick={() => leaveEvent()}>Verlaten</button>
        )
      }
    }
  }

  // formatting the date
  const DateFormatter = (date) => {
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' });
  }



  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      contentLabel="Example Modal"
      className="event-modal p-3 max-w-md mx- max-sm:w-11/12 bg-white rounded shadow-lg border-2 relative outline-none w-1/4"
      overlayClassName="event-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className='flex flex-col gap-y-2'>
        <button className='flex justify-end' onClick={onRequestClose}>
          <FontAwesomeIcon icon={faTimes} className='fa-lg text-gray-400 ml-auto absolute top-1 right-1'/>
        </button>

        <div className='flex flex-row'>
          <span className='text-2xl text-cavero-purple font-semibold'>{eventData.Title}</span>
        </div>
        <div className='flex flex-row'>
          <p className='text-md text-gray-500'>{eventData.Description}</p>
        </div>
        <div className='flex flex-column gap-y-2.5'>
          <div className='flex flex-row gap-x-3 items-center'>
            <FontAwesomeIcon icon={faCalendarDays } className='text-2xl text-cavero-purple w-5' />
            <span className='text-md text-gray-700 font-semibold'>{DateFormatter(eventData.Date)}</span>
          </div>
          <div className='flex flex-row gap-x-3 items-center '>
            <FontAwesomeIcon icon={faClock } className='text-2xl text-cavero-purple gap-3 w-5' />
            <span className='text-md text-gray-700 font-semibold'>{eventData.Time}</span>
          </div>
          <div className='flex flex-row gap-x-3 items-center '>
            <FontAwesomeIcon icon={faMapMarkerAlt } className='text-2xl text-cavero-purple gap-3 w-5' />
            <span className='text-md text-gray-700 font-semibold'>{eventData.Location}</span>
          </div>
        </div>


        <div className={`flex flex-row py-2 gap-x-2 ${endJoinDate ? "justify-center" : "justify-end" }`}>
          {renderButtons()}
        </div>
        

        <div className='flex flex-col'>
          <div className='flex flex-row gap-x-2 justify-evenly'>  
              <span className='text-md text-cavero-purple font-semibold'>Deelnemers</span>
              <div className='flex-grow border-b bg-white opacity-0'></div>
              <div className='flex flex-row items-center gap-x-1'>
                <FontAwesomeIcon icon={faUserAlt} className='text-cavero-purple'/>
                <span className='text-md text-gray-700 font-semibold'>{eventUsersData.length}</span>
              </div>
          </div>     
          <div className='flex flex-col bg-gray-100 w-full h-40 p-0.5 rounded-md overflow-y-auto gap-y-1'>
            
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