import React, { useState, useEffect } from 'react';
import NewsArticle from '../components/NewsArticle';
import Topbar from '../layout/Topbar';
import axios from 'axios';

function Nieuws() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNieuwsData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/news');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchNieuwsData();
  }, []);

  return (
    <div>
      <Topbar title="Nieuws" />

      <div className="p-5 space-y-5 md:space-y-0 md:flex md:flex-wrap md:justify-between">
        {news.map((article) => (
          <div key={article.id} className="md:w-1/3 md:px-1">
            <NewsArticle
              title={article.title}
              description={article.description}
              creation_time={article.creation_time}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Nieuws;