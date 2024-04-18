import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { baseUrl } from '../../utils/constants/Constants';
import HorizontalCard from './DoctorList/HorizontalCard';

const SpecialisationShow = () => {
 const { specialization } = useParams();
 const [doctors, setDoctors] = useState([]);
 const [searchQuery, setSearchQuery] = useState("");

 const fetchUsers = async () => {
    const accessToken = localStorage.getItem("access");
    const query = searchQuery ? `?search=${searchQuery}` : '';
    const baseUrl = "http://127.0.0.1:8000/"; // Ensure this is correctly set
    const url = `${baseUrl}auth/doctors/specialization/${specialization}`;
    console.log('Request URL:', url); // Debugging line
    
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
        console.log('API Response:', response.data); // Debugging line
        const doctorsData = response.data.results.filter(doctor => doctor.approval_status !== "PENDING");
        console.log('Filtered Doctors:', doctorsData); // Debugging line
        setDoctors(doctorsData);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};


 useEffect(() => {
    fetchUsers();
 }, [searchQuery, specialization]);

 const handleSearch = (event) => {
    setSearchQuery(event.target.value);
 };

 return (
    <div className="flex flex-col md:flex-row">
      {/* Main Content Area */}
      <div className="flex-grow">
        <div className="max-w-screen-xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-center mb-8">List of Doctors</h1>
          <div className="relative mt-1 lg:w-64 xl:w-96">
            <input
              type="text"
              onChange={(e) => handleSearch(e.target.value)}
              id="users-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-blue-400 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search for users"
            />
          </div>
          {/* Doctor Cards */}
          <div className="grid grid-cols-1 gap-4">
            {doctors.map((doctor) => (
              <HorizontalCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </div>
    </div>
 );
};

export default SpecialisationShow;
