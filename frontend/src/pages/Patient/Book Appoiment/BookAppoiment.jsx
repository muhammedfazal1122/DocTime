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
import { Link } from 'react-router-dom'
import useRazorpay from "react-razorpay";
import bookingpic from  '../../../../public/assets/catogory/booking.jpg';
import razorwebp from '../../../../public/assets/Logo/razor.webp'




import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { jwtDecode } from 'jwt-decode';

function BookAppoiment() {

  const [Razorpay] = useRazorpay();

 const [selectedDate, setSelectedDate] = useState(dayjs());
 const [slots, setSlots] = useState([]); // State to store fetched slots
 const [selectedSlot, setSelectedSlot] = useState(null); // State to track the selected slot
 const { custom_id } = useParams(); // Extract the doctor's ID from the URL
 const [ShowPaymet, setShowPaymet] = useState(false)
 const [patientID, setPatientID] = useState(null)
const [Fees, setFees] = useState(300)
const [specializations, setspecializations] = useState()
const [id, setId] = useState(null);
 const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('online');
 const [DoctorData, setDoctorData] = useState({
  profile_picture: '', 
 });
const navigate = useNavigate();
const [OnlinePaymet, setOnlinePaymet] = useState(false)
const doctorId = custom_id
const [transactionData, setTrasaction] = useState([])

console.log(DoctorData,'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
  
const handleRazorpay = () =>{

  const fees = DoctorData.doctor_user.consultaion_fees
  const specializations = DoctorData.doctor_user.specializations
  // const fees = DoctorData.doctor_user.consultaion_fees
  // const fees = DoctorData.doctor_user.consultaion_fees
  
  setFees(fees)
  setspecializations(specializations)


 // Check if selectedSlot is not null before proceeding
 if (!selectedSlot) {
  toast.error("Please select a time slot before proceeding with payment.");
  return; // Exit the function if selectedSlot is null
}

console.log(doctorId,selectedSlot.end_time,selectedSlot.start_time,selectedDate.format("YYYY-MM-DD"),'ppppppppppppppppppppppppppppppppppppppppp');
    // Check slot availability before proceeding with payment
    
    axios
      .post(`${baseUrl}appointment/check-availability/`, {
        doctor_id: doctorId,
        selected_from_time: selectedSlot.start_time,
        selected_to_time: selectedSlot.end_time,
        selected_day: selectedDate.format("YYYY-MM-DD"),
      })
      .then((availabilityCheckResponse) => {
        console.log(availabilityCheckResponse,'lllllllllllllll');

        if (!availabilityCheckResponse.data.available) {                            
          toast.warning("This slot is already booked. Please choose another slot ");
          return;
        }
        else if (availabilityCheckResponse.data.error) {
          toast.warning("This slot is already booked. Please choose another slot.");
        }        
        // If the slot is available, proceed with creating the order
        return axios.post(`${baseUrl}appointment/create-order/`, {
          amount: fees,
          currency: "INR",
          // Add any other relevant data for creating the order
        });
      })
      .then((orderResponse) => {
        const order = orderResponse.data.data.id;

        // Configure Razorpay options
        const options = {
          key: "rzp_test_qKaBFzO61y6fU4", // Enter the Key ID generated from the Dashboard
          name: "DocTime",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: order, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
          handler: function (response) {
            console.log(
              "api responseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
              response
            );
            //complete order
            complete_order(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
          },
          prefill: {
            name: "muhammed Fazal",
            email: "youremail@example.com",
            contact: "9999999999",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp1 = new Razorpay(options);
        rzp1.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.metadata.payment_id);
        });
        rzp1.open();
      })
      .catch((error) => {
        console.error("Error during payment processing:", error);
        // Consider displaying a user-friendly error message
      });
  };



  // const fees = DoctorData.doctor_user.consultaion_fees
  // setFees(fees)

  
  // complete order
  const complete_order = (paymentID, orderID, signature) => {
    console.log(Fees,'feeeeeeeeeeeeeeeeeee');

    console.log("patient id got here befor passing",patientID)
    axios
      .post(`${baseUrl}appointment/complete-order/`, {
        payment_id: paymentID,
        order_id: orderID,
        signature: signature,
        amount: Fees,
        doctor_id: doctorId,
        patient_id: patientID,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        day: selectedDate.format("YYYY-MM-DD"),
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then((response) => {
        console.log(response.data);
        if (response.status === 201) {
          console.log("compleeetedd transaction");
      
          navigate("/DoctorShow/BookAppoiment/success-page")
        }
      })
      .catch((error) => {
        console.log(error);
      });
};

  


  


const fetchPatientCustomId =async ()=>{
  try {
    const refreshToken = localStorage.getItem("refresh");
    console.log(refreshToken, "nooooooooooooo");

    let decoded = jwtDecode(refreshToken);
    console.log(decoded, "hfhhhhhhhhhhhhhhhhhhhhhhhh");
    let id = decoded.user_id;
    setId(id);
    console.log(id,'iiiiiiiiiiiiiiiiiiddddddddddddddddddddd');

    const doct = await axios.get(`${baseUrl}auth/patient/list/${id}`);
    // http://localhost:8000/auth/patient/list/5f7876fe-6907-4386-94e0-2bfe2c5faeb2
    if (doct.status === 200) {
      const CustomId = doct.data.patient_user.custom_id

      setPatientID(CustomId);

      console.log('custom_id=======',patientID);
      console.log('custom_id=======',doct.data.patient_user.custom_id);


    }
  } catch (error) {
    console.log("error in iiiiiiiiiiiiiiiiiiddddddddddddddddddddd custom_id");
  }
 
} 




 useEffect(() => {
    // Fetch slots for the doctor
    fetchSlots();
    fetchPatientCustomId()
    fetchDoctordata()
    if (patientID) {
      console.log('Updated patientID:', patientID);
      // You can use the updated patientID here
   }
 }, [custom_id, selectedDate,patientID]); // Depend on custom_id and selectedDate to refetch if they change
 
 const fetchDoctordata = () => {
  try {
    console.log('lllllllllllll');
     const accessToken = localStorage.getItem("access");
 
     axios.get(`${baseUrl}auth/admin/doctor/verication/listbooking/`, {
       headers: {
         Authorization: `Bearer ${accessToken}`,
         Accept: 'application/json',
         'Content-Type': 'application/json',
       }
     }).then(response => {
       console.log(response.data, 'reeeeessssssssssss');
       // Assuming you want to find the doctor by custom_id and then extract consultation_fees
       const doctor = response.data.results.find(doctor => doctor.doctor_user.custom_id === custom_id);
       if (doctor) {
         setDoctorData(doctor);
       
         console.log(doctor.doctor_user.consultaion_fees,'feeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

       } else {
         console.log('Doctor not found');
       }
     }).catch(error => {
       console.log(error, 'errorrrrrrrrrrrr');
     });
  } catch (error) {
     console.log(error, 'errorrrrrrrrrrrr');
  }
 };
 
 const fetchSlots = async () => {
  try {
    // Format the selected date as a string in the format "YYYY-MM-DD"
    const dateString = selectedDate.format('YYYY-MM-DD');
    const response = await axios.get(`${baseUrl}appointment/patient/slotsview/${custom_id}/${dateString}/`);
    const uniqueSlots = removeDuplicates(response.data);
    setSlots(uniqueSlots);
  } catch (error) {
    console.error('Failed to fetch slots:', error);
    // Check if the error response contains a message and display it
    if (error.response && error.response.data && error.response.data.error) {
      setSlots([]);
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
  if (newDate.isBefore(dayjs().startOf('day'))) {
    setSlots([])
    toast.error("You cannot select a date before today.");
     return; // Exit the function early
  }
  setSelectedDate(newDate);
  setShowPaymet(false)

  // Optionally, you can setShowPaymet(false) here if you want to hide the payment UI for dates other than today
 };
 

 const handlePaymentMethodChange = (event) => {
  setSelectedPaymentMethod(event.target.value);
};


 const handleGotoPayment = () => {
    if (selectedPaymentMethod === 'online') {
      setOnlinePaymet(true)


    } else if (selectedPaymentMethod === 'wallet') {
      setOnlinePaymet(false)
    }

 };
 function StarIcon() {
  return (
    <div>


    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 text-yellow-700"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
    </div>
  );
}





  return (
    <div>
            <div>
      <div class="w-screen">
  <div class="relative mx-auto mt-20 mb-20 max-w-screen-lg overflow-hidden rounded-t-xl bg-cyan-600-400/60 py-32 text-center shadow-xl shadow-gray-300">
    <h1 class="mt-4 mb-8x-8 text-4xl font-bold text-cyan-400 md:text-5xl">Book an Appointment</h1>
    <p class="mt-6 text-lg text-gray-500">Get an appointment with our experienced accountants</p>
    <img class="absolute top-0 left-0 -z-10 h-full w-full object-cover" src={bookingpic} alt="" />
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
    className={`rounded-lg px-19 py-6 font-medium text-cyan-900 active:scale-95 w-full ${
      selectedSlot === slot ? 'bg-cyan-700 text-white' : 'bg-cyan-100'
    } ${slot.is_booked ? 'bg-cyan-400 text-white' : ''}`}
    onClick={() => handleSlotSelect(slot)}
 >
    {dayjs(slot.start_time).format('HH:mm')} - {dayjs(slot.end_time).format('HH:mm')}
    {slot.is_booked && (
      <div>

        <span className="text-xs text-black">Booked ✔</span>
      </div>
    )}
 </button>
))}

      </div>
    </div>



{ShowPaymet &&
  <div>





<Card  shadow={false} className="w-full max-w-[49rem] bg-slate-200 mt-5">

     
<Typography variant="h5" color="blue-gray"         className="mt-3 ml-6"
>
              <div>
        Booking Detailes
              </div>
            </Typography>
      <CardHeader
        color="transparent"
        floated={false}
        shadow={false}
        className="mx-0 flex items-center gap-4 pt-0 pb-8"
      >
        <Avatar className="max-w-[8rem] ml-7"
          size="lg"
          variant="circular"
          alt="tania andrew"
          src={DoctorData.profile_picture}
        />
        <div className="flex w-full flex-col gap-0.5">
          <div className="flex items-center justify-between">
            
            <Typography variant="h5" color="blue-gray">
              <div>

           {`${DoctorData.first_name } ${DoctorData.last_name } `}
              </div>
            </Typography>
           
            
            {selectedSlot && (
    <div className='bg-blue-400 rounded-md p-2 text-sm text-gray-700 mr-5'>
      
    Selected Time {dayjs(selectedSlot.start_time).format('HH:mm')} - {dayjs(selectedSlot.end_time).format('HH:mm')}
            </div>
            

          )}
          
        
          </div>
          <div className="5 flex items-center gap-0">
            

            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
          </div>
          Booking Fees: ₹ {Fees}
        
          <Typography color="blue-gray">fasdfasdf { specializations}</Typography>
          <Typography color="blue-gray"> Hospital: { DoctorData?.doctor_user?.Hospital}</Typography>
          <Typography color="blue-gray"> Experience: { DoctorData?.doctor_user?.experience} years</Typography>
        </div>
      </CardHeader>
      <CardBody className="mb-6 p-0">
        <Typography>
          &quot;    { DoctorData?.doctor_user?.about_me}&quot;
        </Typography>
      </CardBody>
    </Card>




    <p class="mt-8 text-lg font-medium">Payment Methods</p>
<form class="mt-5 grid gap-6 grid-cols-2">
 <div class="relative">
    <input class="peer hidden" 
      id="radio_1"
      type="radio" 
      name="radio" 
      value="online"
      checked={selectedPaymentMethod === 'online'}
      onChange={handlePaymentMethodChange}
    />
    <span class="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-cyan-500 bg-white"></span>
    <label class="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-cyan-500 flex cursor-pointer select-none rounded-lg border border-cyan-500 p-4" for="radio_1">
      <img class="w-14 object-contain" src="/images/naorrAeygcJzX0SyNI4Y0.png" alt="" />
      <div class="ml-5">
        <span class="mt-2 font-semibold">Online Payment</span>
      </div>
    </label>
 </div>
 <div class="relative">
    <input
      class="peer hidden"
      id="radio_2"
      type="radio"
      name="radio"
      value="wallet"
      checked={selectedPaymentMethod === 'wallet'}
      onChange={handlePaymentMethodChange}
    />
    <span class="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-cyan-500 bg-white"></span>
    <label class="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-cyan-500 flex cursor-pointer select-none rounded-lg border border-cyan-500 p-4" for="radio_2">
      <img class="w-14 object-contain" src="/images/oG8xsl3xsOkwkMsrLGKM4.png" alt="" />
      <div class="ml-5">
        <span class="mt-2 font-semibold">Wallet</span>
      </div>
    </label>
 </div>
</form>

    <button class="mt-8 w-56 rounded-full border-8 border-cyan-500 bg-cyan-600 px-10 py-4 text-lg font-bold text-white transition hover:translate-y-1" 
    onClick={handleGotoPayment}
    disabled={!selectedSlot}

    >Confirm Time</button>


{OnlinePaymet&&

<div>
<div className="relative z-10 flex flex-col md:flex-row mt-10 items-center  max-w-6xl justify-evenly mx-auto">
      <div className="md:w-1/3 mb-20 md:mb-0 mx-10">
        <h1 className=" text-cyan-300 font-bold text-5xl mb-10">
     
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-violet-500">
            payments
          </span>{" "}

        </h1>
      
        <div className="bg-gradient-to-r from-[#3e4044] to-[#1D2328] p-[1px] rounded-md mb-4">
          <button
            onClick={handleRazorpay}
            className="bg-gradient-to-r from-[#2E3137] to-[#1D2328] rounded-md w-full py-4 shadow-xl drop-shadow-2xl text-gray-300 font-bold"
          >
            Purchase Now!
          </button>
        </div>
     
      </div>
      <div className="w-2/3 bg-white flex-shrink-0  relative">
      <img
        className="w-full md:w-[36rem] h-full"
        alt="stripe payment from undraw"
        src={razorwebp}
      />
      </div>

      
    </div>
</div>


}
</div>

}  







  </div>
</div>
<script src="https://unpkg.com/flowbite@1.5.2/dist/datepicker.js"></script>



{/* 
const express = require('express');
const app = express();
app.use(express.json());

// Assuming you have a function to calculate the commission
function calculateCommission(amount) {
 return amount * 0.20; // 20% commission
}

// Endpoint to process payment and transfer funds
app.post('/process-payment', async (req, res) => {
 const { patientId, doctorId, amount } = req.body;

 try {
    // Calculate the commission
    const commission = calculateCommission(amount);
    const doctorAmount = amount - commission;

    // Transfer funds to admin (commission)
    await transferFunds(patientId, 'adminAccountId', commission);

    // Transfer funds to doctor
    await transferFunds('adminAccountId', doctorId, doctorAmount);

    // Generate receipt
    const receipt = generateReceipt(patientId, doctorId, amount, commission, doctorAmount);

    // Send receipt to the client
    res.json({ success: true, receipt });
 } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing payment' });
 }
});

// Function to transfer funds (simplified)
async function transferFunds(fromAccountId, toAccountId, amount) {
 // Implement your logic to transfer funds between accounts
 // This might involve updating your database to reflect the transaction
}

// Function to generate a receipt (simplified)
function generateReceipt(patientId, doctorId, totalAmount, commission, doctorAmount) {
 // Generate a receipt object with the necessary details
 return {
    transactionId: 'someTransactionId',
    patientId,
    doctorId,
    totalAmount,
    commission,
    doctorAmount
 };
}

app.listen(3000, () => console.log('Server running on port 3000'));



 */}


    </div>
    </div>
  )
}

export default BookAppoiment