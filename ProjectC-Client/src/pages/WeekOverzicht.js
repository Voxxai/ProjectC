// import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faCircle, faCircleUser, faSpinner, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import axios, { all } from 'axios';
import Modal from '../components/WeekOverzichtModal';
import useAuth from '../hooks/useAuth';


import React, { useEffect, useState, useRef } from 'react';


function WeekOverzicht() {
    const usersDropdown = useRef(null);
    const [ dates, setDates ] = useState([]);
    const [ open, setOpen ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ events, setEvents ] = useState([]);
    const [ users, setUsers ] = useState([]);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ eventData, setEventData ] = useState([]);
    const [ eventUsers, setEventUsers ] = useState([]);
    const [ joined, setJoined ] = useState(false);
    const [ endJoinDate, setEndJoinDate ] = useState(false);
    const [ currentDate, setCurrentDate ] = useState(new Date());
    const { auth } = useAuth();

// Onload set dates of this week
useEffect(() => {
    const curr = new Date(currentDate);
    const week = [];

    const getEvents = async (date) => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + `/events/${date}`);
            return response.data;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    // Get users of this date
    const getUsers = async (date) => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + `/users_day/${getDayNameEng(new Date(date).getDay())}`);
            return response.data;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    // Fetching all of the data
    const fetchData = async () => {
        const eventPromises = [];
        const userPromises = [];

        // Looping through the days of the week
        for (let i = 1; i <= 5; i++) {
            const first = curr.getDate() - curr.getDay() + i;
            const day = new Date(curr.setDate(first));
            const dateString = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();

            // Pushing the promises to the lists
            eventPromises.push(getEvents(dateString));
            userPromises.push(getUsers(dateString));
        }

        // Waiting for all promises to resolve
        const eventData = await Promise.all(eventPromises);
        const userData = await Promise.all(userPromises);

        // Looping through the days of the week
        for (let i = 1; i <= 5; i++) {
            const first = curr.getDate() - curr.getDay() + i;
            const day = new Date(curr.setDate(first));

            // Pushing the data to the week array
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

        // Setting every data to the states
        setEvents(eventData.flat()); // Flattening the array if needed
        setUsers(userData.flat()); // Flattening the array if needed
        setDates(week);
        getWeek();
    }

    fetchData();
    // Actived when the currentDate changes
}, [currentDate]);

    // Get the month name
    function getMonthName(month, short = true) {
        var monthNames = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun",
            "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"
        ];
        var monthFullNames = ["Januari", "Febuari", "Maart", "April", "Mei", "Juni",
            "Juli", "Augustus", "September", "Oktober", "November", "December"
        ];
        return short ? monthNames[month] : monthFullNames[month];
    }

    // Get the day name
    function getDayName(day) {
        var dayNames = [ "Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag" ];
        return dayNames[day];
    }

    // Get the day name in english
    function getDayNameEng(day) {
        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return dayNames[day];
    } 

    // Open the dropdown for users
    function openDropdown(index) {
        const dropdownButton = document.getElementById(`dropdownbutton-${index}`);
        const dropdownItems = document.getElementById(`dropdownitems-${index}`);
        const dropdownIcon = document.getElementById(`dropdownicon-${index}`);
        dropdownItems.classList.toggle('opacity-100');
        dropdownItems.classList.toggle('opacity-0');
        dropdownItems.classList.toggle('hidden');
        dropdownIcon.classList.toggle('rotate-180'); 
    }

    const openModal = () => {
        setIsModalOpen(true);
      };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Get the users of the event
    const getEventUsers = async (eventID) => {
        try {
            // Wait for the response to load and set the data to the state
          await axios.get(process.env.REACT_APP_API_URL + `/event_users/${eventID}`)
          .then(response => {
            setEventUsers(response.data);
            return;
            // console.log(response.data);
          });
    
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };

      // Check if the user is joined to the event
      async function checkIfJoined(eventID) {
        await axios.get(process.env.REACT_APP_API_URL + `/checkevent/${eventID}/${auth.ID}`)
        .then((response) => {
          if (response.data === true) {
            setJoined(true)
          }
          else {
            setJoined(false)
          } 
        }, (error) => {
          console.log(error);
        });
      }

      // Check if the event has a end join date
      async function checkEndJoinDate(eventID) {
        await axios.get(process.env.REACT_APP_API_URL + `/eventsregistertime/${eventID}`)
        .then((response) => {
            if (response.data === true) {
                setEndJoinDate(true)
            }
            else {
                setEndJoinDate(false)
            } 
            }, (error) => {
            console.log(error);
            });
        }

    // Get the week number
    const getWeek = () => {
        const curr = new Date(currentDate);
        const start = new Date(curr.getFullYear(), 0, 1);
        const days = Math.floor((curr - start) / (24 * 60 * 60 * 1000));

        return Math.ceil(days / 7);
    };
    
    // Handle the week change
    const handleWeek = (direction) => {
        
        setCurrentDate((prevDate) => {
            // Create a new date of prevoius date
            const newWeek = new Date(prevDate);
            // Set a new date with the previous date + 7 days
            newWeek.setDate(prevDate.getDate() + direction * 7); // direction * 7 to go 7 days forward or backward
            return newWeek;
        });
    };

    return (
        <div className="flex h-full bg-slate-100">
            {dates.length == 0 ? (
                <div className='flex flex-row gap-x-2 w-full items-center justify-center'>
                    <FontAwesomeIcon icon={faSpinner} className='text-cavero-purple fa-2x animate-spin'/>
                    <span className='text-xl text-gray-500'>Loading...</span>
                    </div>
            ) : (
                <div className='w-full h-full'>
            <div className='flex flex-col gap-y-2 p-4 pt-2 h-full w-full'>
                <div className='flex flex-row items-center rounded justify-between' >
                    <div className='flex gap-x-5 max-sm:gap-x-2 '>
                        <span className='text-gray-400 font-medium text-xl max-sm:text-lg '>Week {getWeek()} - {getMonthName(new Date(currentDate).getMonth(), false)} {new Date(currentDate).getFullYear()}</span>
                    </div>
                        <div className='flex flex-row gap-x-1.5 select-none items-center '>
                            <FontAwesomeIcon icon={faChevronLeft} onClick={() => handleWeek(-1)} className='cursor-pointer w-5 h-5 bg-gray-200 rounded-full p-1 text-gray-400 text-lg hover:bg-gray-300 hover:text-gray-500 hover:scale-110 duration-100'/>
                            <button onClick={() => setCurrentDate(new Date())} className='bg-gray-200 rounded-md text-gray-400 text-base hover:bg-gray-300 hover:text-gray-500 border-2 p-1.5 duration-100'>Vandaag</button>
                            <FontAwesomeIcon icon={faChevronRight} onClick={() => handleWeek(1)} className='cursor-pointer w-5 h-5 bg-gray-200 rounded-full p-1 text-gray-400 text-lg hover:bg-gray-300 hover:text-gray-500 hover:scale-110 duration-100'/>
                        </div>             
                    
                </div>
                <div className="flex flex-row h-full gap-x-4 max-md:max-w-[1000px] w-full overflow-x-auto snap-x">
                    
                    {/* Items */}
                    {dates.map((Date, index) => (
                        <div className="flex flex-col bg-white rounded-md text-gray-400 snap-start w-full max-md:min-w-[300px] p-2 shadow-md" key={index}>
                            <div className='relative'>
                                <span className='font-medium text-lg'>{Date.Week}</span>
                            <div className="flex flex-row text-black items-end gap-1.5">
                                <span className="text-slate-700 text-3xl font-medium">{Date.Day}</span>
                                <span className='text-slate-700 text-lg font-semibold'>{Date.Month}</span>
                            </div>

                            {/* Users button */}
                            <div className='flex flex-row'>
                                <button ref={usersDropdown} id={`dropdownbutton-${index}`} className='bg-cavero-purple text-white w-full p-1 text-left rounded-sm mt-2' onClick={() => openDropdown(index) && setOpen(!open)} >Personen    
                                <FontAwesomeIcon id={`dropdownicon-${index}`} icon={ faChevronDown } className={`duration-100 float-right mt-1 ml-1 fa-sm`}/>
                                </button>
                            </div>
                            
                            {/* Dropdown Items Users */}
                            <div id={`dropdownitems-${index}`} className={`${ open ? "opacity-100" : "opacity-0 hidden" }  duration-150 flex flex-col bg-white w-full p-2.5 shadow-md rounded-sm absolute`}>
                                <p className='w-full'>{dates[index].Users.length > 0 ? "Deze medewerkers zijn aanwezig." : "Er zijn vandaag geen medewerkers aanwezig."}</p>
                                {dates[index].Users.map((user, index) => (
                                    <div className='flex flex-row bg-cavero-purple-light w-full p-2 rounded-md place-items-center gap-x-2 mb-1'>
                                        <FontAwesomeIcon className='text-cavero-purple fa-2x' icon={faCircleUser}/>
                                        <span className='text-slate-700 text-sm font-semibold'>{user.FirstName} {user.LastName}</span>
                                    </div>
                                    
                                ))}
                                    
                            </div> 

                            {/* Events Card */}
                            {dates[index].Events.map((event, index2) => (
                                    <div className='flex flex-row bg-cavero-purple-light rounded-md p-2 my-1 font-semibold cursor-pointer' onClick={() => { openModal(); setEventData(event); getEventUsers(event.ID); checkIfJoined(event.ID); checkEndJoinDate(event.ID)}}>
                                        <div className='flex flex-row place-items-center gap-x-2'>
                                            <div className='w-2.5 h-2.5 bg-cavero-purple rounded-full'></div>
                                            <div className='flex flex-col leading-4 py-1'>
                                                <span className='text-black text-md font-semibold'>{event.Title}</span>
                                                <span className='text-gray-500 text-sm font-semibold'>{event.Time}</span>
                                            </div>
                                        </div>
                                    </div>
                            ))}
                        </div>
                        </div>
                    ))}

                </div>
            </div>
            <Modal 
                isOpen={isModalOpen} 
                onRequestClose={closeModal} 
                eventData={eventData} 
                eventUsersData={eventUsers} 
                joined={joined} 
                SetJoined={setJoined} 
                endJoinDate={endJoinDate} 
                reloadEventUsers={getEventUsers}/>
            </div>
            )}
        </div>
    
    );
}

export default WeekOverzicht;