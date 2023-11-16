import React, { useState } from 'react';
import axios from 'axios';

function CreateArticleModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8080/insert_news', {
        title,
        description,
      });
      onClose();
    } catch (error) {
      console.error('Error inserting data: ', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-cavero-purple">Nieuwsartikel</h2>
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
          <label className="block text-sm font-medium text-black">Descriptie:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-3 w-full border rounded-md resize-none"
            rows="8" // Increase the number of rows
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-cavero-purple text-white px-4 py-2 rounded hover:bg-opacity-80"
          >
            Aanmaken
          </button>
          <button
            onClick={onClose}
            className="ml-2 text-cavero-purple hover:underline"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateArticleModal;