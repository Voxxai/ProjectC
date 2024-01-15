import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import Evenement from '../components/Evenement';
import EventAddModal from '../components/EvenementModal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';


function Evenementen() {
  const { auth } = useAuth();
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState('Toekomstig');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = auth.Level === 3;
  const today = new Date();
  today.setSeconds(0);
  today.setMilliseconds(0);
  today.toISOString();

  useEffect(() => {
    fetchEventsData();

    // Fetch the events data every 30 seconds
    const intervalId = setInterval(() => {
      if (!isModalOpen) {
        fetchEventsData();
      }
    }, 15000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [refreshTrigger, isModalOpen]);


  const fetchEventsData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/events');
      const eventsWithParticipants = await Promise.all(response.data.map(async (event) => {
        const participants = await amountOfParticipants(event);
        const hasLiked = await checkIfLiked(event.ID);
        return {
          ...event,
          participants: participants,
          hasLiked: hasLiked,
        };
      }));
      setEvents(eventsWithParticipants);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const amountOfParticipants = async (event) => {
    try {

      const response = await axios.get(`http://localhost:8080/event_users/${event.ID}`);
      return response.data.length;
    } catch (error) {
      console.error('Error fetching data: ', error);
      return 0; // Handle the error by returning a default value
    }
  };

  async function checkIfLiked(id) {
    try {
      const response = await axios.get(`http://localhost:8080/checkLike/${id}/${auth.ID}`);
      return response.data;
    } catch (error) {
      console.error('Error checking like status: ', error);
    }
  }

  const closeModal = (shouldReload) => {
    setIsModalOpen(false);


    if (shouldReload) {
      setRefreshTrigger(prevState => !prevState);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };


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

  function convertToDateAndTime(dateStr, timeStr) {
    const date = new Date(dateStr);
    const timeParts = timeStr.split(':').map(part => parseInt(part, 10));
    date.setHours(timeParts[0], timeParts[1], timeParts[2]);
    return date;
  }




  return (
    <div className=" pt-4 px-4 w-full h-full max-h-full self-center overflow-y-hidden md:flex md:flex-wrap justify-center items-center text-cavero-purple bg-slate-100">

      <div className="flex flex-col w-5/6 max-h-full h-full overflow-y-hidden p-1">

        <div className="w-full h-fit shrink flex-nowrap flex flex-row items-center justify-between border-b-2 border-cavero-purple mb-2">
          <div className='flex flex-row text-center items-end '>
            <h2 className=" truncate text-3xl font-semibold m-0 p-0">
              Evenementen
              <txt className="text-sm font-normal text-gray-500">/&nbsp;</txt>
            </h2>
            <div className='relative' ref={dropdownRef}>
              <h4 className="truncate dropdown inline-block cursor-pointer text-sm font-base rounded-t m-0 p-0 " onClick={(e) => setIsDropdownOpen(!isDropdownOpen)}>{selectedDropdownOption}
                {selectedDropdownOption === "Verlopen" ? <>&emsp;</> : <>&nbsp;</>}
                <FontAwesomeIcon icon={faChevronDown} className={`${isDropdownOpen && "rotate-180"} duration-100`} />
              </h4>
              <ul className={`${isDropdownOpen ? 'block' : 'hidden'} absolute w-full min-w-fit max-w-fit bg-white border rounded-b  p-1 text-cavero-purple text-sm divide-y divide-gray-200 z-50`}>
                <li className="block py-2 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" onClick={() => { setSelectedDropdownOption('Toekomstig'); setIsDropdownOpen(false); }}>Toekomstig</li>
                <li className="block py-2 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" onClick={() => { setSelectedDropdownOption('Verlopen'); setIsDropdownOpen(false); }}>Verlopen</li>
              </ul>
            </div>
          </div>

          {isAdmin && (
            <button className="bg-cavero-purple text-white text-base font-semibold rounded-md px-3 py-0.5 hover:bg-cavero-purple-dark truncate" onClick={openModal}>Voeg Evenement toe
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
                      hasLiked={event.hasLiked}
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