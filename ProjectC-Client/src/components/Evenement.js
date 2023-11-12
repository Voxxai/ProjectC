import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

function Evenement({ title, date, description, location, maxParticipants, currentParticipants }) {
    const eventDate = new Date(date);

    // Check if the event date is in the past
    const isPastEvent = eventDate < new Date();

    // Format the day of the week as "vr" (day of the week in Dutch)
    const dayOfWeek = eventDate.toLocaleDateString('nl-NL', { weekday: 'short' });

    // Format the date as "1 Jan" (example)
    const formattedDate = eventDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });

    // Format the time as "12:30"
    const startTime = eventDate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

    const locationInfo = location ? `${location}` : '';


    return (
        <div className={`w-1/1 flex flex-row mx-auto border place-content-between p-3 text-center ${isPastEvent ? 'bg-gray-200 !important' : 'bg-slate-300'}`}>
            <div className='flex flex-col'>
                <h2 className="flex text-xl justify-center font-bold mb-1">{formattedDate}</h2>

            </div>
            <div className="w-full flex flex-col items-start mb-2">
                <h3 className="text-2xl font-bold mb-1">{title}</h3>
                <div className="text-sm mb-1 gap-x-5 flex flex-row">
                    <div>
                        {dayOfWeek} - {startTime}
                    </div>
                    <div>
                        {locationInfo && (
                            <>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                {locationInfo}
                            </>
                        )}
                    </div>
                </div>

            </div>
            <div className="flex justify-end w-full">
                <button className="bg-cavero-purple text-white rounded-md">meer info</button>
            </div>
        </div>
    );
}

export default Evenement;