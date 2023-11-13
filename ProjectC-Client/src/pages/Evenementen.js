import React, { useState, useEffect } from 'react';
import Evenement from '../components/Evenement';
import EventModal from '../components/EvenementModal';
import { } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


function Evenementen() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = true;
  const today = new Date();
  const twoWeeksAgo = new Date(today - 1000 * 60 * 60 * 24 * 14);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchEventsData();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mt-8 p-3  self-center space-y-5 md:space-y-0 md:flex md:flex-wrap md:justify-between items-center flex-col text-cavero-purple">
      <h2 className="w-2/3 flex items-center justify-between text-3xl font-bold border-b-2 border-cavero-purple mb-4">
        Toekomstige Evenementen
        {/* Admin button */}
        {isAdmin && (
          <button className="bg-cavero-purple text-white text-base rounded-md px-1.5 py-0.5 hover:bg-cavero-purple-dark" onClick={openModal}>Voeg Evenement toe
          </button>
        )}
      </h2>




      {/* check if amount of events is 0*/}
      {events.length === 0 ? (
        <p className="text-center text-lg">Geen toekomstige of afgelopen events</p>
      ) : (
        // Container for the events with inline scrolling and hidden scrollbar
        <div className="md:w-2/3 md:px-0 flex h-full flex-col justify-start items-start p-1.5 text-center  ">
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
      <EventModal isOpen={isModalOpen} onRequestClose={closeModal} />

    </div>
  );
}

export default Evenementen;