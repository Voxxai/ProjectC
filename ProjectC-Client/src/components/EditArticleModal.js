import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

function EditArticleModal({ isOpen, onRequestClose, id, title: initialTitle, description: initialDescription }) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleEdit = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + `/edit_article/${id}`, {
        title,
        description,
      });
      onRequestClose();
      window.location.reload();
    } catch (error) {
      console.error('Error updating data: ', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + `/delete_article/${id}`);
      onRequestClose();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting data: ', error);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      contentLabel="Example Modal"
      className="event-modal p-3 max-w-2xl mx- max-sm:w-11/12 bg-white rounded shadow-lg border-2 relative outline-none w-1/4"
      overlayClassName="event-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <button onClick={onRequestClose} className="flex justify-end">
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
      </Modal>
  );
}

export default EditArticleModal;
