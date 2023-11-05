// import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faCircle, faCircleUser, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import axios, { all } from 'axios';


import React, { useEffect, useState, useRef } from 'react';


function WeekOverzicht() {
    const usersDropdown = useRef(null)
    const [ dates, setDates ] = useState([]);
    const [ open, setOpen ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ events, setEvents ] = useState([]);
    const [ users, setUsers ] = useState([]);

// Onload set dates of this week
useEffect(() => {
    const curr = new Date();
    const week = [];

    const getEvents = async (date) => {
        try {
            const response = await axios.get(`http://localhost:8080/events/${date}`);
            return response.data;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    const getUsers = async (date) => {
        try {
            const response = await axios.get(`http://localhost:8080/users_day/${date}`);
            return response.data;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    const fetchData = async () => {
        const eventPromises = [];
        const userPromises = [];

        for (let i = 1; i <= 5; i++) {
            const first = curr.getDate() - curr.getDay() + i;
            const day = new Date(curr.setDate(first));
            const dateString = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();

            eventPromises.push(getEvents(dateString));
            userPromises.push(getUsers(dateString));
        }

        const eventData = await Promise.all(eventPromises);
        const userData = await Promise.all(userPromises);

        for (let i = 1; i <= 5; i++) {
            const first = curr.getDate() - curr.getDay() + i;
            const day = new Date(curr.setDate(first));

            week.push({
                Date: day,
                Day: day.getDate(),
                Month: getMonthName(day.getMonth()),
                Year: day.getFullYear(),
                Week: getDayName(day.getDay()),
                Events: eventData[i - 1],
                Users: userData[i - 1]
            });
        }

        setEvents(eventData.flat()); // Flattening the array if needed
        setUsers(userData.flat()); // Flattening the array if needed
        setDates(week);
    }

    fetchData();
}, []);




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

    // console.log(dates);

    return (
        <div className="flex flex-row h-full bg-slate-100">
            <div className="flex w-full p-4 gap-x-4">

                {/* Items */}
                {dates.map((Date, index) => (
                    <div className="bg-white rounded-md text-gray-400 w-3/12 p-2 shadow-md">
                        <div className='relative'>
                        <span className='font-medium text-lg'>{Date.Week}</span>
                        <div className="flex flex-row text-black items-end gap-1.5">
                            <span className="text-slate-700 text-3xl font-medium">{Date.Day}</span>
                            <span className='text-slate-700 text-lg font-semibold'>{Date.Month}</span>
                        </div>

                        {/* Users button */}
                        <div className='flex flex-row'>
                            <button ref={usersDropdown} className='bg-cavero-purple text-white w-full p-1 text-left rounded-sm mt-2' onClick={() => setOpen(!open)}>Personen
                            <FontAwesomeIcon icon={ open ? faChevronUp : faChevronDown } className=' float-right mt-1 ml-1 fa-sm'/>
                            </button>
                        </div>
                        
                        {/* Dropdown Items Users */}
                        <div className={`${ open ? "opacity-100" : "opacity-0" }  duration-150 flex flex-col bg-white w-full p-2.5 shadow-md rounded-sm absolute`}>
                            <p className='w-full'>Deze werknemers zijn aanwezig.</p>
                            {dates[index].Users.map((user, index) => (
                                 <div className='flex flex-row bg-cavero-purple-light w-full p-2 rounded-md place-items-center gap-x-2 mb-1'>
                                    <FontAwesomeIcon className='text-cavero-purple fa-2x' icon={faCircleUser}/>
                                    <span className='text-slate-700 text-sm font-semibold'>{user.Voornaam} {user.Achternaam}</span>
                                 </div>
                                 
                            ))}
                                 
                        </div>

                        {/* Events Card */}
                        {dates[index].Events.map((event, index2) => (
                            <div className='flex flex-row bg-cavero-purple-light rounded-md p-2 my-1 font-semibold'>
                                {/* {console.log(event.Titel)} */}
                                    <div className='flex flex-row place-items-center gap-x-2'>
                                        <div className='w-2.5 h-2.5 bg-cavero-purple rounded-full'></div>
                                        <div className='flex flex-col'>
                                            <span className='text-black text-sm font-semibold'>{event.Titel}</span>
                                            <span className='text-black text-xs font-semibold'>{event.Datum}</span>
                                        </div>
                                    </div>
                            </div>
                        ))}
                    </div>
                    </div>
                ))}

            </div>
        </div>
    
    );
}

export default WeekOverzicht;