import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import { baseUrl } from '../../../utils/constants/Constants';
import docbook from '../../../../public/assets/catogory/docbook.jpg'
function CreateSlot() {
 const [selectedDate, setSelectedDate] = useState(dayjs());
 const [selectedDate2, setSelectedDate2] = useState(dayjs());
 const [availableSlots, setAvailableSlots] = useState([]);
 const [selectedSlots, setSelectedSlots] = useState([]);
 const [selectedService, setSelectedService] = useState('');
 const [existingSlots, setExistingSlots] = useState([]);
 const [slots2, setSlots2] = useState([]); // State to store fetched slots
 const [selectedSlot2, setSelectedSlot2] = useState(null); // State to track the selected slot
 const [someArray, setSomeArray] = useState([]);


 const handleDeleteSlot = async () => {

 
  try {
    const custom_id = localStorage.getItem('custom_id'); // Retrieve custom_id from localStorage

     // Assuming you have an endpoint to delete a slot by its ID
     const response = await axios.delete(`${baseUrl}appointment/doctors/${custom_id}/slots-delete/${selectedSlot2.id}/`);
 
     if (response.status === 200) {
       // Remove the deleted slot from the slots2 array
       setSlots2(slots2.filter(slot => slot.id !== selectedSlot2.id));
       // Reset the selected slot
       setSelectedSlot2(null);
       toast.success("Slot successfully deleted.");
     } else {
       toast.error("Failed to delete slot. Please try again.");
     }
  } catch (error) {
     console.error("Error deleting slot:", error);
  }
 };
 
 useEffect(() => {
   fetchSlots()

 }, [selectedDate2])
 

 const fetchExistingSlots = async (date) => {
  try {
    const custom_id = localStorage.getItem('custom_id'); // Retrieve custom_id from localStorage

     const response = await axios.get(`${baseUrl}appointment/doctors/${custom_id}/slots/`, {
       params: {
         date: date.format('YYYY-MM-DD'),
       },
     });
     setExistingSlots(response.data.slots);
  } catch (error) {
     console.error("Error fetching existing slots:", error);
  }
 };
 
 // Updated function to accept start and end times, and break duration
 const createTimeSlots = (date, startHour, endHour, breakDuration) => {
    const startTime = new Date(date);
    startTime.setHours(startHour, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(endHour, 0, 0);

    const slots = [];
    while (startTime < endTime) {
      slots.push(new Date(startTime));
      startTime.setHours(startTime.getHours() + 1);
    }

    // Remove slots that fall within the break duration
    const breakStart = new Date(date);
    breakStart.setHours(startHour + breakDuration / 60, 0, 0);
    const breakEnd = new Date(date);
    breakEnd.setHours(startHour + breakDuration / 60 + 1, 0, 0);

    return slots.filter(slot => !(slot >= breakStart && slot < breakEnd));
 };

 const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
 };
 const handleServiceChange1 = (event) => {
  fetchSlots()
    setSelectedService(event.target.value);
 };



 
 const handleDateChange2 = (date) => {
  setSelectedSlots([]); 
  setSelectedDate2(date);
}


const handleDateChange = async (date) => {
  // Check if the selected date is before today
  if (date.isBefore(dayjs().startOf('day'))) {
      setAvailableSlots([]);
      setSelectedSlots([]);
      toast.error("You cannot select a date before today.");
      return; // Exit the function early
  }
 
  setSelectedDate(date);
  // Fetch existing slots for the selected date
  await fetchExistingSlots(date);
 
  // Generate available slots excluding existing ones
  const startHour = 9; // Start time
  const endHour = 17; // End time
  const breakDuration = 0; // Break duration in minutes
  const allSlots = createTimeSlots(date, startHour, endHour, breakDuration);
 
  // Filter out existing slots and your slots from available slots
  const availableSlots = allSlots.filter(slot => {
     const slotLocal = slot.toLocaleString();
     const existingSlot = existingSlots?.find(es => new Date(es.start_time).toLocaleString() === slotLocal);
     const yourSlot = slots2?.find(s => new Date(s.start_time).toLocaleString() === slotLocal);
     return !existingSlot && !yourSlot;
  });
 
  setAvailableSlots(availableSlots);
  setSelectedSlots([]); // Clear selected slots when date changes
 };
 
 const handleSlotChange = (slot) => {
  
    setSelectedSlots((prevSlots) => {
      const slotTime = slot.getTime();
      if (prevSlots.some(s => s.getTime() === slotTime)) {
        // If already selected, remove it from the array
        return prevSlots.filter(s => s.getTime() !== slotTime);
      } else {
        // If not selected, add it to the array
        return [...prevSlots, slot];
      }
    });
 };

 const handleCreate = async () => {
    try {
      const custom_id = localStorage.getItem('custom_id');
      const slotsData = selectedSlots.map(slot => ({
        day: selectedDate.format('YYYY-MM-DD'),
        start_time: slot.toISOString(),
        end_time: new Date(slot.getTime() + 60 * 60 * 1000).toISOString(),
        is_booked: false,
        doctor: custom_id
      }));

      

      try {
        const response = await axios.post(`${baseUrl}appointment/doctors/${custom_id}/slots/`, { slots: slotsData }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        toast.success("Slot Successfully Created");
      } catch (error) {
        
        // Handle error appropriately
      }
    } catch (error) {
      // Handle error appropriately
    }
 };



 const fetchSlots = async () => {
  try {
    const custom_id = localStorage.getItem('custom_id')
    // Format the selected date as a string in the format "YYYY-MM-DD"
    const dateString = selectedDate2.format('YYYY-MM-DD');
    const response = await axios.get(`${baseUrl}appointment/patient/slotsview/${custom_id}/${dateString}/`);
    const uniqueSlots = removeDuplicates(response.data);
    setSlots2(uniqueSlots);
  } catch (error) {
    console.error('Failed to fetch slots:', error);
    // Check if the error response contains a message and display it
    if (error.response && error.response.data && error.response.data.error) {
      setSlots2([]);
      toast.error(error.response.data.error);
    } else {
      // Fallback error message
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }
};



const removeDuplicates = (slots) => {
  const uniqueSlots = [];
  const slotTimes = new Set();

  for (const slot of slots) {
    const slotTime = dayjs(slot.start_time).format('HH:mm');
    if (!slotTimes.has(slotTime)) {
      uniqueSlots.push(slot);
      slotTimes.add(slotTime);
    }
  }

  return uniqueSlots;
};


const handleSlotSelect = (slot) => {
   
  setSelectedSlot2(slot);
};


 return (
    <div className="App">
      <div className="w-screen">
        <div className="relative mx-auto mt-20 mb-20 max-w-screen-lg overflow-hidden rounded-t-xl bg-teal-600-400/60 py-32 text-center shadow-xl shadow-gray-300">
          <h1 className="mt-4 mb-8x-8 text-4xl font-bold text-cyan-500 md:text-5xl">Create Appointments</h1>
          <p className="mt-6 text-lg text-gray-500">“Wear the white coat with dignity and pride, It is an honor and privilege to get to serve the public as a physician.” </p>
          <img className="absolute top-0 left-0 -z-10 h-full w-full object-cover" src={docbook} alt="" />
        </div>

        <div className="mx-auto grid max-w-screen-lg px-6 pb-20">
        <div class="">
      <p class="font-serif text-xl font-bold text-blue-900">Select a service</p>
      <div class="mt-4 grid max-w-3xl gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
        <div class="relative">
          <input class="peer hidden" id="radio_1" type="radio"  name="service"
          value="singleDay"  
          checked={selectedService === 'singleDay'}
          onChange={handleServiceChange}
           />
          <span class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-teal-400"></span>
        <label htmlFor="radio_1" class="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-teal-600 peer-checked:text-white">
        <span class="mt-2- font-medium">Single Day Slot </span>
        <span class="text-xs uppercase">1 Hour</span>
        </label>
        </div>
        {/* <div class="relative">
          <input class="peer hidden" id="radio_2" type="radio"  name="service"
            value="bulkSlot"   
            checked={selectedService === 'bulkSlot'}
            onChange={handleServiceChange}
            />
          <span class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-teal-400"></span>
                  <label htmlFor="radio_2" class="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-teal-600 peer-checked:text-white">
        <span class="mt-2 font-medium">Bulk Slot</span>
        <span class="text-xs uppercase">1 Hour</span>
        </label>
        </div> */}
       
        <div class="relative">
          <input class="peer hidden" id="radio_3" type="radio"  name="service"
            value="mySlot"   
            checked={selectedService === 'mySlot'}
            onChange={handleServiceChange1}
            />
          <span class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-teal-400"></span>
                  <label htmlFor="radio_3" class="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-teal-600 peer-checked:text-white">
        <span class="mt-2 font-medium">Show My Slot</span>
        <span class="text-xs uppercase">1 Hour</span>
        </label>
        </div>
       
      </div>
    </div>

{selectedService === 'singleDay' && (
 <>
    <div className="">
      <p className="mt-8 font-serif text-xl font-bold text-blue-900">Select a date</p>
      <div className="relative mt-4 w-56">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select a date"
            value={selectedDate}
            onChange={handleDateChange}
            components={{
              TextField: (params) => <TextField {...params} />,
            }}
          />
        </LocalizationProvider>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <p className="mt-8 font-serif text-xl font-bold text-blue-900">Select a time</p>
        <div className="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
          {availableSlots.map((slot) => (
            <button
              key={slot.getTime()}
              className={`rounded-lg px-4 py-2 font-medium ${selectedSlots.some(s => s.getTime() === slot.getTime()) ? 'bg-teal-100 text-teal-900' : 'bg-teal-100 text-teal-900'} active:scale-95`}
              onClick={() => handleSlotChange(slot)}
            >
              {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mt-8 font-serif text-xl font-bold text-blue-900">Selected Times</p>
        <div className="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
          {selectedSlots.map((slot) => (
            <div key={slot.getTime()} className="rounded-lg px-4 py-2 font-medium bg-teal-700 text-white">
              {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          ))}
        </div>
        {selectedSlots.length > 0 && (
          <button className="mt-8 w-56 rounded-full border-8 border-teal-500 bg-teal-600 px-10 py-4 text-lg font-bold text-white transition hover:translate-y-1" onClick={handleCreate}>Create Slot</button>
        )}
      </div>
    </div>
 </>
)}



{/* --------------------------------------------BUULLKKK---------------------------------------------------------------- */}
{selectedService === 'bulkSlot' && (
 <>
    <div className="">
      <p className="mt-8 font-serif text-xl font-bold text-blue-900">Select a date</p>
      <div className="relative mt-4 w-56">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select a date"
            value={selectedDate}
            onChange={handleDateChange}
            components={{
              TextField: (params) => <TextField {...params} />,
            }}
          />
        </LocalizationProvider>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <p className="mt-8 font-serif text-xl font-bold text-blue-900">Select a time</p>
        <div className="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
          {availableSlots.map((slot) => (
            <button
              key={slot.getTime()}
              className={`rounded-lg px-4 py-2 font-medium ${selectedSlots.some(s => s.getTime() === slot.getTime()) ? 'bg-teal-100 text-teal-900' : 'bg-teal-100 text-teal-900'} active:scale-95`}
              onClick={() => handleSlotChange(slot)}
            >
              {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mt-8 font-serif text-xl font-bold text-blue-900">Selected Times</p>
        <div className="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
          {selectedSlots.map((slot) => (
            <div key={slot.getTime()} className="rounded-lg px-4 py-2 font-medium bg-teal-700 text-white">
              {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          ))}
        </div>
        {selectedSlots.length > 0 && (
          <button className="mt-8 w-56 rounded-full border-8 border-teal-500 bg-teal-600 px-10 py-4 text-lg font-bold text-white transition hover:translate-y-1" onClick={handleCreate}>Create Slot</button>
        )}
      </div>
    </div>
 </>
)}


{/* --------------------------------------------MYYYYYSLOTTTT---------------------------------------------------------------- */}

      {selectedService === 'mySlot' && (

      <div class="">

      <div class="">
      <p class="mt-8 font-serif text-xl font-bold text-blue-900">Select a date</p>
      <div class="relative mt-4 w-56">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg aria-hidden="true" class="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
            </svg>
          </div>
      </div>  
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
      <div className="relative mt-4 w-56">
      <DatePicker
        label="Select a date"
        value={selectedDate2}
        onChange={handleDateChange2}
        components={{
          TextField: (params) => <TextField {...params} />,
        }}
      />
      </div>
      </div>
      </LocalizationProvider>

      </div>
      <p class="mt-8 font-serif text-xl font-bold text-blue-900">Select a time</p>


      <div className="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
      {slots2.map((slot, index) => (
    <div key={index} className="slot-container">
    <button
      className={`rounded-lg px-19 py-6 font-medium text-cyan-900 active:scale-95 w-full ${selectedSlot2 === slot ? 'bg-cyan-300 text-white' : 'bg-cyan-100'}`}
      onClick={() => handleSlotSelect(slot)}
    >
      {dayjs(slot.start_time).format('HH:mm')} - {dayjs(slot.end_time).format('HH:mm')}
      <div className='mt-3'>
    <button
      className="delete-button inline-flex items-center px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
      onClick={() => handleDeleteSlot(slot)}
    >
      <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 mr-2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
      Delete
    </button>
    </div>
    </button>
 </div>
))}

</div>

      </div>




)}

      </div>
    </div>
    </div>
 );
}

export default CreateSlot;
