import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { baseUrl } from '../../../utils/constants/Constants';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function BookAppoiment() {
 const [selectedDate, setSelectedDate] = useState(dayjs());
 const [slots, setSlots] = useState([]); // State to store fetched slots
 const [selectedSlot, setSelectedSlot] = useState(null); // State to track the selected slot
 const { custom_id } = useParams(); // Extract the doctor's ID from the URL
 const [ShowPaymet, setShowPaymet] = useState(false)

 useEffect(() => {
    // Fetch slots for the doctor
    fetchSlots();
 }, [custom_id, selectedDate]); // Depend on custom_id and selectedDate to refetch if they change

 const fetchSlots = async () => {
    try {
      // Format the selected date as a string in the format "YYYY-MM-DD"
      const dateString = selectedDate.format('YYYY-MM-DD');
      const response = await axios.get(`${baseUrl}appointment/patient/slotsview/${custom_id}/${dateString}/`);
      setSlots(response.data);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      // Check if the error response contains a message and display it
      if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error);
      } else {
          // Fallback error message
          toast.error('An unexpected error occurred. Please try again later.');
      }}
 };

 const bookSlot = async (slotId) => {
    console.log(`Booking slot with ID: ${slotId}`);
    // Here you would typically send a request to your backend to update the database
    // For example:
    // try {
    //   await axios.post(`${baseUrl}appointment/book`, { slotId });
    //   alert('Slot booked successfully!');
    // } catch (error) {
    //   console.error('Failed to book slot:', error);
    // }
 };

 const handleSlotSelect = (slot) => {
   
    handleBookNow()
    setSelectedSlot(slot);
 };

 const handleBookNow = () => {
    if (selectedSlot) {
      bookSlot(selectedSlot.id);
      setShowPaymet(true)

    }
 };

 const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setShowPaymet(false)
 }

const handleGotoPayment = ()=>{

}



  return (
    <div>
            <div>
      <div class="w-screen">
  <div class="relative mx-auto mt-20 mb-20 max-w-screen-lg overflow-hidden rounded-t-xl bg-cyan-600-400/60 py-32 text-center shadow-xl shadow-gray-300">
    <h1 class="mt-4 mb-8x-8 text-4xl font-bold text-cyan-400 md:text-5xl">Book an Appointment</h1>
    <p class="mt-6 text-lg text-gray-500">Get an appointment with our experienced accountants</p>
    <img class="absolute top-0 left-0 -z-10 h-full w-full object-cover" src="/public/assets/catogory/booking.jpg" alt="" />
  </div>

  <div class="mx-auto grid max-w-screen-lg px-6 pb-20">

 

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
        value={selectedDate}
        onChange={handleDateChange}
        components={{
          TextField: (params) => <TextField {...params} />,
        }}
      />
    </div>
 </div>
</LocalizationProvider>

    </div>
    <p class="mt-8 font-serif text-xl font-bold text-blue-900">Select a time</p>


    <div class="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
    {slots.map((slot, index) => (
              <button
                key={index}
                className={`rounded-lg px-19 py-6 font-medium text-cyan-900 active:scale-95  w-full  ${selectedSlot === slot ? 'bg-cyan-700 text-white' : 'bg-cyan-100'}`}
                onClick={() => handleSlotSelect(slot)}
                
              >
                {dayjs(slot.start_time).format('HH:mm')} - {dayjs(slot.end_time).format('HH:mm')}
              </button>
            ))} 
      </div>
    </div>



{ShowPaymet &&
  <div>
    <p class="mt-8 text-lg font-medium">Payment Methods</p>
    <form class="mt-5 grid gap-6">
      <div class="relative">
        <input class="peer hidden" id="radio_1" type="radio" name="radio"  />
        <span class="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-cyan-500 bg-white"></span>
        <label class="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-cyan-500 flex cursor-pointer select-none rounded-lg border border-cyan-500 p-4" for="radio_1">
          <img class="w-14 object-contain" src="/images/naorrAeygcJzX0SyNI4Y0.png" alt="" />
          <div class="ml-5">
            <span class="mt-2 font-semibold">Online Payment</span>
            <p class="text-slate-500 text-sm leading-6">Delivery: 2-4 Days</p>
          </div>
        </label>
      </div>
      <div class="relative">
        <input class="peer hidden" id="radio_2" type="radio" name="radio"  />
        <span class="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-cyan-500 bg-white"></span>
        <label class="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-cyan-500 flex cursor-pointer select-none rounded-lg border border-cyan-500 p-4" for="radio_2">
          <img class="w-14 object-contain" src="/images/oG8xsl3xsOkwkMsrLGKM4.png" alt="" />
          <div class="ml-5">
            <span class="mt-2 font-semibold">Wallet</span>
            <p class="text-slate-500 text-sm leading-6">Delivery: 2-4 Days</p>
          </div>
        </label>
      </div>
    </form>
    <button class="mt-8 w-56 rounded-full border-8 border-cyan-500 bg-cyan-600 px-10 py-4 text-lg font-bold text-white transition hover:translate-y-1" 
    onClick={handleGotoPayment}
    disabled={!selectedSlot}
    >Confirm Time</button>
</div>

}  
  </div>

</div>
<script src="https://unpkg.com/flowbite@1.5.2/dist/datepicker.js"></script>






    </div>
    </div>
  )
}

export default BookAppoiment