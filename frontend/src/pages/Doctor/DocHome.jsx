import React from 'react';
import DocBlurCard from '../../Compounts/BlurCards/DocBlurCards';
import FAQSection from '../Patient/FAQSection';
import logo from '../../../src/assets/logo/90183689_SL-040820-29750-17.jpg';

const DocHome = () => {
 return (
    <div className="relative w-full h-screen">
      <div className="relative w-full h-full">
        <img src={logo} alt="" className="w-full h-full inset-0" />
        <div className="absolute inset-0 bg-black opacity-40"></div> {/* Dark overlay */}
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center gap-4">
        <DocBlurCard className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5" />
      </div>
      {/* <FAQSection/> */}
    </div>
 );
}

export default DocHome;
