import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import Evenement from '../components/Evenement';
import EventAddModal from '../components/EvenementModal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons';


function Evenementen() {
  const { auth } = useAuth();
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState('Toekomstig');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = auth.Level === 3;
  const today = new Date();
  today.setSeconds(0);
  today.setMilliseconds(0);
  today.toISOString();

  // Fetching all of the events
  useEffect(() => {
    fetchEventsData();
  }, [refreshTrigger, isModalOpen]);


  // Fetching the events on page load and when the refresh trigger changes
  const fetchEventsData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + '/events');
      const eventsWithParticipants = await Promise.all(response.data.map(async (event) => {
        const participantsResponse = await axios.get(process.env.REACT_APP_API_URL + `/event_users/${event.ID}`);
        return {
          ...event,
          participants: participantsResponse.data,
        };
      }));
      setEvents(eventsWithParticipants);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };



  const closeModal = (shouldReload) => {
    setIsModalOpen(false);

    // Resetting the refresh trigger to trigger a re-fetch of the events
    if (shouldReload) {
      setRefreshTrigger(prevState => !prevState);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };


  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Convert date and time to a Date object
  function convertToDateAndTime(dateStr, timeStr) {
    const date = new Date(dateStr);
    const timeParts = timeStr.split(':').map(part => parseInt(part, 10));
    date.setHours(timeParts[0], timeParts[1], timeParts[2]);
    return date;
  }




  return (
    <div className=" pt-4 px-4 w-full h-full max-h-full self-center overflow-y-hidden md:flex md:flex-wrap justify-center items-center text-cavero-purple bg-slate-100">

      <div className="flex flex-col w-5/6 max-sm:w-full max-h-full h-full overflow-y-hidden p-1">

        <div className="w-full h-fit shrink flex-nowrap flex flex-row items-center justify-between border-b-2 border-cavero-purple mb-2">
          <div className='flex flex-row text-center items-end '>
            <div className='relative' ref={dropdownRef}>
              <span className="truncate dropdown inline-block cursor-pointer text-2xl font-medium rounded-t " onClick={(e) => setIsDropdownOpen(!isDropdownOpen)}>{selectedDropdownOption}
                {selectedDropdownOption === "Verlopen" ? <>&emsp;</> : <>&nbsp;</>}
                <FontAwesomeIcon icon={faChevronDown} className={`${isDropdownOpen && "rotate-180"} duration-100`} />
              </span>
              <ul className={`${isDropdownOpen ? 'block' : 'hidden'} absolute right-0 w-full min-w-fit max-w-fit bg-white border rounded-b px-2 text-cavero-purple text-md divide-y divide-gray-200 z-50`}>
                <li className="block p-2 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" onClick={() => { setSelectedDropdownOption('Toekomstig'); setIsDropdownOpen(false); }}>Toekomstig</li>
                <li className="block p-2 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" onClick={() => { setSelectedDropdownOption('Verlopen'); setIsDropdownOpen(false); }}>Verlopen</li>
              </ul>
            </div>
          </div>

          {isAdmin && (
            <button className="flex flex-row items-center bg-cavero-purple text-white text-base font-medium rounded-md px-3 py-1 hover:bg-cavero-purple-dark truncate gap-x-1.5" onClick={openModal}>
              <span className='max-sm:hidden'>Voeg Evenement toe</span>
              <FontAwesomeIcon className='' icon={faPlus} />
            </button>
          )}
          <EventAddModal isOpen={isModalOpen} onRequestClose={closeModal} />
        </div>




        {/* check if amount of events is 0*/}
        {events.length === 0 ? (
          <p className="text-center text-lg">Geen toekomstige of afgelopen events</p>
        ) : (
          // Container for the events with inline scrolling and hidden scrollbar
          <div className="w-full h-full mb-2 rounded-md flex overflow-y-auto snap-y">
            <div className="w-full ">
              {events
                .filter(event => event.Level >= 2)
                .filter(event => {
                  const eventDateTime = convertToDateAndTime(event.Date, event.Time);
                  return selectedDropdownOption === 'Toekomstig' ? eventDateTime >= today : eventDateTime < today;
                })
                .sort((a, b) => {
                  const aDateTime = convertToDateAndTime(a.Date, a.Time);
                  const bDateTime = convertToDateAndTime(b.Date, b.Time);

                  return selectedDropdownOption === 'Toekomstig' ? aDateTime - bDateTime : bDateTime - aDateTime;
                })
                .map((event) => (
                  <Evenement
                    key={event.ID}
                    id={event.ID}
                    title={event.Title}
                    date={event.Date}
                    time={event.Time}
                    description={event.Description}
                    location={event.Location}
                    level={event.Level}
                    currentParticipants={event.participants}
                    endJoinDate={event.EndJoinDate}
                    closeModal={closeModal}
                    setRefreshTrigger={setRefreshTrigger}
                    isAdmin={isAdmin}
                    auth={auth}
                  />
                ))
              }
            </div>
          </div>

        )}

      </div>

    </div>
  );
}

export default Evenementen;