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
  const [ loading, setLoading ] = useState(false);
  const [ hidden, setHidden ] = useState(true);
  const [ changed, setChanged ] = useState(false);
  const [ weekDates, setWeekDates ] = useState([]);
  const [ weekNumber, setWeekNumber ] = useState('');

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

  const getWeek = (date) => {
    const curr = new Date(date);
    const start = new Date(curr.getFullYear(), 0, 1);
    const days = Math.floor((curr - start) / (24 * 60 * 60 * 1000));

    return Math.ceil(days / 7);
};

  const getPossibleValues = async () => {
    await axios.get(process.env.REACT_APP_API_URL + `/get-employee-schedule/${auth.ID}`).then((response) => {
      setWeekValues({
        Dag0: response.data[0]?.Monday ?? null,
        Dag1: response.data[0]?.Tuesday ?? null,
        Dag2: response.data[0]?.Wednesday ?? null,
        Dag3: response.data[0]?.Thursday ?? null,
        Dag4: response.data[0]?.Friday ?? null
      });
    });
  }

  useEffect(() => {
    getPossibleValues();
    setWeekDates(getAllDatesOfWeek().map((date) => {
      return date.getDate() + " " + getMonthName(date.getMonth(), false);
    }));
    setWeekNumber(getWeek(new Date()));
    
  }, []);

  const SendWeekSchedule = async (e) => {
    // Check if values are changed before sending request
    if (!changed) return;

    // Show loading icon
    setLoading(true);
    setHidden(false);

    // console.log(weekValues);

    // Send request
    await axios.post(process.env.REACT_APP_API_URL + '/scheduleweek', {
      Account_ID: auth.ID,
      Monday: weekValues.Dag0,
      Tuesday: weekValues.Dag1,
      Wednesday: weekValues.Dag2,
      Thursday: weekValues.Dag3,
      Friday: weekValues.Dag4
    }).then((response) => {
      
      setChanged(false);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    
    }).catch((error) => { 
      console.log(error);
    });

  };

  function getMonthName(month, short = true) {
    var monthNames = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun",
        "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"
    ];
    var monthFullNames = ["Januari", "Febuari", "Maart", "April", "Mei", "Juni",
        "Juli", "Augustus", "September", "Oktober", "November", "December"
    ];
    return short ? monthNames[month] : monthFullNames[month];
}


  const handleCheckboxChange = (index, overwrite=false) => {
    if (isDisabled[index] != true || overwrite) {
      setIsDisabled({
        ...isDisabled,
        [index]: !isDisabled[index],
      });
      
      // Correct form if checkbox is disabled and value is not null
      correctingForm(index);
    }

    return;
  };

  const correctingForm = (index) => {
    if (isDisabled[index] === true && weekValues["Dag" + index] !== null) {
      setWeekValues((prevWeekValues) => ({
        ...prevWeekValues,
        ["Dag" + index]: null,
      }));
    }
  }

  const handleSelectChange = async (e) => {
    setChanged(true);
    setWeekValues({
      ...weekValues,
      [e.target.name]: e.target.value == 0 ? null : e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    SendWeekSchedule();
  }

  const settingValue = (index) => {
    if (weekValues["Dag" + index] != null) {
      return weekValues["Dag" + index];
    } else {
      return 0;
    } 
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      contentLabel="Example Modal"
      className="event-modal p-3 max-w-md mx-auto bg-white rounded shadow-lg border-2 relative outline-none w-5/12 max-sm:w-11/12"
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
            Hieronder kunt u uw week indelen. Legen vaken wordt niet meegenomen in de planning oftewel afwezig.
          </p>
        </div>

        <span className='flex font-medium text-cavero-purple'>
          Week {weekNumber}: {weekDates[0]} t/m {weekDates[4]}
        </span>

        <div className='flex flex-col w-full gap-y-3'>
              {Menus.map((menu, index) => (
                <div onClick={() => handleCheckboxChange(index)} key={index} className={`flex flex-row rounded p-2.5 gap-x-2 ${!isDisabled[index] ? 'opacity-60 bg-gray-200 cursor-pointer' : 'bg-cavero-purple-light'}`}>
                  <div className='flex'>
                    <input onClick={() => handleCheckboxChange(index, true)} checked={isDisabled[index]} type="checkbox" className='cursor-pointer accent-cavero-purple rounded w-4 h-4 checked:bg-cavero-purple' />
                  </div>

                  <div className='flex flex-col gap-y-1.5 w-full'> 
                    <span onClick={() => handleCheckboxChange(index, true)} className='cursor-pointer text-lg text-gray-700 font-medium w-full leading-none'>{menu}</span>
                    <select onChange={(e) => handleSelectChange(e)} 
                            name={"Dag" + index} 
                            value={settingValue(index)} 
                            className={`font-normal w-full ${!isDisabled[index] && 'hidden'}`} 
                            placeholder='Kies een optie'>
                      <option value={0}>---</option>
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