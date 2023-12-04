import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faCircleUser, faPen, faPlus, faCalendarDay, faCalendarDays, faUsers, faList, faListUl, faPenSquare, faPenToSquare, faPeopleRoof, faHouse, faUserCheck, faLaptop, faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Modal from '../components/MorgenModal';

function Morgen() {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDate] = useState(new Date());
    const [tomorrowDate] = useState(new Date(currentDate).setDate(currentDate.getDate() + 1));

    useEffect(() => {
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formattedTomorrow = `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}`;

        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:8080/users_day/${formattedTomorrow}`);
                setUsers(userResponse.data);

                const roomResponse = await axios.get(`http://localhost:8080/rooms_status/${getDayNameEng(new Date(tomorrowDate).getDay())}`);
                setRooms(countWerkRuimteOccurrences(roomResponse.data));

                const eventResponse = await axios.get(`http://localhost:8080/events/${formattedTomorrow}`);
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

    function getDayNameEng(day) {
        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return dayNames[day];
    }    

    function countWerkRuimteOccurrences(inputArray) {
        const werkRuimteCounts = {
          'Werk Ruimte 1': 0,
          'Werk Ruimte 2': 0,
          'Werk Ruimte 3': 0,
        };
      
        inputArray.forEach((werkRuimte) => {
          if (werkRuimteCounts[werkRuimte] !== undefined) {
            werkRuimteCounts[werkRuimte]++;
          }
        });
      
        return werkRuimteCounts;
      }
      

    const openModal = () => {
        setIsModalOpen(true);
      };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex items-center h-full bg-slate-100 p-4 pt-0 w-full">
            <div className='flex flex-col h-full gap-y-2 w-full'>
                <div className='flex flex-row justify-between w-full'>
                    <span className='flex bg-cavero-purple p-1.5 px-2.5 text-white rounded-b font-medium'>{getDayName(new Date(tomorrowDate).getDay())} {new Date(tomorrowDate).getDate()} {getMonthName(new Date(tomorrowDate).getMonth(), false)}</span>
                    <button onClick={openModal} className='flex flex-row gap-x-1.5 items-center bg-cavero-purple p-1.5 px-2.5 text-white rounded-b hover:bg-cavero-hover-purple duration-100 group'>
                        <span>Mijn beschikbaarheid</span>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </div>

                <div className='flex flex-row h-full gap-x-4'>

                    {/* Ruimtes Card */}
                    <div className="flex flex-col p-2 shadow-md w-2/4 text-left overflow-y-auto bg-white rounded h-full">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faListUl} className="mr-2" />
                            <span className="text-xl font-semibold">Ruimtes</span>
                        </div>
                        <div className="border-2 border-cavero-purple my-2 rounded-full"></div>
                        <div>
                            {/* Display the results of countWerkRuimteOccurrences */}
                            {Object.entries(rooms).map(([ruimte, count]) => (
                                <div key={ruimte} className='flex items-center bg-cavero-purple-light w-full p-2 rounded-md gap-x-2 mb-1'>
                                    <span className='text-black text-sm font-semibold'>{ruimte}</span>
                                <div className='flex items-center ml-auto'>
                                    <span className='text-black text-sm font-semibold mr-2'>{count}</span>
                                    <FontAwesomeIcon className='text-black' icon={faUserGroup} />
                                </div>
                            </div>
                                                     
                            ))}
                        </div>
                    </div>

                    {/* Events Card */}
                    <div className="flex flex-col p-2 shadow-md w-1/4 text-left overflow-y-auto bg-white rounded h-full">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
                            <span className="text-xl font-semibold">Evenementen</span>
                        </div>
                        <div className="border-2 border-cavero-purple my-2 rounded-full"></div>
                        <div>
                            {events.map((event, index) => (
                                <div key={index} className='flex items-center bg-cavero-purple-light w-full p-2 rounded-md gap-x-2 mb-1'>
                                    <span className='text-black text-sm font-semibold'>{event.Title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Personen Card */}
                    <div className="flex flex-col p-2 shadow-md w-1/4 text-left overflow-y-auto bg-white rounded h-full">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faUsers} className="mr-2" />
                            <span className="text-xl font-semibold">Personen</span>
                        </div>
                        <div className="border-2 border-cavero-purple my-2 rounded-full"></div>
                        <div>
                            {users.map((user, index) => (
                                <div key={index} className='flex items-center bg-cavero-purple-light w-full p-2 rounded-md gap-x-2 mb-1'>
                                    <FontAwesomeIcon className='text-cavero-purple' icon={faCircleUser} />
                                    <span className='text-black text-sm font-semibold'>{user.FirstName} {user.LastName}</span>
                                </div>
                            ))}
                        </div>
                    </div>             
                </div>
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} />
        </div>
    );
}

export default Morgen;
