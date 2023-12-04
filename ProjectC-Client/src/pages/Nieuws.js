import React, { useState, useEffect } from 'react';
import NewsArticle from '../components/NewsArticle';
import NewsArticleFull from '../components/NewsArticleFull';
import CreateArticleModal from '../components/CreateArticleModal';
import Topbar from '../layout/Topbar';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

function Nieuws() {
  const { auth } = useAuth();
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const articlesPerPage = 6;

  const fetchNieuwsData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/news');
      setNews(response.data);
  
      await axios.get(`http://localhost:8080/reset_noticounter/${auth.ID}`);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };
  
  useEffect(() => {
    fetchNieuwsData();
  }, [submissionStatus]);
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  
    setSubmissionStatus(Date.now());
  };

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
    
    const renderPageButton = (pageNumber) => (
      <button
        key={pageNumber}
        onClick={() => handlePageClick(pageNumber)}
        className={`border border-gray-200 px-3 py-1 mx-2 text-gray-500 transition-all duration-100 ease-in-out hover:bg-cavero-purple hover:text-white ${currentPage === pageNumber ? 'bg-cavero-purple text-white' : ''}`}
      >
        {pageNumber}
      </button>
    );
  
    const paginationItems = [];
  
    for (let i = 1; i <= totalPageCount; i++) {
      paginationItems.push(renderPageButton(i));
    }
  
    return paginationItems;
  };

  return (
    <div className='bg-slate-100 h-full'>
      <button
        className="absolute top-15 right-10 bg-cavero-purple text-white px-2 py-1 rounded text-sm hover:shadow-lg transition-shadow"
        onClick={openModal}
      >
        Nieuwsbericht aanmaken
      </button>
      {isModalOpen && <CreateArticleModal onClose={closeModal} />}
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
        <div className='pt-3'>
          <div className="flex-row w-full flex flex-wrap justify-center gap-4 overflow-y-auto">
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

          <div className="flex justify-center">
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Nieuws;
