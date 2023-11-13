import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

function NewsArticleFull({ title, description, onBackClick, creation_time }) {

    return (
        <div className="py-8">
            <button onClick={onBackClick} className=" text-cavero-purple py-1 mb-2 text-xl font-medium font-['Poppins']">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                Back
            </button>
          <div className="bg-zinc-300 h-[250px]" />
          <div className="text-cavero-purple text-3xl font-semibold font-['Poppins'] mt-4">
            {title}
          </div>
          <div className="text-zinc-500 text-base mt-4">
            {description}
          </div>
        </div>
      );
}

export default NewsArticleFull;
