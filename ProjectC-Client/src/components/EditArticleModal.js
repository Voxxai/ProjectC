import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function EditArticleModal({ id, title: initialTitle, description: initialDescription, onClose }) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleEdit = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + `/edit_article/${id}`, {
        title,
        description,
      });
      onClose();
    } catch (error) {
      console.error('Error updating data: ', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + `/delete_article/${id}`);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting data: ', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1">
      <div className="p-3 max-w-xl mx-auto bg-white rounded shadow-lg border-2 relative outline-none w-11/12">
        <button onClick={onClose} className="flex justify-end">
          <FontAwesomeIcon icon={faTimes} className='fa-lg text-gray-400 ml-auto absolute top-1 right-1'/>
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-cavero-purple">Nieuwsartikel bewerken</h2>
        <div className="mb-6">
          <label className="w-full text-gray-700">Titel
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          </label>
        </div>
        <div className="mb-6">
          <label className="w-full text-gray-700">Beschrijving:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="8"
          />
          </label>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleEdit}
            className="bg-cavero-purple text-white px-4 py-2 rounded hover:bg-opacity-80"
          >
            Bewerken
          </button>
          <button
            onClick={handleDelete}
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-opacity-80"
          >
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditArticleModal;
