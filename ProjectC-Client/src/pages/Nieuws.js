import React, { useState, useEffect } from 'react';
import NewsArticle from '../components/NewsArticle';
import Topbar from '../layout/Topbar';
import axios from 'axios';

function Nieuws() {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

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

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(news.length / articlesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Topbar title="Nieuws" />

      <div className="p-3 space-y-5 md:space-y-0 md:flex md:flex-wrap md:justify-between">
        {currentArticles.map((article) => (
          <div key={article.id} className="md:w-1/3 md:px-0">
            <NewsArticle
              title={article.title}
              description={article.description}
              creation_time={article.creation_time}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageClick(number)}
            className={`px-3 py-1 mx-2 ${currentPage === number ? 'bg-cavero-purple text-white' : 'bg-gray-200'
              }`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Nieuws;
