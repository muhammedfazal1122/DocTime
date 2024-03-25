import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../utils/constants/Constants';
import { useParams } from "react-router-dom";
import { BeakerIcon } from "@heroicons/react/24/solid";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { BriefcaseIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/solid";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
export default function ViewDocProfile() {
    const { id } = useParams(); // Extract the doctor's ID from the URL

    const [doctor, setDoctor] = useState(null); // Use a single doctor object instead of an array

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const authToken = localStorage.getItem('access');
                console.log(id, "Fetching doctor details...");
                const response = await axios.get(`${baseUrl}auth/docdetailes/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                setDoctor(response.data);
                console.log(response.data.profile_picture);
            } catch (error) {
                console.error("Error fetching doctor details:", error);
            }
        };

        fetchDoctorDetails();
    }, [id]); // Depend on the ID to refetch if it changes

      
    const fields = [
        {
          title: "Specialization",
          key: 'specialization',
          icon: <BeakerIcon className="h-6 w-6 text-blue-500" />,
        },
        {
          title: "Education",
          key: "education",
          icon: <AcademicCapIcon className="h-6 w-6 text-blue-500" />,
        },
        {
          title: "Experience",
          key: "experience",
          icon: <BriefcaseIcon className="h-6 w-6 text-blue-500" />,
        },
        {
          title: "Timing",
          key: "timing",
          icon: <ClockIcon className="h-6 w-6 text-blue-500" />,
        },
        {
          title: "Booking Fees",
          key: "bookingFees",
          icon: <CurrencyDollarIcon className="h-6 w-6 text-blue-500" />,
        },
      ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 justify-items-center mt-[90px] mb-[90px]">
            {/* Profile Card */}
            <div className="group before:hover:scale-95 before:hover:h-72 before:hover:w-80 before:hover:h-44 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-[''] before:w-80 before:h-24 before:rounded-t-2xl before:bg-gradient-to-bl from-sky-200 via-orange-200 to-orange-700 before:absolute before:top-0 w-80 h-72 relative bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden shadow rounded-2xl">
                <img
                    src={doctor?.profile_picture || ''} // Replace this with the actual path to your image
                    alt="Profile Picture"
                    className="w-28 h-28 mt-8 rounded-full border-4 border-slate-50 z-10 group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20 transition-all duration-500"
                />
                <div className="z-10 group-hover:-translate-y-10 transition-all duration-500">
                    <span className="text-2xl font-semibold">{doctor?.doctor_user?.full_name || ''}</span>
                    <p>{doctor?.doctor_user?.specializations || ''}</p>
                    {console.log(doctor?.doctor_user?.specializations|| 'no','lllllllllllllllllllllllll')}
                </div>
                <a className="bg-blue-700 px-4 py-1 text-slate-50 rounded-md z-10 hover:scale-125 transition-all duration-500 hover:bg-blue-500" href="#">Book Now</a>
            </div>
{/* About Me Card */}
<div className="col-span-full md:col-span-1 mr-[90px]">
    <div className="bg-white shadow rounded-lg p-6 max-w-xl mx-auto"> {/* Increase the width of the card */}
        <h2 className="text-xl font-bold mb-4">About Me</h2>
        <p className="text-gray-700">
           {doctor?.doctor_user?.about_me || ''}
        </p>

        <h3 className="font-semibold text-center pt-16">Find me on</h3>
        <div className="flex justify-center items-center gap-6 my-6">
            {/* Social media links */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16"> {/* Adjust the grid layout */}
            <div className="mb-6 sm:w-full md:w-full lg:w-full xl:w-full px-2">
                <div className="flex items-center">
                    <h2 className="text-xl font-bold ml-2 mb-2">Specializations</h2>
                </div>
                <div className="flex justify-between flex-wrap gap-2 w-full">
                    <ul className="list-disc">
                        <li className="text-gray-700 font-bold ml-12 mt-2">Cardiology</li>
                        <li className="text-gray-700 font-bold ml-12 mt-2">Heart Disease</li>
                    </ul>
                </div>
            </div>
            {/* Add more sections as needed */}
            {fields.map((field, index) => (
              <div
                key={index}
                className="mb-6 sm:w-full md:w-full lg:w-full xl:w-full px-2"
              >
                <div className="flex items-center">
                 {field.icon}
                 <h2 className="text-xl font-bold ml-2 mb-2">
                    {field.title}
                 </h2>
                </div>
                <div className="flex justify-between flex-wrap gap-2 w-full">
                 <ul className="list-disc">
                    <li className="text-gray-700 font-bold ml-12 mt-2">
                    {doctor?.[field.key] || ''}
                    </li>
                 </ul>
                </div>
              </div>
            ))}
        </div>
    </div>
</div>

        </div>
    );
}
