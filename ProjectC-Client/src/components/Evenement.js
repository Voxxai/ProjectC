import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

function Evenement({ title, date, time, description, location, level, maxParticipants, currentParticipants }) {

    // Check if the event is level 3
    const isLevel3 = level === 3;

    // Parse the date string into a Date object
    const eventDate = new Date(date);

    // Check if the event date is in the past
    const isPastEvent = eventDate < new Date();

    // Format the day of the week as "vr" (day of the week in Dutch)
    const dayOfWeek = eventDate.toLocaleDateString('nl-NL', { weekday: 'short' });

    // Format the date as "1 Jan" (example)
    const formattedDate = eventDate.toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' });

    // Format the time as "12:30"
    const startTime = time.split(':').slice(0, 2).join(':');

    const locationInfo = location ? `${location}` : '';


    return (
        <div className=
            {`w-1/1 flex flex-row gap-x-2 mx-auto border place-content-between h-auto p-2.5 text-center ${isPastEvent ? 'bg-gray-200 !important' : 'bg-slate-300'}
            ${isLevel3 ? 'bg-cavero-gold/75' : ''}
        `}>
            <div className='flex justify-center w-1/12 text-center flex-col'>
                <h2 className="flex w-full leading-5 text-xl justify-center text-center whitespace-pre-line font-bold mb-1">{formattedDate.split(" ").join("\n")}</h2>
            </div>
            <div className="pl-1 w-full flex flex-col items-start">
                <h3 className="text-2xl font-bold mb-1">{title}</h3>
                <div className="text-sm gap-x-5 flex flex-row">
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
            <div className="flex justify-center h-full text-center w-1/6">
                <button className="w-full h-1/2 justify-center bg-cavero-purple text-white rounded-md">meer info</button>
            </div>
        </div>
    );
}

export default Evenement;