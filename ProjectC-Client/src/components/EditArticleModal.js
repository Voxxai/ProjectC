import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function EditArticleModal({ id, title: initialTitle, description: initialDescription, onClose }) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleEdit = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/edit_article/${id}`, {
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
      const response = await axios.post(`http://localhost:8080/delete_article/${id}`);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting data: ', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-cavero-purple cursor-pointer"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-cavero-purple">Nieuwsartikel bewerken</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-black">Titel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-3 w-full border rounded-md"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-black">Beschrijving:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-3 w-full border rounded-md resize-none"
            rows="8"
          />
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
