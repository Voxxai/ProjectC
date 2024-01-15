import React, { useState, useEffect } from 'react';
import NewsArticle from '../components/NewsArticle';
import NewsArticleFull from '../components/NewsArticleFull';
import CreateArticleModal from '../components/CreateArticleModal';
import Topbar from '../layout/Topbar';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/CreateArticleModal';


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
      const response = await axios.get(process.env.REACT_APP_API_URL + '/news');
      setNews(response.data);
  
      await axios.get(process.env.REACT_APP_API_URL + `/reset_noticounter/${auth.ID}`);
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
        className={`border border-gray-200 px-3 py-1 mx-2 rounded-sm text-gray-500 transition-all duration-100 ease-in-out hover:bg-cavero-purple hover:text-white ${currentPage === pageNumber ? 'bg-cavero-purple text-white' : ''}`}
      >
        {pageNumber}
      </button>
    );
  
    const paginationItems = [];
  
    for (let i = 1; i <= totalPageCount; i++) {
      paginationItems.push(renderPageButton(i));
    }
  
    return (
      <div className="flex overflow-x-auto">
        {paginationItems}
      </div>
    );
  };  

  return (
    <div className="w-full h-full max-h-full px-4 self-center overflow-y-hidden md:flex md:flex-wrap justify-center text-cavero-purple bg-slate-100">
      <div className="flex flex-col w-full max-h-full h-full overflow-y-hidden gap-2">
        <div className="w-full flex flex-row-reverse items-center justify-between">
          {(auth.Level === 2 || auth.Level === 3) && (
            <button className="flex flex-row gap-x-1.5 items-center bg-cavero-purple p-1.5 px-2.5 text-white rounded-b hover:bg-cavero-hover-purple duration-100" onClick={openModal}>
              <span>Nieuwsbericht aanmaken</span>
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
        </div>

        <div className="w-full h-full mb-2 rounded-md flex overflow-y-auto">
          {isModalOpen && <CreateArticleModal onClose={closeModal} />}
          {selectedArticle ? (
            <div className="flex justify-center mx-auto max-w-1/2 max-md:w-full mt-4">
              {/* Single Article */}
              <NewsArticleFull
                id={selectedArticle.id}
                title={selectedArticle.title}
                description={selectedArticle.description}
                image={selectedArticle.image}
                onBackClick={handleBackClick}
              />
            </div>
          ) : (
            <div className='flex flex-col w-full h-full mt-2'>
                <div className="flex-row w-full flex flex-wrap justify-center gap-3">
                  {currentArticles.map((article) => (
                    <div key={article.id} className="cursor-pointer max-sm:w-full mb-4" onClick={() => handleArticleClick(article)}>
                      <NewsArticle
                        title={article.title}
                        description={article.description}
                        creation_time={article.creation_time}
                        image={article.image}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-3">
                  {renderPagination()}
                </div>
              </div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} />
    </div>
  );
}

export default Nieuws;
