import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../hooks/useAuth';
import EditArticleModal from './EditArticleModal';

function NewsArticleFull({ id, title, description, onBackClick, creation_time }) {
  const { auth } = useAuth();
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  return (
    <div className="py-8 w-1/2 relative">
      <button
        onClick={onBackClick}
        className="text-cavero-purple py-1 mb-2 text-xl font-medium font-['Poppins']"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
        Back
      </button>

      {auth.Level === 3 && (
        <button
          onClick={handleEditClick}
          className="bg-cavero-purple text-white py-1 px-4 text-xl font-medium font-['Poppins'] absolute top-0 right-0"
          style={{
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
          }}
        >
          Bewerken
        </button>
      )}

      <div className="bg-zinc-300 h-[250px]" />
      <div className="text-cavero-purple text-3xl font-semibold font-['Poppins'] mt-4">
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
