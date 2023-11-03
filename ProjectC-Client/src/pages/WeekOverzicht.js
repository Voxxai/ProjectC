// import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import axios, { all } from 'axios';


import React, { useEffect, useState } from 'react';


function WeekOverzicht() {
    const [ dates, setDates ] = useState([]);
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
                        <span className='font-medium text-lg'>{Date.Week}</span>
                        <div className="flex flex-row text-black items-end gap-1.5">
                            <span className="text-slate-700 text-3xl font-medium">{Date.Day}</span>
                            <span className='text-slate-700 text-lg font-semibold'>{Date.Month}</span>
                        </div>

                        {/* Items Users */}
                        <div className='flex flex-row'>
                            {dates[index].Users.map((user, index) => (
                                 <div className='flex flex-col'>
                                    <span className='text-slate-700 text-sm font-semibold'>{user.Account_ID}</span>
                                     <span className='text-slate-700 text-sm font-semibold'>{user.Date}</span>
                                 </div>
                            ))}

                        </div>

                        {/* events card */}
                        {dates[index].Events.map((event, index2) => (
                            <div className='flex flex-row bg-cavero-purple-light rounded-md p-2 my-1'>
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
                ))}

            </div>
        </div>
    );
}

export default WeekOverzicht;