import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserAlt, faUserCircle, faCalendarDays, faClock, faMapMarkerAlt, faTruckMedical, faSpinner, faCheck} from '@fortawesome/free-solid-svg-icons';
import axios, { all } from 'axios';
import useAuth from '../hooks/useAuth';


function MorgenModal({isOpen, onRequestClose, }) {
  const { auth } = useAuth();
  const [ weekValues, setWeekValues ] = useState({});
  const [ isDisabled, setIsDisabled ] = useState({});
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [changed, setChanged] = useState(false);

  const Menus = [
    ["Maandag"],
    ["Dinsdag"],
    ["Woensdag"],
    ["Donderdag"],
    ["Vrijdag"],
  ];

  const getAllDatesOfWeek = () => {
    let dates = [];
    let date = new Date();
    let day = date.getDay();
    let diff = date.getDate() - day + (day == 0 ? -6:1);
    let monday = new Date(date.setDate(diff));
    for(let i = 0; i < 5; i++) {
      let nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      dates.push(nextDay);
    }

    return dates;
    
  }

  const getPossibleValues = async (Account_ID, Date) => {
    await axios.get('http://localhost:8080/get-employee-schedule', {ID: Account_ID, Date: Date}).then((response) => {
      return response.data.Room == null ? 0 : response.data.Room;
    });
  }

  const setWeekValuesToDefault = () => {
    const WeekDates = getAllDatesOfWeek();
    for (let i = 0; i < 5; i++) {
      let indexOfWeeks = WeekDates.indexOf(WeekDates[i]);
      let WeekDate = WeekDates[i].getFullYear() + "-" + (WeekDates[i].getMonth() + 1) + "-" + WeekDates[i].getDate();
      let WeekDateValue = getPossibleValues(auth.ID, WeekDate);

      if (WeekDateValue != 0) {
        setWeekValues({
          ...weekValues,
          ["Dag" + indexOfWeeks]: WeekDateValue,
        });
      }
    }
  }

  useEffect(() => {
    setWeekValuesToDefault();
  }, []);

  const SendWeekSchedule = async (e) => {
    // Check if values are changed before sending request
    // if (!changed) return;

    // Get all dates of the week
    const WeekDates = getAllDatesOfWeek();

    // Show loading icon
    setLoading(true);
    setHidden(false);

    console.log(weekValues);

    // Send request
    // for (let i = 0; i < 5; i++) {
    //   let indexOfWeeks = WeekDates.indexOf(WeekDates[i]);
    //   let WeekDate = WeekDates[i].getFullYear() + "-" + (WeekDates[i].getMonth() + 1) + "-" + WeekDates[i].getDate();
    //   let WeekDateValue = weekValues["Dag" + indexOfWeeks];

    //   await axios.post('http://localhost:8080/scheduleweek', {
    //     Account_ID: auth.ID,
    //     Date: WeekDate,
    //     Room: WeekDateValue,
    //   }).then((response) => {
        
    //     setChanged(false);
      
    //   }).catch((error) => { 
    //     console.log(error);
    //   });
    // }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };


  const handleCheckboxChange = (index, overwrite=false) => {
    if (isDisabled[index] != true || overwrite) {
      setIsDisabled({
        ...isDisabled,
        [index]: !isDisabled[index],
      });
    }

    return;
  };

  const handleSelectChange = async (e) => {
    setChanged(true);
    setWeekValues({
      ...weekValues,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // console.log(weekValues);
    SendWeekSchedule();
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      contentLabel="Example Modal"
      className="event-modal p-3 max-w-md mx-auto bg-white rounded shadow-lg border-2 relative outline-none w-5/12"
      overlayClassName="event-modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className='flex flex-col gap-y-2'>
        <button className='flex justify-end' onClick={onRequestClose}>
          <FontAwesomeIcon icon={faTimes} className='fa-lg text-gray-400 ml-auto absolute top-1 right-1'/>
        </button>

        <div className='flex flex-row'>
          <span className='text-2xl text-cavero-purple font-semibold'>Mijn beschikbaarheid</span>
        </div>

        <div>
          <p className='text-gray-500'>
            Hieronder kunt u uw week indelen. U kunt ervoor kiezen om dagen open te houden.
          </p>
        </div>

        <span className='flex font-medium text-cavero-purple'>
          Week 1: 4 januari t/m 8 januari
        </span>

        <div className='flex flex-col w-full gap-y-3'>
              {Menus.map((menu, index) => (
                <div onClick={() => handleCheckboxChange(index)} key={index} className={`flex flex-row rounded p-2.5 gap-x-2 ${!isDisabled[index] ? 'opacity-60 bg-gray-200 cursor-pointer' : 'bg-cavero-purple-light'}`}>
                  <div className='flex'>
                    <input onClick={() => handleCheckboxChange(index, true)} checked={isDisabled[index]} type="checkbox" className='cursor-pointer accent-cavero-purple rounded w-4 h-4 checked:bg-cavero-purple' />
                  </div>

                  <div className='flex flex-col gap-y-1.5 w-full'> 
                    <span onClick={() => handleCheckboxChange(index, true)} className='cursor-pointer text-lg text-gray-700 font-medium w-full leading-none'>{menu}</span>
                    <select onChange={(e) => handleSelectChange(e)} name={"Dag" + index} className={`font-normal w-full ${!isDisabled[index] && 'hidden'}`} placeholder='Kies een optie'>
                      <option disabled={true} selected={true} value={0}>---</option>
                      <option value={"Stille Ruimte"}>Stille ruimte</option>
                      <option value={"Werk Ruimte 1"}>Werk Ruimte 1</option>
                      <option value={"Werk Ruimte 2"}>Werk Ruimte 2</option>
                      <option value={"Werk Ruimte 3"}>Werk Ruimte 3</option>
                      <option value={"Thuis"}>Thuis</option>
                    </select>
                  </div>
                  
                  
                </div>
                ))}            
        </div>

        <div className='flex flex-row-reverse'>
          <button type='submit' onClick={(e) => handleSubmit(e)} id='ChangeProfile' className='flex gap-x-1.5 items-center justify-center px-4 py-1.5 bg-cavero-purple rounded-md text-white hover:bg-cavero-purple-dark hover:scale-105 duration-200'>
            Opslaan
            <FontAwesomeIcon icon={loading ? faSpinner : faCheck} className={`${loading ? "animate-spin" : ""} ${hidden ? 'hidden' : ''}`} />
          </button>
      </div>
        
      </div>
    </Modal>
  );
}

export default MorgenModal;