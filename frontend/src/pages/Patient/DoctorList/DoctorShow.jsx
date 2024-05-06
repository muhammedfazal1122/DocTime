import React, { useState, useEffect, useRef } from 'react';
import HorizontalCard from './HorizontalCard';
import axios from 'axios';
import { baseUrl } from '../../../utils/constants/Constants';
import {
 Card,
 Typography,
 List,
 ListItem,
 ListItemPrefix,
 Accordion,
 AccordionHeader,
 AccordionBody,
} from "@material-tailwind/react";
import { PresentationChartBarIcon, ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useParams } from 'react-router-dom';


const DoctorsPage = () => {
 const [doctors, setDoctors] = useState([]);
 const [filteredDoctors, setFilteredDoctors] = useState([]);
 const [specializationFilter, setSpecializationFilter] = useState([]);
 const [searchQuery, setSearchQuery] = useState("");
 const sidebarRef = useRef(null);
 const [open, setOpen] = React.useState(0);
 const { specialization } = useParams();
 console.log(specialization,'ppppppppppppppppaaaaaaaaaaaa');

 const filters = [
  

  {
    id: "specialization",
    name: "specialization",
    options: [
      { value: "cardiologist", label: "Cardiologist", checked: false },
      { value: "dermatologist", label: "Dermatologist", checked: false },
      { value: "neurologist", label: "Neurologist", checked: false },
      {
        value: "orthopedic-surgeon",
        label: "Orthopedic Surgeon",
        checked: false,
      },
      { value: "ophthalmologist", label: "Ophthalmologist", checked: false },
      {
        value: "gastroenterologist",
        label: "Gastroenterologist",
        checked: false,
      },
      { value: "endocrinologist", label: "Endocrinologist", checked: false },
      { value: "pulmonologist", label: "Pulmonologist", checked: false },
      { value: "nephrologist", label: "Nephrologist", checked: false },
      { value: "pediatrician", label: "Pediatrician", checked: false },
      { value: "psychiatrist", label: "Psychiatrist", checked: false },
      { value: "general", label: "General", checked: true },
      { value: "rheumatologist", label: "Rheumatologist", checked: false },
      { value: "hematologist", label: "Hematologist", checked: false },
      { value: "urologist", label: "Urologist", checked: false },
      { value: "otolaryngologist", label: "Otolaryngologist", checked: false },
      { value: "radiologist", label: "Radiologist", checked: false },
    ],
  },

];

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
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
 };

 useEffect(() => {
    if (specializationFilter.length > 0) {
      const specializationQuery = specializationFilter.join(',');
      fetchUsers(baseUrl + `auth/doctors/details/?specialization=${specializationQuery}`);
    } else {
      fetchUsers(baseUrl + `auth/doctors/details/?search=${searchQuery}`);
    }
 }, [searchQuery, specializationFilter]);

 const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
 };

 const handleSearch = (query) => {
    setSearchQuery(query);
 };

 const handleSpecializationChange = (event) => {
    const { value, checked } = event.target;
    setSpecializationFilter(prev => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter(item => item !== value);
      }
    });
 };

 function handleResize() {
    if (sidebarRef.current) {
      sidebarRef.current.style.height = `${window.innerHeight}px`;
    }
 }

 useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
 }, []);

 return (
    <div className="flex flex-col md:flex-row">
      {/* Specialization Filter Sidebar */}
      <div className="w-full md:w-64 p-4">
        <div
          ref={sidebarRef}
          className="w-full max-w-[20rem] p-2 shadow-2xl shadow-blue-gray-900/5 overflow-y-auto "
        >
          <Card className="w-full p-2">
            <div className="mb-2 p-8">
              <Typography variant="h5" color="blue-gray">
                Filter
              </Typography>
            </div>
            <List>
              <Accordion
                open={open === 1}
                icon={
                 <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                 />
                }
              >
                <ListItem className="p-0 " selected={open === 1}>
                 <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                    <ListItemPrefix>
                      <PresentationChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="mr-auto font-normal">
                      Specialization
                    </Typography>
                 </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                 <List className="p-0">
                    {filters[0].options.map((option) => (
                      <ListItem key={option.value}>
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={specializationFilter.includes(option.value)}
                          onChange={handleSpecializationChange}
                        />
                        {option.label}
                      </ListItem>
                    ))}
                 </List>
                </AccordionBody>
              </Accordion>
            </List>
          </Card>
        </div>
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
