import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';



function Settings() {
    
    return (
        <div className='flex flex-col gap-y-2 p-4 w-full'>
        <div className='w-full'>
            <span className='font-semibold text-2xl text-cavero-purple'>Instellingen</span>
        </div>

        <div className='flex-col'>
            <span className='font-semibold text-lg'>Thema</span>
            {/* <p className='text-md text-gray-500'>Kies een thema aan die u graag wilt hebben over de applicatie heen.</p>
            <select>
                <option value="light">Licht</option>
                <option value="dark">Donker</option>
            </select> */}
        </div>

        {/* <button className='flex flex-row gap-x-2 items-center justify-center w-full h-10 bg-cavero-purple rounded-md text-white hover:bg-cavero-purple-dark duration-200 scale-95' onClick={sendEmail()}>Klik me</button> */}
            
        </div>
    );
}

export default Settings;