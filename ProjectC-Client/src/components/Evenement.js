import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { faMapMarkerAlt, faClock, faPeopleGroup, faHeart as solidHeart, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import EvenementInfoModal from '../components/EvenementInfoModal';
import EvenementModal from '../components/EvenementModal';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';


function Evenement({ id, title, date, time, description, location, level, currentParticipants, setRefreshTrigger, isAdmin, auth, endJoinDate, hasLiked}) {


    const eventData = {
        id: id,
        title: title,
        date: date,
        time: time,
        description: description,
        location: location,
        level: level,
        currentParticipants: currentParticipants,
        endJoinDate: endJoinDate,
        hasLiked: hasLiked,
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [Joined, setJoined] = useState(false);
    const [likes, setLikes] = useState(0);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [modalEventData, setModalEventData] = useState(null);

    const openModalWithEventData = (eventData) => {
        eventData.date = formatDate({ day: '2-digit', month: '2-digit', year: 'numeric' });
        setModalEventData(eventData);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };



    const openModal = () => {
        setIsModalOpen(true);
        setIsEditModalOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeModalAndRefresh = (shouldRefresh) => {
        setRefreshTrigger(prevState => prevState + 1); // Trigger a refresh by updating the state
        closeModal(); // Close the modal
    };

    // Check if the event is level 3
    const isLevel3 = level == 3;

    const eventDate = new Date(date);
    const timeParts = time.split(':').map(part => parseInt(part, 10));
    eventDate.setHours(timeParts[0], timeParts[1], timeParts[2]);

    const isPastEvent = eventDate < new Date();
    const locationInfo = location ? `${location}` : '';

    const formatDate = (options) => eventDate.toLocaleDateString('nl-NL', options);
    const dayOfWeek = formatDate({ weekday: 'short' });
    const formattedDate = formatDate({ day: '2-digit', month: 'short' });
    const startTime = time.split(':').slice(0, 2).join(':');
    getLikes(id);


    async function checkIfJoined(id) {
        await axios.get(process.env.REACT_APP_API_URL + `/checkevent/${id}/${auth.ID}`)
            .then((response) => {
                if (response.data === true) {
                    setJoined(true)
                }
                else {
                    setJoined(false)
                }
            }, (error) => {
                console.log(error);
            });
    }

    async function checkEndJoinDate(id) {
        await axios.get(`http://localhost:8080/eventsregistertime/${id}`)
            .then((response) => {
                if (response.data === true) {
                    setEndJoinDate(true)
                }
                else {
                    setEndJoinDate(false)
                }
            }, (error) => {
                console.log(error);
            });
    }
    async function getLikes(id) {
        try {
            const response = await axios.get(`http://localhost:8080/countLikes/${id}`);
            setLikes(response.data.likes);
        } catch (error) {
            console.error('Error getting likes: ', error);
        }
    }



    return (
        <div className=
            {` cursor-default w-1/1 md:w-1/1 lg:w-1/1 xl:w-1/1 flex flex-row grow flex-nowrap gap-x-2 mx-auto place-content-between p-2.5 m-1 rounded-md text-center scroll-mb-1 scroll-smooth snap-end snap-normal 
            ${(isPastEvent ? 'bg-gray-200 !important' :
                    isLevel3 ? 'bg-gradient-to-r from-[#edc2ff] to-cavero-purple-light' : 'bg-cavero-purple-light')}`}>
            <div className='flex justify-center w-1/12 text-center flex-col'>
                <h2 className="flex w-full leading-5 text-xl max-sm:text-base justify-center text-center text-gray-600 whitespace-pre-line font-medium mb-1">{formattedDate.split(" ").join("\n")}</h2>
            </div>
            <div className="pl-1 w-full whitespace-nowrap truncate flex flex-col items-start">
                <h3 className="text-2xl grow font-semibold mb-1">{title}</h3>
                {isAdmin && !isPastEvent && (
                    <button onClick={() => openModalWithEventData(eventData)}>Edit</button>
                )}
                <div className="text-md w-2/3 text-gray-500 grow gap-x-2 flex truncate flex-row">
                    <div className="w-4/12 text-left truncate overflow-clip">
                        <FontAwesomeIcon icon={faClock} className="mr-1" />{dayOfWeek} - {startTime}
                <h3 className="text-2xl max-sm:text-lg font-semibold mb-1">{title}</h3>
                <div className="text-md w-full text-gray-500 gap-x-2 flex flex-row">
                    <div className="w-2/12 max-sm:w-auto text-left truncate">
                        <FontAwesomeIcon icon={faClock} className="mr-1" /> {dayOfWeek} - {startTime}
                    </div>
                    <div className="text-left truncate">
                        {locationInfo && (
                            <>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                {locationInfo}
                            </>
                        )}
                    </div>
                </div>

            </div>
            <div className="flex whitespace-nowrap text-left flex-row justify-center items-center gap-x-2">
                {!isPastEvent ? (
                    <>
                        <div>{currentParticipants}</div>
                        <FontAwesomeIcon icon={faPeopleGroup} className="mr-1" />
                    </>
                ) : (
                        <>
                            <div className=''>{likes}</div>
                            {hasLiked ?
                                <FontAwesomeIcon
                                        icon={solidHeart}
                                        className={`mr-1 transform transition-transform duration-200 hover:scale-160`}
                                    />
                                 :
                                <FontAwesomeIcon
                                    icon={regularHeart}
                                    className={`mr-1 transform transition-transform duration-200 hover:scale-160`}
                                />
                            }
                        </>
                )}
            </div>
            <div className="flex justify-center w-1/6">
                <button onClick={() => { openModal(); checkIfJoined(eventData.id) }} className="flex justify-center bg-cavero-purple w-full gap-x-1 rounded-md self-center p-1 hover:bg-cavero-purple-dark truncate">
                    <FontAwesomeIcon icon={faInfoCircle} className="fa-xl text-white max-sm:block hidden" />
                    <span className="text-white max-sm:hidden">Meer informatie</span>
                </button>
            </div>
            {eventData.date = formatDate({ day: '2-digit', month: '2-digit', year: 'numeric' })}
            <EvenementInfoModal
                isOpen={isModalOpen}
                onRequestClose={closeModalAndRefresh}
                event={eventData}
                joined={Joined}
                setJoined={setJoined}
                isPastEvent={isPastEvent}
                setRefreshTrigger={setRefreshTrigger}

            />
            <EvenementModal isOpen={isEditModalOpen} onRequestClose={closeEditModal} eventData={modalEventData} />
        </div>

    );
}

export default Evenement;