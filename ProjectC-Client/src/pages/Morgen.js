import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faCircleUser, faPen, faPlus, faCalendarDay, faCalendarDays, faUsers, faList, faListUl } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function Morgen() {
    const [ users, setUsers ] = useState([]);

    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formattedTomorrow = `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}`;

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/users_day/${formattedTomorrow}`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex items-center h-full bg-slate-100 p-4 pt-0 w-full">
            <div className='flex flex-col h-full gap-y-2 w-full'>
                <div className='flex flex-row justify-between w-full'>
                    <span className='flex bg-cavero-purple p-1.5 px-2.5 text-white rounded-b font-medium'>Woensdag 12 September</span>
                    <div className='flex flex-row gap-x-1'>
                        <button className='bg-cavero-purple p-1.5 px-2.5 text-white rounded-b hover:bg-cavero-hover-purple duration-100 group'>
                            <FontAwesomeIcon icon={faPen} className='group-hover:scale-110 duration-200' />
                        </button>
                        <button className='flex flex-row gap-x-1 items-center bg-cavero-purple p-1.5 px-2.5 text-white rounded-b hover:bg-cavero-hover-purple duration-100 group'>
                            <span>Week invoeren</span>
                            <FontAwesomeIcon icon={faPlus} className='group-hover:scale-110' />
                        </button>
                    </div>
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
                            {users.map((user, index) => (
                                <div key={index} className='flex items-center bg-cavero-purple-light w-full p-2 rounded-md gap-x-2 mb-1'>
                                    <FontAwesomeIcon className='text-cavero-purple fa-2x' icon={faCircleUser} />
                                    <span className='text-black text-sm font-semibold'>{user.FirstName} {user.LastName}</span>
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
                            {users.map((user, index) => (
                                <div key={index} className='flex items-center bg-cavero-purple-light w-full p-2 rounded-md gap-x-2 mb-1'>
                                    <FontAwesomeIcon className='text-cavero-purple fa-2x' icon={faCircleUser} />
                                    <span className='text-black text-sm font-semibold'>{user.FirstName} {user.LastName}</span>
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
                                    <FontAwesomeIcon className='text-cavero-purple fa-2x' icon={faCircleUser} />
                                    <span className='text-black text-sm font-semibold'>{user.FirstName} {user.LastName}</span>
                                </div>
                            ))}
                        </div>
                    </div>             
                </div>
            </div>
        </div>
    );
}

export default Morgen;
