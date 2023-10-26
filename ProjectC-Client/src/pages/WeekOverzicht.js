// import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  } from '@fortawesome/free-solid-svg-icons'


import React, { useState } from 'react';


function WeekOverzicht() {
    return (
        <div className="flex flex-1 flex-col h-5/6">

            <div className="flex flex-row justify-evenly h-full content-stretch p-3 gap-x-4">
                <div className="bg-white border-cavero-purple border-4 rounded-md text-gray-400 w-3/12 h-full p-2 ">
                    <span>Maandag</span>
                </div>
                <div className="bg-white border-cavero-purple border-4 rounded-md text-gray-400 w-3/12 h-full p-2 ">
                    <span>Dinsdag</span>
                </div>
                <div className="bg-white border-cavero-purple border-4 rounded-md text-gray-400 w-3/12 h-full p-2 ">
                    <span>Woensdag</span>
                </div>
                <div className="bg-white border-cavero-purple border-4 rounded-md text-gray-400 w-3/12 h-full p-2 ">
                    <span>Donderdag</span>
                </div>
                <div className="bg-white border-cavero-purple border-4 rounded-md text-gray-400 w-3/12 h-full p-2 ">
                    <span>Vrijdag</span>
                </div>
              </div>
        </div>
    );
}

export default WeekOverzicht;
