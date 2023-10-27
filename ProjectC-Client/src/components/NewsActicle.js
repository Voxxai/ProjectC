import React from 'react';

function NewsArticle({ title, description, creation_time }) {
  return (
    <div className="news-article">
      <h2>{title}</h2>
      <p>{description}</p>
      <p>Creation Time: {creation_time}</p>
    </div>
  );
}

export default NewsArticle;
