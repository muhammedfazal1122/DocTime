import React, { useState, useMemo } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import { baseUrl } from '../../../utils/constants/Constants';

function CreateSlot() {
 const [selectedDate, setSelectedDate] = useState(dayjs());
 const [availableSlots, setAvailableSlots] = useState([]);
 const [selectedSlots, setSelectedSlots] = useState([]);
 const [selectedService, setSelectedService] = useState('');

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

 const handleDateChange = (date) => {
    setSelectedDate(date);
    // Manually set start and end times, and break duration
    const startHour = 9; // Start time
    const endHour = 17; // End time
    const breakDuration = 60; // Break duration in minutes
    setAvailableSlots(createTimeSlots(date, startHour, endHour, breakDuration));
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

      console.log(custom_id, 'oooooooooooooooo', slotsData);

      try {
        const response = await axios.post(`${baseUrl}appointment/doctors/${custom_id}/slots/`, { slots: slotsData }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        toast.success("Slot Successfully Created");
      } catch (error) {
        console.log('response errorrrrrrrr');
        // Handle error appropriately
      }
    } catch (error) {
      // Handle error appropriately
    }
 };





 return (
    <div className="App">
      <div className="w-screen">
        <div className="relative mx-auto mt-20 mb-20 max-w-screen-lg overflow-hidden rounded-t-xl bg-teal-600-400/60 py-32 text-center shadow-xl shadow-gray-300">
          <h1 className="mt-4 mb-8x-8 text-4xl font-bold text-cyan-500 md:text-5xl">Create Appointments</h1>
          <p className="mt-6 text-lg text-gray-500">“Wear the white coat with dignity and pride, It is an honor and privilege to get to serve the public as a physician.” </p>
          <img className="absolute top-0 left-0 -z-10 h-full w-full object-cover" src="/public/assets/catogory/docbook.jpg" alt="" />
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
        <div class="relative">
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
      </div>
    </div>
    </div>
 );
}

export default CreateSlot;
