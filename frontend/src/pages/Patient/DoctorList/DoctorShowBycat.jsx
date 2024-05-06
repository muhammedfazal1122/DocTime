import React, { useState, useEffect, useRef } from 'react';
import HorizontalCard from './HorizontalCard';
import axios from 'axios';
import { baseUrl } from '../../../utils/constants/Constants';
import { useParams } from 'react-router-dom';

const DoctorShowBycat = () => {
 const [doctors, setDoctors] = useState([]);
 const { specialization } = useParams();
console.log(specialization);
 useEffect(() => {
    const fetchDoctors = async () => {
      
      try {
        const accessToken = localStorage.getItem("access");
        console.log(accessToken);
        const response = await axios.get(`${baseUrl}auth/doctors/details/?specialization=${specialization}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        });
        const doctorsData = response.data.results.filter(doctor => doctor.approval_status !== "PENDING");
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
 }, [specialization]);

 return (
    <div className="flex flex-col md:flex-row">
      {/* Main Content Area */}
      <div className="flex-grow">
        <div className="max-w-screen-xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-center mb-8">List of Doctors</h1>
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

export default DoctorShowBycat;
