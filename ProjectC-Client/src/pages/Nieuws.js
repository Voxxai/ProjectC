import React, { useState, useEffect } from 'react';
import NewsArticle from '../components/NewsActicle';
import Topbar from '../layout/Topbar';

function Nieuws() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch('/nieuws')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setNews(data))
      .catch((error) => console.error('Error fetching data: ', error));
  }, []);

  return (
    <div>
      <Topbar title="Nieuws" />
      <div className="news-container">
        {news.map((article) => (
          <NewsArticle
            key={article.id}
            title={article.title}
            description={article.description}
            creation_time={article.creation_time}
          />
        ))}
      </div>
    </div>
  );
}

export default Nieuws;
