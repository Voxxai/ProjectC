// import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';


import React, { useEffect, useState } from 'react';


function WeekOverzicht() {
    const [ dates, setDates ] = useState([]);
    const [ error, setError ] = useState(false);

    // Onload set dates of this week
    useEffect(() => {
        let curr = new Date
        let week = []

        for (let i = 1; i <= 5; i++) {
            let first = curr.getDate() - curr.getDay() + i 
            let day = new Date(curr.setDate(first));

            // Formatting every date item if needed
            week.push({ Date: day,
                        Day:  day.getDate(),
                        Month:  getMonthName(day.getMonth()),
                        Year:  day.getFullYear(),
                        Week: getDayName(day.getDay()),
                        Events: [getEvents(day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate())]
                    })

        }

        // Set dates into a state
        setDates(week);
    }, [])




    function getMonthName(month) {
        var monthNames = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun",
            "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"
        ];
        return monthNames[month];
    }

    function getDayName(day) {
        var dayNames = [ "Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag" ];
        return dayNames[day];
    }

    const getEvents = async (date) => {
        try {
            const response = await axios.post(`http://localhost:8080/events/${date}`);
            if (response.data.length > 0) {           
                return response.data;
                
            } else {
                return null;
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    console.log(dates);
    return (
        <div className="flex flex-row h-full bg-slate-100">
            <div className="flex w-full p-4 gap-x-4">

                {/* Items */}
                {dates.map((Date, index) => (
                    <div className="bg-white rounded-md text-gray-400 w-3/12 p-2 shadow-md">
                        <span className='font-medium text-lg'>{Date.Week}</span>
                        <div className="flex flex-row text-black items-end gap-1.5">
                            <span className="text-slate-700 text-3xl font-medium">{Date.Day}</span>
                            <span className='text-slate-700 text-lg font-semibold'>{Date.Month}</span>
                        </div>
                        {/* events card */}
                        {dates[index].Events.map((event, index2) => (
                        <div className='flex flex-row bg-cavero-purple-light rounded-md p-2'>
                            {console.log(event.Titel)}
                                <div className='flex flex-row place-items-center gap-x-2'>
                                    <div className='w-2.5 h-2.5 bg-cavero-purple rounded-full'></div>
                                    <div className='flex flex-col'>
                                        <span className='text-black text-sm font-semibold'>{event.Titel}</span>
                                        <span className='text-black text-xs font-semibold'>{event.Location}</span>
                                    </div>
                                </div>
                        </div>
                        ))}
                    </div>
                ))}

            </div>
        </div>
    );
}

export default WeekOverzicht;