import React, { useState, useEffect } from 'react';
import MultiLevelSidebar from './MultiLevelSidebar';
import HorizontalCard from './HorizontalCard';
import axios from 'axios';
import { baseUrl } from '../../../utils/constants/Constants';

const DoctorsPage = () => {
 const [doctors, setDoctors] = useState([]);
 const [filteredDoctors, setFilteredDoctors] = useState([]);
 const [specializationFilter, setSpecializationFilter] = useState('');
 const [searchQuery, setSearchQuery] = useState("");



  // to fetch the data as per the search query
  const fetchUsers = async (url) => {
    const accessToken = localStorage.getItem("access");
    try {
       const response = await axios.get(url, {
         headers: {
           Authorization: `Bearer ${accessToken}`,
           Accept: 'application/json',
           'Content-Type': 'application/json',
         }
       });
       const doctorsData = response.data.results.filter(doctor => doctor.approval_status !== "PENDING");
       console.log(response.data.results,'oooooooooooooooooooo');
       setFilteredDoctors(doctorsData);
    } catch (error) {
       console.error('Error fetching users:', error);
       // Handle the error appropriately, e.g., show an error message to the user
    }
   };
   

const handleSearch = (query) => {
  setSearchQuery(query);
  fetchUsers(baseUrl + `auth/doctors/details/?search=${query}`);
};


 useEffect(() => {
  fetchUsers(baseUrl + `auth/doctors/details/?search=${searchQuery}`);

  fetchUsers();
 }, [searchQuery]);

 const handleSpecializationChange = (event) => {
    const selectedSpecialization = event.target.value;
    setSpecializationFilter(selectedSpecialization);

    if (selectedSpecialization === '') {
      setFilteredDoctors(doctors); // Reset filter to show all doctors
    } else {
      const filtered = doctors.filter((doctor) =>
        doctor.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
 };

 return (
  <div className="flex flex-col md:flex-row">
     {/* Specialization Filter Sidebar */}
     <div className="w-full md:w-64 p-4">
       <MultiLevelSidebar />
     </div>
 
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
           {filteredDoctors.map((doctor) => (
             <HorizontalCard key={doctor.id} doctor={doctor} />
           ))}
         </div>
       </div>
     </div>
  </div>
 );
 
};

export default DoctorsPage;
