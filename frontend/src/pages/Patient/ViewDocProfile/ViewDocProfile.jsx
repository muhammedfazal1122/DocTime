import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../utils/constants/Constants';
import { useNavigate, useParams } from "react-router-dom";
import { BeakerIcon } from "@heroicons/react/24/solid";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { BriefcaseIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/solid";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

export default function ViewDocProfile() {
    const { id } = useParams(); // Extract the doctor's ID from the URL

    const [doctor, setDoctor] = useState(null); // Use a single doctor object instead of an array
  const navigate = useNavigate()
    const gotoBookAppoiment = () =>{
      console.log(doctor.id);
      navigate(`/DoctorShow/BookAppoiment/${doctor.doctor_user.custom_id}`);

    }

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

    // Only create doctorDetails if doctor is not null
    const doctorDetails = doctor ? {
        specialization: doctor.doctor_user.specializations,
        education: doctor.doctor_user.education,
        experience: doctor.doctor_user.experience,
        timing: doctor.doctor_user.consultation_time,
        bookingFees: `₹ ${parseInt(doctor.doctor_user.consultaion_fees).toLocaleString("en-IN", {
          maximumFractionDigits: 0,
        })}`,
    } : null;

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
                <label onClick={gotoBookAppoiment} className="bg-blue-700 px-4 py-1 text-slate-50 rounded-md z-10 hover:scale-125 transition-all duration-500 hover:bg-blue-500" >Book Now</label>
            </div>
{/* About Me Card */}
<div className="col-span-full md:col-span-1   mr-[20px]">
    <div className="bg-white shadow rounded-lg p-4 max-w-[950px] mx-auto"> {/* Increase the width of the card */}
        <h2 className="text-xl font-bold mb-2">About Me</h2> {/* Reduced margin-bottom */}
        <p className="text-gray-700">
           {doctor?.doctor_user?.about_me || ''}
        </p>


        <h3 className="font-semibold text-center pt-16 ">
                Find me on
              </h3>
              <div className="flex justify-center items-center gap-6 my-6">
                <a
                  className="text-gray-700 hover:text-orange-600"
                  aria-label="Visit TrendyMinds LinkedIn"
                  href=""
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="h-6"
                  >
                    <path
                      fill="currentColor"
                      d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                    ></path>
                  </svg>
                </a>
                <a
                  className="text-gray-700 hover:text-orange-600"
                  aria-label="Visit TrendyMinds YouTube"
                  href=""
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    className="h-6"
                  >
                    <path
                      fill="currentColor"
                      d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
                    ></path>
                  </svg>
                </a>
                <a
                  className="text-gray-700 hover:text-orange-600"
                  aria-label="Visit TrendyMinds Facebook"
                  href=""
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    className="h-6"
                  >
                    <path
                      fill="currentColor"
                      d="m279.14 288 14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                    ></path>
                  </svg>
                </a>
                <a
                  className="text-gray-700 hover:text-orange-600"
                  aria-label="Visit TrendyMinds Instagram"
                  href=""
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="h-6"
                  >
                    <path
                      fill="currentColor"
                      d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                    ></path>
                  </svg>
                </a>
                <a
                  className="text-gray-700 hover:text-orange-600"
                  aria-label="Visit TrendyMinds Twitter"
                  href=""
                  target="_blank"
                >
                  <svg
                    className="h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                    ></path>
                  </svg>
                </a>
              </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8"> {/* Adjusted grid layout */}
            {/* Add more sections as needed */}
            {doctorDetails && fields.map((field, index) => (
                <div
                    key={index}
                    className="mb-1 sm:w-full md:w-full lg:w-full xl:w-full px-2"
                >
                    <div className="flex items-center">
                        {field.icon} {/* Correctly rendering the icon */}
                        <h2 className="text-xl font-bold ml-2 mb-1">
                            {field.title}
                        </h2>
                    </div>
                    <div className="flex justify-between flex-wrap gap-1 w-full">
                        <ul className="list-disc">
                            <li className="text-gray-700 font-bold ml-12 mt-1">
                                {doctorDetails[field.key] || ''}
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
