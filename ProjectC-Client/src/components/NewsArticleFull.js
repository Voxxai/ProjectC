import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

function NewsArticleFull({ title, description, onBackClick, creation_time }) {

    return (
        <div className="w-[800px] max-sm:w-[325px]">
            <button onClick={onBackClick} className=" text-cavero-purple text-md font-medium">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                Back
            </button>
          <div className="bg-zinc-300 h-[250px]" />
          <div className="text-cavero-purple text-3xl font-semibold mt-4 max-sm:text-2xl">
            {title}
          </div>
          <div className="text-zinc-500 text-base mt-4">
            {description}
          </div>
        </div>
      );
}

export default NewsArticleFull;
