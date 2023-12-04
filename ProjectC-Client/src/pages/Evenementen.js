import React, { useState, useEffect } from 'react';
import Evenement from '../components/Evenement';
import EventAddModal from '../components/EvenementModal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';


function Evenementen() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState('Toekomstig');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const isAdmin = true;
  const today = new Date();
  const twoWeeksAgo = new Date(today - 1000 * 60 * 60 * 24 * 14);

  const fetchEventsData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, [submissionStatus]);

  const closeModal = (shouldReload) => {
    setIsModalOpen(false);


    if (shouldReload) {
      setSubmissionStatus(Date.now());
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };




  return (
    <div className=" pt-4 px-4 w-full h-full max-h-full self-center overflow-y-hidden md:flex md:flex-wrap justify-center items-center text-cavero-purple bg-slate-100">

      <div className="flex flex-col w-5/6 max-h-full h-full overflow-y-hidden p-1">

        <div className="w-full h-fit flex flex-row items-center justify-between border-b-2 border-cavero-purple mb-2">
          <div className='flex flex-row text-center items-end'>
            <h2 className="text-3xl font-semibold m-0 p-0">
              Evenementen
              <txt className="text-sm font-normal text-gray-500">/&nbsp;</txt>
            </h2>
            <div className='relative'>
              <h4 className="dropdown inline-block cursor-pointer text-sm font-base rounded-t m-0 p-0 " onClick={(e) => setIsDropdownOpen(!isDropdownOpen)}>{selectedDropdownOption}
                {selectedDropdownOption === "Verlopen" ? <>&emsp;</> : <>&nbsp;</>}
                <FontAwesomeIcon icon={faChevronDown} className={`${isDropdownOpen && "rotate-180"} duration-100`} />
              </h4>
              <ul className={`absolute ${isDropdownOpen ? 'block' : 'hidden'} w-full min-w-fit bg-white border rounded-b shadow-md p-1 text-cavero-purple text-sm divide-y divide-gray-200`}>
                <li className="block py-2 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" onClick={() => setSelectedDropdownOption('Toekomstig')}>Toekomstig</li>
                <li className="block py-2 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" onClick={() => setSelectedDropdownOption('Verlopen')}>Verlopen</li>
              </ul>
            </div>
          </div>

          {isAdmin && (
            <button className="bg-cavero-purple text-white text-base font-semibold rounded-md px-3 py-0.5 hover:bg-cavero-purple-dark" onClick={openModal}>Voeg Evenement toe
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
              {events.sort((a, b) => new Date(a.Date) - new Date(b.Date))
                .filter(event => {
                  if (selectedDropdownOption === 'Toekomstig') {
                    return new Date(event.Date) >= today;
                  } else {
                    return new Date(event.Date) < today;
                  }
                })
                .map((event) => (
                  <Evenement
                    title={event.Title}
                    date={event.Date}
                    time={event.Time}
                    description={event.Description}
                    location={event.Location}
                    level={event.Level}
                  />
                ))}
            </div>
          </div>

        )}

      </div>

    </div>
  );
}

export default Evenementen;