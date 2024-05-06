import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import doctorImage from '../../src/assets/logo/2149431138.jpg'; // Placeholder image for doctors
import Image from '../../src/assets/logo/loogoo.png'; // Placeholder image for doctors

const AboutPage = () => {
  return (
    <>
      <div className="text-white pt-2" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="max-w-8xl ">
          <div className="text-center relative ">
            <img src={doctorImage} alt="Online Doctor Booking Banner" className="w-full h-96 object-cover rounded-lg" />
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <img src={Image} alt="Event Crest Logo" className="w-64 mx-auto" />
            </div>
          </div>

          <div className="text-center relative ">
            <div className="w-full h-60 object-cover rounded-lg ">
              <h2 className="text-3xl font-bold text-black justify-center font-bold pt-16">Welcome to Online Doctor Booking</h2>
              <p className="mt-2 text-lg text-black font-bold">Connecting Patients with Trusted Doctors!</p>
            </div>
            <h2 className="mt-2 text-3xl text-black font-bold">About us</h2>
          </div>

          <div className="text-center mt-10">
            <div className="max-w-3xl mx-auto">

              <p className="text-lg text-gray-700 mb-4">Online Doctor Booking is a platform that simplifies the process of booking appointments with trusted doctors. Our goal is to provide convenient and reliable access to healthcare services for patients.</p>

              <p className="text-lg mb-4 text-gray-700">We're a dedicated team passionate about improving healthcare accessibility. We collaborate with healthcare professionals to offer a seamless booking experience and ensure patients receive the care they need.</p>

              <p className="text-lg mb-4 text-gray-700">Online Doctor Booking is committed to enhancing the healthcare landscape by leveraging technology to empower patients and doctors alike.</p>
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl text-black font-bold mb-4">What do we offer?</h3>
              <p className="text-lg text-gray-700 mb-4">Online Doctor Booking provides a comprehensive platform for patients to search for doctors, book appointments, and manage their healthcare needs online. We offer a user-friendly interface, secure communication channels, and personalized care options.</p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-black">Find Your Trusted Doctor</h3>
              <p className="text-lg mb-4 text-gray-700">We understand the importance of choosing the right healthcare provider. That's why we only feature verified doctors who meet our strict criteria for expertise, professionalism, and patient care. Use our search filters to find the perfect doctor for your needs!</p>

              <Link to='/'>
                <Button className='lg:w-60 lg:h-14 rounded-full py-2 px-4 text-white font-bold bg-pink-500'>Book an Appointment</Button>
              </Link>
            </div>
          </div>

          <div className="mt-16 text-center mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-500 py-8 rounded-lg hover:shadow-2xl hover:border-red-500 transition duration-300 ease-in-out transform">
                <p className="text-4xl font-bold text-black">1000+</p>
                <p className="mt-2 text-lg text-black">Verified Doctors</p>
              </div>
              <div className="bg-gray-500 py-8 rounded-lg hover:shadow-2xl hover:border-red-500 transition duration-300 ease-in-out transform">
                <p className="text-4xl font-bold text-black">5000+</p>
                <p className="mt-2 text-lg text-black">Appointments Booked</p>
              </div>
              <div className="bg-gray-500 py-8 rounded-lg hover:shadow-2xl hover:border-red-500 transition duration-300 ease-in-out transform">
                <p className="text-4xl font-bold text-black">50+</p>
                <p className="mt-2 text-lg text-black">Specialties Covered</p>
              </div>
              <div className="bg-gray-500 py-8 rounded-lg hover:shadow-2xl hover:border-red-500 transition duration-300 ease-in-out transform">
                <p className="text-4xl font-bold text-black">24/7</p>
                <p className="mt-2 text-lg text-black">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
