import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function Morgen() {
    const [users, setUsers] = useState([]);

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
        <div className="flex items-center justify-center h-screen bg-slate-100">
            <div className="p-4 w-1/5 text-left overflow-y-auto bg-white rounded ml-auto mr-20 h-5/6">
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
    );
}

export default Morgen;
