import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate()
    const gotohome = ()=>{
        navigate('/')
    }
    const gotoBooking = ()=>{
        navigate('/DoctorShow/BookAppoiment/booking-detailes')
    }
 return (
    <div className="bg-blue-100 min-h-screen flex items-center justify-center">
      <div className="container max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-center bg-gray-800 text-white py-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-500 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-semibold text-center text-gray-800">
            Payment Complete
          </h1>
          <p className="text-lg text-center text-gray-600 mt-4">
            Thank you for completing the payment! You will shortly receive an email of your payment.
          </p>
          <div className="text-center mt-6">
            <div className="text-lg font-semibold text-gray-800 mb-2">
            </div>
            {/* <div className="text-3xl text-gray-900 font-bold">123456789</div> */}
            <div className="text-green-500 text-lg mt-2">Thank You!</div>
         <div className='space-x-8 mt-3'>
         <button
         onClick={gotohome}
            class="text-zinc-700 hover:text-cyan-600 backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-6 shadow hover:shadow-green-600 duration-700"
            >
            Home
            </button>
         <button    
         onClick={gotoBooking}

            class="text-zinc-700 hover:text-cyan-600 backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-6 shadow hover:shadow-green-600 duration-700"
            >

                
            Show Booking Detailes
            </button>


         </div>
          </div>
        </div>
      </div>
    </div>
 );
};

export default PaymentSuccess;
