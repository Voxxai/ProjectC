// import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  } from '@fortawesome/free-solid-svg-icons'


import React, { useEffect, useState } from 'react';


function WeekOverzicht() {
    const [ dates, setDates ] = useState([]);

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
                        Week: getDayName(day.getDay())
                    })
        }

        // Set dates into a state
        setDates(week);
    }, [])

    // console.log(dates);

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


    return (
        <div className="flex flex-row h-full bg-slate-100">
            <div className="flex w-full p-4 gap-x-4">

                {/* Items */}
                {dates.map((Date, index) => (
                    <div className="bg-white rounded-md text-gray-400 w-3/12 p-2 shadow-md">
                        <span className='font-medium text-lg'>{dates[index].Week}</span>
                        <div className="flex flex-row text-black items-end gap-1.5">
                            <span className="text-slate-700 text-3xl font-medium">{dates[index].Day}</span>
                            <span className='text-slate-700 text-lg font-semibold'>{dates[index].Month}</span>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default WeekOverzicht;