import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../hooks/useAuth';
import EditArticleModal from './EditArticleModal';

function NewsArticleFull({ id, title, description, onBackClick, creation_time, image }) {
  const { auth } = useAuth();
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  return (
    <div className="max-md:w-full w-1/2 relative">
      <div className='flex flex-row justify-between items-center'>
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

      <div className="text-cavero-purple text-3xl font-semibold mt-4">
        {title}
      </div>
      <div className="text-zinc-500 text-base mt-4">{description}</div>

      {isEditModalOpen && (
        <EditArticleModal
          id={id}
          title={title}
          description={description}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
}

export default NewsArticleFull;
