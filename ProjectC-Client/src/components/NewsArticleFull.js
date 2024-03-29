import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../hooks/useAuth';
import Modal from './EditArticleModal';

function NewsArticleFull({ id, title, description, onBackClick, creation_time, image }) {
  const { auth } = useAuth();
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const openModal = () => {
    setEditModalOpen(true);
  };
  
  const closeModal = () => {
    setEditModalOpen(false);
  
    // setSubmissionStatus(Date.now());
  };

  return (
    <div className="w-[640px] relative max-md:w-full">
      <div className='flex flex-row justify-between items-center overflow-y-auto'>
        <button
          onClick={onBackClick}
          className="text-cavero-purple py-1 mb-2 md:mb-0 text-xl font-medium"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
          Back
        </button>

        {auth.Level === 3 && (
          <button
            onClick={handleEditClick}
            className="bg-gray-200 rounded-md text-gray-400 text-sm md:text-base hover:bg-gray-300 hover:text-gray-500 border-2 p-1.5 md:p-2 duration-100" // Smaller button
          >
            Bewerken / Verwijderen
          </button>
        )}
      </div>

      {image && (
        <img
          src={process.env.REACT_APP_API_URL + `/images/${image}`}
          alt={title}
          className="bg-zinc-300 h-[250px] object-cover w-full rounded-md"
        />
      )}

      <div className="text-cavero-purple text-3xl font-semibold mt-4" style={{ overflowWrap: 'break-word' }}>
        {title}
      </div>
      <div
        className="text-zinc-500 text-base mt-4"
        style={{ overflowWrap: 'break-word' }}
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onRequestClose={closeModal} id={id} title={title} description={description} />
      )}
      
    </div>
  );
}

export default NewsArticleFull;
