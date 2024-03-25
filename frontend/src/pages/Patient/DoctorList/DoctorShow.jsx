import React, { useState, useEffect } from 'react';
import MultiLevelSidebar from './MultiLevelSidebar';
import HorizontalCard from './HorizontalCard';
import axios from 'axios';
import { baseUrl } from '../../../utils/constants/Constants';

const DoctorsPage = () => {
 const [doctors, setDoctors] = useState([]);
 const [filteredDoctors, setFilteredDoctors] = useState([]);
 const [specializationFilter, setSpecializationFilter] = useState('');

 const fetchdata = async () => {
    try {
        const response = await axios.get(baseUrl+'auth/admin/doctor/list/');
        // Assuming the response structure is as you've shared
        const doctorsData = response.data.results;
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
};


 useEffect(() => {
    fetchdata();
 }, []);

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
