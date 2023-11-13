import React, { useState, useEffect } from 'react';
import NewsArticle from '../components/NewsArticle';
import NewsArticleFull from '../components/NewsArticleFull';
import Topbar from '../layout/Topbar';
import axios from 'axios';

function Nieuws() {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);
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
    setSelectedArticle(null);
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleBackClick = () => {
    setSelectedArticle(null);
  };

  const renderPagination = () => {
    const totalPageCount = Math.ceil(news.length / articlesPerPage);
    const visiblePageCount = 4;

    const renderPageButton = (pageNumber) => (
      <button
        key={pageNumber}
        onClick={() => handlePageClick(pageNumber)}
        className={`border border-gray-200 px-3 py-1 mx-2 text-gray-500 transition-all duration-100 ease-in-out hover:bg-cavero-purple hover:text-white ${currentPage === pageNumber ? 'bg-cavero-purple text-white' : ''}`}
      >
        {pageNumber}
      </button>
    );

    const renderDots = () => (
      <span className="mx-2">...</span>
    );

    const renderArrow = (direction) => (
      <button
        key={direction}
        onClick={() => handlePageClick(direction === 'left' ? currentPage - 1 : currentPage + 1)}
        className={`border border-gray-200 px-3 py-1 mx-2 text-gray-500 transition-all duration-100 ease-in-out hover:bg-cavero-purple hover:text-white ${currentPage === 1 || currentPage === totalPageCount ? 'hidden' : ''}`}
      >
        {direction === 'left' ? '<' : '>'}
      </button>
    );

    const paginationItems = [];

    for (let i = 1; i <= visiblePageCount; i++) {
      if (i > totalPageCount) break;
      paginationItems.push(renderPageButton(i));
    }

    if (currentPage + Math.floor(visiblePageCount / 2) < totalPageCount) {
      paginationItems.push(renderDots());
    }

    for (let i = Math.max(currentPage + Math.floor(visiblePageCount / 2) + 1, visiblePageCount + 1); i <= totalPageCount; i++) {
      if (i > visiblePageCount && i < totalPageCount) {
        paginationItems.push(renderPageButton(i));
      }
    }

    paginationItems.unshift(renderArrow('left'));
    paginationItems.push(renderArrow('right'));

    return paginationItems;
  };

  return (
    <div className='bg-slate-100 h-full'>
      {selectedArticle ? (
        <div className="flex justify-center mx-auto max-w-1/2">
          <NewsArticleFull
            title={selectedArticle.title}
            description={selectedArticle.description}
            //creation_time={selectedArticle.creation_time}
            onBackClick={handleBackClick}
          />
        </div>
      ) : (
        <div>
          <div className="flex-row p-3 w-full flex flex-wrap justify-center gap-4">
            {currentArticles.map((article) => (
              <div key={article.id} className="cursor-pointer" onClick={() => handleArticleClick(article)}>
                <NewsArticle
                  title={article.title}
                  description={article.description}
                  creation_time={article.creation_time}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Nieuws;
