import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faCircleUser, faPen, faPlus, faCalendarDay, faCalendarDays, faUsers, faList, faListUl, faPenSquare, faPenToSquare, faPeopleRoof, faHouse, faUserCheck, faLaptop, faUsersRectangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Modal from '../components/MorgenModal';

function Morgen() {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [currentDate] = useState(new Date());
    const [tomorrowDate, setTomorrowDate] = useState(new Date(currentDate).setDate(currentDate.getDate() + 1));

    useEffect(() => {
        const tomorrow = new Date(currentDate);
        
        // Correcting the dates for the weekend.
        // If tomorrow is Saturday, add 2 days.
        if (tomorrow.getDay() === 5) {
            setTomorrowDate(new Date(tomorrow).setDate(tomorrow.getDate() + 3));
            tomorrow.setDate(tomorrow.getDate() + 3);
            
        } 
        // If tomorrow is Sunday, add 1 day.
        else if (tomorrow.getDay() === 6) {
            setTomorrowDate(new Date(tomorrow).setDate(tomorrow.getDate() + 2));
            tomorrow.setDate(tomorrow.getDate() + 2);
            
        }
        // If tomorrow is not in the weekend just add 1 day.
        else {
            tomorrow.setDate(tomorrow.getDate() + 1);
        }

        // Formatting the date to match the database format
        const formattedTomorrow = `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}`;

        // Fetching the data from the database
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(process.env.REACT_APP_API_URL + `/users_day/${getDayNameEng(new Date(tomorrow).getDay())}`);
                setUsers(userResponse.data);

                const roomResponse = await axios.get(process.env.REACT_APP_API_URL + `/rooms_status/${getDayNameEng(new Date(tomorrow).getDay())}`);
                setRooms(countWerkRuimteOccurrences(roomResponse.data));

                const eventResponse = await axios.get(process.env.REACT_APP_API_URL + `/events/${formattedTomorrow}`);
                setEvents(eventResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Function to get the month name from a month number
    function getMonthName(month, short = true) {
        var monthNames = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun",
            "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"
        ];
        var monthFullNames = ["Januari", "Febuari", "Maart", "April", "Mei", "Juni",
            "Juli", "Augustus", "September", "Oktober", "November", "December"
        ];
        return short ? monthNames[month] : monthFullNames[month];
    }

    // Function to get the day name from a day number
    function getDayName(day) {
        var dayNames = [ "Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag" ];
        return dayNames[day];
    }

    // Function to get the day name from a day number in English
    function getDayNameEng(day) {
        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return dayNames[day];
    }    

    // Function to count the occurrences of the different werkruimtes
    function countWerkRuimteOccurrences(inputArray) {
        // setting the initial values of the werkruimtes to 0
        const werkRuimteCounts = {
          'Stille Ruimte': 0,
          'Werk Ruimte 1': 0,
          'Werk Ruimte 2': 0,
          'Werk Ruimte 3': 0,
        };
      
        inputArray.forEach((werkRuimte) => {
          if (werkRuimteCounts[werkRuimte] !== undefined) {
            // If the werkruimte is in the object, add 1 to the count
            werkRuimteCounts[werkRuimte]++;
          }
        });
      
        return werkRuimteCounts;
      }
      
    // Opening the week modal
    const openModal = () => {
        setIsModalOpen(true);
      };
    
    const closeModal = (show = false) => {
        setIsModalOpen(false);
        
    };

    // Toggling the notification
    const toggleNotification = () => {
        setShowNotification(!showNotification);
    }

    useEffect(() => {
        // temporary variables to store the timeoutIds
        let timeoutId1;
        let timeoutId2;

        if (showNotification) {
            document.getElementById('showNotification').classList.remove('scale-0');
            document.getElementById('showNotification').classList.add('scale-100');

            timeoutId1 = setTimeout(() => {
                document.getElementById('showNotification').classList.remove('scale-100');
                document.getElementById('showNotification').classList.add('scale-0');
            }, 7000);

            timeoutId2 = setTimeout(() => {
                setShowNotification(false); 
            },7500);
        }

        return () => {
            // Clear the timeouts when the component is unmounted or when switching to a different page
            clearTimeout(timeoutId1);
            clearTimeout(timeoutId2);
        };
        
        // When showNotification changes, run the code inside useEffect
    }, [showNotification]);

    return (
        <div className="flex items-center h-full bg-slate-100 p-4 pt-0 w-full">
            <div id='showNotification' className={`${!showNotification && "hidden"} max-sm:w-11/12 absolute top-2 max-sm:top-20 left-1/2 transform -translate-x-1/2 justify-center transition-all duration-150 ease-in-out`}>
                <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
                    <div class="flex flex-row items-center gap-2">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-teal-500 mr-2 text-2xl" />
                        <div className='flex flex-col'>
                            <span class="font-bold">Wijzigingen zijn opgeslagen!</span>
                            <span class="font-medium text-sm">Uw bijgewerkte weekrooster is succesvol opgeslagen. U wordt nu getoond op de beschikbare dagen.</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col h-full gap-y-2 w-full'>
                <div className='flex flex-row justify-between w-full'>
                    <span className='flex bg-cavero-purple p-1.5 px-2.5 text-white rounded-b font-medium'>{getDayName(new Date(tomorrowDate).getDay())} {new Date(tomorrowDate).getDate()} {getMonthName(new Date(tomorrowDate).getMonth(), false)}</span>
                    <button onClick={openModal} className='flex flex-row gap-x-1.5 items-center bg-cavero-purple p-1.5 px-2.5 text-white rounded-b hover:bg-cavero-hover-purple duration-100 group'>
                        <span className='max-sm:hidden'>Mijn beschikbaarheid</span>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </div>

                <div className='flex flex-row h-full gap-4 max-sm:flex-wrap max-sm:overflow-y-auto'>

                    {/* Ruimtes Card */}
                    <div className="flex flex-col p-2 shadow-md w-2/4 text-left overflow-y-auto bg-white rounded h-full max-sm:w-full max-sm:h-1/2">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faListUl} className="mr-2" />
                            <span className="text-xl font-semibold">Ruimtes</span>
                        </div>
                        <div className="border-2 border-cavero-purple my-2 rounded-full"></div>

                        {rooms.length === 0 ? (
                            <span className='text-gray-500 text-sm'>Geen gevulde ruimtes gevonden voor morgen.</span>
                        ) : (
                            <div className='flex flex-col gap-y-1 overflow-y-auto'>
                                {/* Display the results of countWerkRuimteOccurrences */}
                                {Object.entries(rooms).map(([ruimte, count]) => (
                                    <div key={ruimte} className='flex items-center bg-cavero-purple-light w-full p-2 rounded-md'>
                                        <span className='text-black font-semibold'>{ruimte}</span>
                                    <div className='flex items-center ml-auto'>
                                        <span className='text-black font-semibold mr-2'>{count}</span>
                                        <FontAwesomeIcon className='text-black' icon={faUserGroup} />
                                    </div>
                                </div>
                                                        
                                ))}
                            </div>
                        )}
                    </div>
                    

                    {/* Events Card */}
                    <div className="flex flex-col p-2 shadow-md w-1/4 text-left overflow-y-auto bg-white rounded h-full max-sm:w-full max-sm:h-1/2">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
                            <span className="text-xl font-semibold">Evenementen</span>
                        </div>
                        <div className="border-2 border-cavero-purple my-2 rounded-full"></div>

                        {events.length === 0 ? (
                            <span className='text-gray-500 text-sm'>Geen evenementen gevonden voor morgen.</span>
                        ) : (
                            <div className='overflow-y-auto'>
                                {events.map((event, index) => (
                                    <div key={index} className='flex items-center bg-cavero-purple-light w-full p-2 rounded-md gap-x-2 mb-1'>
                                        <span className='text-black font-semibold'>{event.Title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Personen Card */}
                    <div className="flex flex-col p-2 shadow-md w-1/4 text-left bg-white rounded h-full max-sm:w-full max-sm:h-1/2">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faUsers} className="mr-2" />
                            <span className="text-xl font-semibold">Personen</span>
                        </div>
                        <div className="border-2 border-cavero-purple my-2 rounded-full"></div>

                        {users.length === 0 ? (
                            <span className='text-gray-500 text-sm'>Geen collega's gevonden voor morgen.</span>
                        ) : (
                            <div className='overflow-y-auto'>
                                {users.map((user, index) => (
                                    <div key={index} className='flex items-center bg-cavero-purple-light w-full p-2 rounded-md gap-x-2 mb-1'>
                                        <FontAwesomeIcon className='text-cavero-purple fa-lg' icon={faCircleUser} />
                                        <span className='text-black font-semibold'>{user.FirstName} {user.LastName}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>             
                </div>
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} toggleNotification={toggleNotification} />
        </div>
    );
}

export default Morgen;
