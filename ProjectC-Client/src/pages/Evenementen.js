import React, { useState, useEffect } from 'react';
import Evenement from '../components/Evenement';
import EventAddModal from '../components/EvenementModal';
import EventAddModal from '../components/EvenementModal';
import { } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


function Evenementen() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);


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
    <div className=" p-3 w-full h-full self-center space-y-5 md:space-y-0 md:flex md:flex-wrap  justify-center items-center flex-row text-cavero-purple bg-slate-100">
      <h2 className="w-2/3 flex items-center justify-between text-3xl font-semibold border-b-2 border-cavero-purple">
        Toekomstige Evenementen
        {/* Admin button */}
        {isAdmin && (
          <button className="bg-cavero-purple text-white text-base font-semibold rounded-md px-3 py-0.5 hover:bg-cavero-purple-dark" onClick={openModal}>Voeg Evenement toe
          </button>
        )}
      </h2>




      {/* check if amount of events is 0*/}
      {events.length === 0 ? (
        <p className="text-center text-lg">Geen toekomstige of afgelopen events</p>
      ) : (
        // Container for the events with inline scrolling and hidden scrollbar
        <div className="md:w-2/3 md:px-0 flex h-full overflow-y-auto flex-col justify-start items-start p-1.5 text-center  ">
          <div className="w-full overflow-y-auto">
            {events.sort((a, b) => new Date(a.Date) - new Date(b.Date))
              .sort((a, b) => {
                const dateA = new Date(a.Date);
                const dateB = new Date(b.Date);

                if (dateA < new Date()) {
                  return 1; // Move past events to the end
                } else if (dateB < new Date()) {
                  return -1; // Keep future events before past events
                } else {
                  return 0; // Leave the order unchanged for future events
                }
              })
              .filter(event => new Date(event.Date) >= twoWeeksAgo && event.Level >= 2)
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
      <EventAddModal isOpen={isModalOpen} onRequestClose={closeModal} />
      <EventAddModal isOpen={isModalOpen} onRequestClose={closeModal} />

    </div>
  );
}

export default Evenementen;