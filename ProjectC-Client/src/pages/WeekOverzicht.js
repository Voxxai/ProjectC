// import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  } from '@fortawesome/free-solid-svg-icons'


import React, { useState } from 'react';


function WeekOverzicht() {
    window.onload = function () {
        var month31 = [0, 2, 4, 6, 7, 9, 11];
        var month30 = [3, 5, 8, 10];
        var month28 = [1];
        setInterval(function () {
            var date = new Date();
            var week_of_year = getWeekNumber(date);
            var days_in_week = getDaysInWeek(week_of_year, date.getFullYear());
            var month = getMonthName(date.getMonth());
            var next_month = getMonthName(date.getMonth() + 1);
            
            for (let i = 0 ; days_in_week.length > i ; i++) {
                if (days_in_week[i] > 31 && month31.includes(date.getMonth())) {
                    days_in_week[i] = days_in_week[i] - 31;
                }
                else if (days_in_week[i] > 30 && month30.includes(date.getMonth())) {
                    days_in_week[i] = days_in_week[i] - 30;
                }
                if (days_in_week[i] > 28 && month28.includes(date.getMonth())) {
                    days_in_week[i] = days_in_week[i] - 28;
                }
            }
            document.getElementById("maandag").innerHTML = days_in_week[0];
            document.getElementById("dinsdag").innerHTML = days_in_week[1];
            document.getElementById("woensdag").innerHTML = days_in_week[2];
            document.getElementById("donderdag").innerHTML = days_in_week[3];
            document.getElementById("vrijdag").innerHTML = days_in_week[4];
            document.getElementById("month-ma").innerHTML = month;
            document.getElementById("month-di").innerHTML = month;
            document.getElementById("month-wo").innerHTML = month;
            document.getElementById("month-do").innerHTML = month;
            document.getElementById("month-vr").innerHTML = month;

        }, 1000);
    }

    function getWeekNumber(date) {
        var onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    }

    function getDaysInWeek(week, year) {
        var days = [];
        var date = new Date(year, 0, 1);
        while (date.getDay() !== 1) {
            date.setDate(date.getDate() + 1);
        }
        var weekNum = 1;
        while (weekNum < week) {
            date.setDate(date.getDate() + 7);
            weekNum++;
        }
        for (var i = 0; i < 7; i++) {
            days.push(date.getDate() + i);
        }
        return days;
    }

    function getMonthName(month) {
        var monthNames = ["Jan", "Feb", "Maa", "Apr", "Mei", "Jun",
            "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"
        ];
        return monthNames[month];
    }


    return (
        <div className="flex flex-1 flex-col h-5/6">

            <div className="flex flex-row justify-evenly h-full content-stretch p-3 gap-x-4">
                <div className="bg-white border-cavero-purple border-4 rounded-md text-gray-400 w-3/12 h-full p-2 ">
                    <span>Maandag</span>
                    <br/>
                    <div className="flex flex-row text-black">
                    <h3 id="maandag"></h3>
                    <h6 id="month-ma"></h6>
                    </div>
                </div>
                <div className="bg-white border-cavero-purple border-4 rounded-md text-gray-400 w-3/12 h-full p-2 ">
                    <span>Dinsdag</span>
                    <br/>
                    <div className="flex flex-row text-black">
                    <h3 id="dinsdag"></h3>
                    <h6 id="month-di"></h6>
                    </div>                </div>
                <div className="bg-white border-cavero-purple border-4 rounded-md text-gray-400 w-3/12 h-full p-2 ">
                    <span>Woensdag</span>
                    <br/>
                    <div className="flex flex-row text-black">
                    <h3 id="woensdag"></h3>
                    <h6 id="month-wo"></h6>
                    </div>                </div>
                <div className="bg-white border-cavero-purple border-4 rounded-md text-gray-400 w-3/12 h-full p-2 ">
                    <span>Donderdag</span>
                    <br/>
                    <div className="flex flex-row text-black">
                    <h3 id="donderdag"></h3>
                    <h6 id="month-do"></h6>
                    </div>                </div>
                <div className="bg-white border-cavero-purple border-4 rounded-md text-gray-400 w-3/12 h-full p-2 ">
                    <span>Vrijdag</span>
                    <br/>
                    <div className="flex flex-row text-black">
                    <h3 id="vrijdag"></h3>
                    <h6 id="month-vr"></h6>
                    </div>                
                </div>
              </div>
        </div>
    );
}

export default WeekOverzicht;