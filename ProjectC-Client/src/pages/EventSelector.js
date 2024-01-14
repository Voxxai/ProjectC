import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faCross, faPencil, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';



function EventSelector() {
    
    return (
        <div className='flex flex-col gap-y-2 p-4 w-full'>
        <div className='w-full'>
            <span className='font-semibold text-2xl text-cavero-purple'>Standaard Evenementen Selecteren</span>
        </div>

        <div className='flex flex-col gap-y-4'>
            <div className='flex flex-col'>
                <span className='font-semibold text-lg'>Evenemeneten</span>
                <p className='text-md text-gray-500'>Kies de evenementen die u standaard in een week wilt inplannen.</p>
                <div className='flex flex-row-reverse'>
                    <button className='flex gap-x-1.5 items-center justify-center px-2.5 py-1.5 bg-cavero-purple rounded-md text-white hover:bg-cavero-purple-dark duration-200'>
                        Nieuwe event toevoegen
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
            </div>
           
           <div className='flex'>
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Event Naam
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Dagen
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Bewerken
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Verwijderen
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white border-b  ">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                Lunch
                            </th>
                            <td class="px-6 py-4">
                                Maandag, Dinsdag, Woensdag, Donderdag, Vrijdag
                            </td>
                            <td class="px-6 py-4">
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </td>
                            <td class="px-6 py-4">
                                <FontAwesomeIcon icon={faClose} />
                            </td>
                        </tr>
                    </tbody>
                </table>
           </div>
        </div>

        {/* <button className='flex flex-row gap-x-2 items-center justify-center w-full h-10 bg-cavero-purple rounded-md text-white hover:bg-cavero-purple-dark duration-200 scale-95' onClick={sendEmail()}>Klik me</button> */}
            
        </div>
    );
}

export default EventSelector;