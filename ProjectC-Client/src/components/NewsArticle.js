import React from 'react';

function NewsArticle({ title, description, creation_time, image }) {
  const formattedDescription = description.replace(/<br\s*\/?>/g, ' ');

  // truncate description if it's too long
  const truncatedDescription =
    formattedDescription.length > 40 ? `${formattedDescription.slice(0, 40)}...` : formattedDescription;

  return (
    <div className="w-[450px] max-sm:w-full h-11/12 mb-2 border border-gray-300 rounded-lg p-2 flex-1 hover:shadow-lg transition-shadow bg-white">
      {image && (
        <img
          src={process.env.REACT_APP_API_URL + `/images/${image}`}
          alt={title}
          className="bg-zinc-300 h-[182px] object-cover w-full rounded-t-lg"
        />
      )}
      <div className="text-cavero-purple text-2xl font-semibold mt-2 h-16 overflow-hidden" style={{ wordWrap: 'break-word' }}>
        {title}
      </div>
      <div className="text-zinc-500 text-sm opacity-75">
        {truncatedDescription}
      </div>
    </div>
  );
}

export default NewsArticle;
