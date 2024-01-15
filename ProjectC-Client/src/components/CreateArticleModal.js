import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function CreateArticleModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError('Titel is verplicht');
    } else {
      setTitleError('');
    }

    if (!description.trim()) {
      setDescriptionError('Beschrijving is verplicht');
    } else {
      setDescriptionError('');
    }

    if (!title.trim() || !description.trim()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', photo);

      await axios.post('http://localhost:8080/insert_news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onClose();
    } catch (error) {
      console.error('Error inserting data: ', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1">
      <div className="p-3 max-w-xl mx-auto bg-white rounded shadow-lg border-2 relative outline-none w-11/12">
        <button className='flex justify-end' onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} className='fa-lg text-gray-400 ml-auto absolute top-1 right-1'/>
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-cavero-purple">Nieuwsartikel</h2>
        <div className="mb-6">
          <label className={`w-full text-gray-700`}>Titel:
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError('');
              }}
              className={`w-full p-3 rounded-md ${titleError ? 'border-red-500 bg-red-100' : ''}`}
            />
            {titleError && <p className="text-red-500">{titleError}</p>}
          </label>
        </div>
        <div className="mb-6">
          <label className={`w-full text-gray-700`}>Beschrijving:
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setDescriptionError('');
              }}
              rows="8"
              className={`w-full p-3 rounded-md ${descriptionError ? 'border-red-500 bg-red-100' : ''}`}
            />
            {descriptionError && <p className="text-red-500">{descriptionError}</p>}
          </label>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Upload Foto (Optioneel):</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 p-3 w-full border rounded-md"
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
