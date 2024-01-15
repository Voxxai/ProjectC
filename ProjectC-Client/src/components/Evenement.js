import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { faMapMarkerAlt, faClock, faPeopleGroup, faHeart as solidHeart, faTrash, faPencil, faPenAlt, faPencilSquare, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import EvenementInfoModal from '../components/EvenementInfoModal';
import EvenementModal from '../components/EvenementModal';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';


function Evenement({ id, title, date, time, description, location, level, currentParticipants, setRefreshTrigger, isAdmin, auth, endJoinDate, }) {


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
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [Joined, setJoined] = useState(false);
    const [likes, setLikes] = useState(0);
    const [HasLiked, setHasLiked] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [modalEventData, setModalEventData] = useState(null);

    const openModalWithEventData = (eventData) => {
        eventData.date = formatDate({ day: '2-digit', month: '2-digit', year: 'numeric' });
        const toUs = eventData.date.split('-');
        toUs.reverse();
        let joinedString = toUs.join('-');

        eventData.date = new Date(`${joinedString}T${eventData.time}`);
        setModalEventData(eventData);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setRefreshTrigger(prevState => prevState + 1);
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
        getLikes(id);
    }, []);


    async function checkIfJoined(id) {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + `/checkevent/${id}/${auth.ID}`);
            setJoined(response.data);
        } catch (error) {
            console.error('Error checking join status: ', error);
        }
    }

    async function getLikes(id) {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + `/countLikes/${id}`);
            setLikes(response.data.likes);

            const hasLikedResponse = await axios.get(process.env.REACT_APP_API_URL + `/checkLike/${id}/${auth.ID}`);
            setHasLiked(hasLikedResponse.data.hasLiked);
        } catch (error) {
            console.error('Error getting likes: ', error);
        }
    }

    const GetAllEmailsOfEvent = async (id) => {
        let newList = [];
        try {
            await axios.get(process.env.REACT_APP_API_URL + `/event_users/${id}`).then(response => {
                response.data.forEach(element => {
                    newList.push(element.Email);
                });
            });

            
        } catch (error) {
            console.error('Error getting emails: ', error);
        }
        
        return newList;
    }

    async function sendEmail(EmailList) {
        for (let index = 0; index < EmailList.length; index++) {
            if (EmailList[index] === 'admin') {
                EmailList.splice(index, 1);
            }
        }
        const mailOptions = {
            EventTitle: title,
            Emails: EmailList,
        };

        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + `/event-delete-email`, mailOptions)
                if (response.status === 200) {
                    console.log('Email sent successfully!');
                }
        }
        catch (error) {
            console.error('Error sending email: ', error);
        }
    }

    async function deleteEvent(id) {
        try {
            const emails = await GetAllEmailsOfEvent(id);
            await sendEmail(emails);

            const response = await axios.post(process.env.REACT_APP_API_URL + `/delete_event/${id}`);
            if (response.status === 200) {
                setRefreshTrigger(prevState => prevState + 1);
            } else {
                console.error(`Error deleting event: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error deleting event: ${error}`);
        }
    }

    function setHearts() {

        if (HasLiked) {
            return (
                <>
                    <FontAwesomeIcon
                        icon={solidHeart}
                        className={` text-red-500 `}
                    />
                </>
            )
        } else {
            return (
                <>
                    <FontAwesomeIcon
                        icon={regularHeart}
                        className={`text-red-500 `}
                    />
                </>
            )
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
                    <div className='flex gap-x-2 flex-row '>
                        <button className=" py-0.5 px-1" onClick={() => { openModalWithEventData(eventData); }}>
                            <FontAwesomeIcon icon={faPencilAlt} className='w-4 h-4 text-blue-600 hover:scale-110 duration-150' />
                        </button>
                        <button className=" py-0.5 px-1" onClick={() => deleteEvent(id)}>
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-red-500 hover:scale-110 duration-150" />
                        </button>
                    </div>
                )}
                <div className="text-md w-2/3 text-gray-500 grow gap-x-2 flex truncate flex-row">
                    <div className="w-4/12 text-left truncate overflow-clip">
                        <FontAwesomeIcon icon={faClock} className="mr-1" />{dayOfWeek} - {startTime}
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
            <div className="flex whitespace-nowrap text-left flex-row justify-center items-center gap-x-2">
                {!isPastEvent ? (
                    <>
                        <div>{currentParticipants ? currentParticipants.length : 0}</div>
                        <FontAwesomeIcon icon={faPeopleGroup} className="mr-1" />
                    </>
                ) : (

                    <>
                        <div className=''>{likes}</div>
                        {setHearts()}
                    </>
                )}
            </div>
            <div className="flex justify-center w-1/6">
                <button onClick={() => { openModal(); checkIfJoined(eventData.id) }} className="bg-cavero-purple w-4/5 text-white text-base rounded-md self-center p-1 hover:bg-cavero-purple-dark truncate">meer info</button>
            </div>

            <EvenementInfoModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                event={eventData}
                joined={Joined}
                setJoined={setJoined}
                isPastEvent={isPastEvent}
                setRefreshTrigger={setRefreshTrigger}
                hasLiked={HasLiked}
                setHasLiked={setHasLiked}
                getLikes={getLikes}
                setHearts={setHearts}
            />
            <EvenementModal isOpen={isEditModalOpen} onRequestClose={closeEditModal} eventData={modalEventData} />
        </div>

    );
}

export default Evenement;