import React from 'react';

function NewsArticle({ title, description, creation_time, image }) {
  const truncatedDescription =
    description.length > 40 ? `${description.slice(0, 40)}...` : description;

  return (
    <div className="w-[450px] max-sm:w-full h-11/12 mb-2 border border-gray-300 rounded-lg p-2 flex-1 hover:shadow-lg transition-shadow bg-white">
      {image && (
        <img
          src={`http://localhost:8080/images/${image}`}
          alt={title}
          className="bg-zinc-300 h-[182px] object-cover w-full rounded-t-lg"
        />
      )}
      <div className="text-cavero-purple text-2xl font-semibold mt-4 h-16 overflow-hidden">
        {title}
      </div>
      <div className="text-zinc-500 text-sm mt-2 opacity-75">
        {truncatedDescription}
      </div>
    </div>
  );
}

export default NewsArticle;