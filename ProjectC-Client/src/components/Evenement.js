import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { faMapMarkerAlt, faClock, faPeopleGroup, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import EvenementInfoModal from '../components/EvenementInfoModal';
import EvenementModal from '../components/EvenementModal';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';


function Evenement({ id, title, date, time, description, location, level, maxParticipants, currentParticipants, setRefreshTrigger, isAdmin, auth }) {


    const eventData = {
        id: id,
        title: title,
        date: date,
        time: time,
        description: description,
        location: location,
        level: level,
        maxParticipants: maxParticipants,
        currentParticipants: currentParticipants,
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [Joined, setJoined] = useState(false);
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [endJoinDate, setEndJoinDate] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [modalEventData, setModalEventData] = useState(null);

    const openModalWithEventData = (eventData) => {
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

    useEffect(() => {
        checkIfLiked(id);
    }, [id, auth.ID]);

    async function checkIfJoined(id) {
        try {
            const response = await axios.get(`http://localhost:8080/checkevent/${id}/${auth.ID}`);
            setJoined(response.data);
        } catch (error) {
            console.error('Error checking join status: ', error);
        }
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

    const toggleLike = async () => {
        try {
            await axios.post(`http://localhost:8080/toggleLike/${id}/${auth.ID}`);
            // After toggling the like status, update the hasLiked and likes states
            setHasLiked(!hasLiked);
            getLikes(id);
        } catch (error) {
            console.error('Error toggling like status: ', error);
        }
    };

    async function checkIfLiked(id) {
        try {
            const response = await axios.get(`http://localhost:8080/checkLike/${id}/${auth.ID}`);
            setHasLiked(response.data.hasLiked);
            // Call the getLikes function to update the likes state
            getLikes(id);
        } catch (error) {
            console.error('Error checking like status: ', error);
        }
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
                <h2 className="flex w-full leading-5 text-xl justify-center text-center text-gray-600 whitespace-pre-line font-medium mb-1">{formattedDate.split(" ").join("\n")}</h2>
            </div>
            <div className="pl-1 w-full whitespace-nowrap truncate flex flex-col items-start">
                <h3 className="text-2xl grow font-semibold mb-1">{title}</h3>
                {isAdmin && !isPastEvent && (
                    <button onClick={() => openModalWithEventData(eventData)}>Edit</button>
                )}
                <div className="text-md w-2/3 text-gray-500 grow gap-x-2 flex truncate flex-row">
                    <div className="w-3/12 text-left truncate overflow-clip">
                        <FontAwesomeIcon icon={faClock} className="mr-1" /> {dayOfWeek} - {startTime}
                    </div>
                    <div className="text-left truncate overflow-clip">
                        {locationInfo && (
                            <>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                {locationInfo}
                            </>
                        )}
                    </div>
                </div>

            </div>
            <div className="flex group whitespace-nowrap text-left flex-row justify-center items-center gap-x-2">
                {!isPastEvent ? (
                    <>
                        <div>{currentParticipants}</div>
                        <FontAwesomeIcon icon={faPeopleGroup} className="mr-1" />
                    </>
                ) : (
                    <>
                        <div className=''>{likes}</div>
                        <FontAwesomeIcon
                            icon={hasLiked ? solidHeart : regularHeart}
                            className="mr-1 group-hover:scale-120 transition-transform duration-200 ${Joined ? 'cursor-pointer' : 'cursor-default'}"
                            onClick={() => {
                                if (Joined) { toggleLike(); }
                            }}
                        />
                    </>
                )}
            </div>
            <div className="flex justify-center w-1/6">
                <button onClick={() => { openModal(); checkIfJoined(eventData.id); checkEndJoinDate(eventData.id) }} className="bg-cavero-purple w-4/5 text-white text-base rounded-md self-center p-1 hover:bg-cavero-purple-dark truncate">meer info</button>
            </div>
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