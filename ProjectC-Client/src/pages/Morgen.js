import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faCircleUser, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
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
    }, [users]);

    return (
        <div className="flex items-center h-full bg-slate-100 p-4 pt-0 w-full">
            <div className='flex flex-col h-full gap-y-2 w-full'>
                <div className='flex flex-row justify-between w-full'>
                    <span className='flex bg-cavero-purple p-2 text-white rounded-b'>Woensdag 12 September</span>
                    <div className='flex flex-row gap-x-1'>
                        <button className='bg-cavero-purple p-2 text-white rounded-b'>
                            <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button className='flex flex-row gap-x-1 items-center bg-cavero-purple p-2 text-white rounded-b'>
                            <span>Week invoeren</span>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                </div>
                <div className="flex p-2 w-1/5 text-left overflow-y-auto bg-white rounded h-full">
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faUserGroup} className="mr-2" />
                        <span className="text-xl font-semibold font-Poppins">Personen</span>
                    </div>
                    <div className="border-2 border-cavero-purple my-2"></div>
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
    );
}

export default Morgen;
