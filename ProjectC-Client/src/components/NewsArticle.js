import React from 'react';

function NewsArticle({ title, description}) {
  const truncatedDescription = description.length > 100
    ? `${description.slice(0, 100)}...`
    : description;

  return (
    <div className="max-w-[380px] mx-0 mb-2 border border-gray-300 rounded-lg p-2">
      <div className="bg-zinc-300 h-[182px]" />
      <div className="text-cavero-purple text-2xl font-semibold mt-4">
        {title}
      </div>
      <div className="text-zinc-500 text-base mt-2">
        {truncatedDescription}
      </div>
    </div>
  );
}

export default NewsArticle;
