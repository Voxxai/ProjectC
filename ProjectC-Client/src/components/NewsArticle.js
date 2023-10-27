import React from 'react';

function NewsArticle({ title, description }) {
  return (
    <div className="max-w-[400px] mx-3 mb-4">
      <div className="bg-zinc-300 h-[182px]" />
      <div className="text-fuchsia-800 text-3xl font-semibold mt-4">
        {title}
      </div>
      <div className="text-zinc-500 text-base mt-4">
        {description}
      </div>
    </div>
  );
}

export default NewsArticle;
