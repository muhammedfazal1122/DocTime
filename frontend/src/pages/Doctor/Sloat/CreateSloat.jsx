import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../utils/constants/Constants';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';

function CreateSlot() {
 const [selectedDate, setSelectedDate] = useState(dayjs());
 const [date, setDate] = useState('');
 const [startTime, setStartTime] = useState('');
 const [endTime, setEndTime] = useState('');
 const [breakTime, setBreakTime] = useState('');

 const handleDateChange = (newDate) => {
 setSelectedDate(newDate);
 }

 const handleSubmit = async (e) => {
    e.preventDefault();

    const slotData = {
        date,
        startTime,
        endTime,
        breakTime,
      };
    try {
        const response = await axios.post(`${baseUrl}create-slots/`, slotData);
        console.log(response.data);
        alert('Slots created successfully');
      } catch (error) {
        console.error('Error creating slots:', error);
        alert('Error creating slots');
      }
 }

 return (
    <div>


  
    <div>
            <div>
      <div class="w-screen">
  <div class="relative mx-auto mt-20 mb-20 max-w-screen-lg overflow-hidden rounded-t-xl bg-teal-600-400/60 py-32 text-center shadow-xl shadow-gray-300">
    <h1 class="mt-4 mb-8x-8 text-4xl font-bold text-cyan-500 md:text-5xl">Create Appointments</h1>
    <p class="mt-6 text-lg text-gray-500">“Wear the white coat with dignity and pride, It is an honor and privilege to get to serve the public as a physician.” </p>
    <img class="absolute top-0 left-0 -z-10 h-full w-full object-cover" src="/public/assets/catogory/docbook.jpg" alt="" />
  </div>

  <div class="mx-auto grid max-w-screen-lg px-6 pb-20">
    <div class="">
      <p class="font-serif text-xl font-bold text-blue-900">Select a service</p>
      <div class="mt-4 grid max-w-3xl gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
        <div class="relative">
          <input class="peer hidden" id="radio_1" type="radio" name="radio"  />
          <span class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-teal-400"></span>
          <label class="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-teal-600 peer-checked:text-white" for="radio_1">
            <span class="mt-2- font-medium">Financial Planning</span>
            <span class="text-xs uppercase">1 Hour</span>
          </label>
        </div>
        <div class="relative">
          <input class="peer hidden" id="radio_2" type="radio" name="radio" />
          <span class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-teal-400"></span>

          <label class="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-teal-600 peer-checked:text-white" for="radio_2">
            <span class="mt-2 font-medium">Retirement Planning</span>
            <span class="text-xs uppercase">1 Hour</span>
          </label>
        </div>
       
      </div>
    </div>

    <div class="">
      <p class="mt-8 font-serif text-xl font-bold text-blue-900">Select a date</p>
      <div class="relative mt-4 w-56">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg aria-hidden="true" class="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
          </div>
      </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
           <div className="relative mt-4 w-56">
          
          <DatePicker
  
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </div> 
      </div>
    </LocalizationProvider>

    </div>

    <div class="">
      <p class="mt-8 font-serif text-xl font-bold text-blue-900">Select a time</p>
      <div class="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
        <button class="rounded-lg bg-teal-100 px-4 py-2 font-medium text-teal-900 active:scale-95">12:00</button>
        <button class="rounded-lg bg-teal-100 px-4 py-2 font-medium text-teal-900 active:scale-95">14:00</button>
        <button class="rounded-lg bg-teal-700 px-4 py-2 font-medium text-white active:scale-95">09:00</button>
        <button class="rounded-lg bg-teal-100 px-4 py-2 font-medium text-teal-900 active:scale-95">12:00</button>
        <button class="rounded-lg bg-teal-100 px-4 py-2 font-medium text-teal-900 active:scale-95">15:00</button>
        <button class="rounded-lg bg-teal-100 px-4 py-2 font-medium text-teal-900 active:scale-95">12:00</button>
        <button class="rounded-lg bg-teal-100 px-4 py-2 font-medium text-teal-900 active:scale-95">14:00</button>
        <button class="rounded-lg bg-teal-100 px-4 py-2 font-medium text-teal-900 active:scale-95">12:00</button>
      </div>
    </div>

    <button class="mt-8 w-56 rounded-full border-8 border-teal-500 bg-teal-600 px-10 py-4 text-lg font-bold text-white transition hover:translate-y-1">Book Now</button>
  </div>
</div>
<script src="https://unpkg.com/flowbite@1.5.2/dist/datepicker.js"></script>

    </div>


    </div>

    </div>
 );
}

export default CreateSlot;
