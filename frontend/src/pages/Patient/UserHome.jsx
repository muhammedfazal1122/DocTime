import React from 'react';
import BlurCard from '../../Compounts/Cards/BlurCards';

const UserHome = () => {
 return (
<div className="relative w-full h-screen">
 <div className="relative w-full h-full">
    <img src="src/assets/logo/doctor-offering-medical-teleconsultation.jpg" alt="" className="w-full h-full inset-0" />
    <div className="absolute inset-0 bg-black opacity-40"></div> {/* Dark overlay */}
 </div>
 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center gap-4">
    <BlurCard/>
 </div>
</div>

 );
}

export default UserHome;
