import React from 'react'
import DocBlurCard from '../../Compounts/BlurCards/DocBlurCards';

const DocHome = () => {
  return (
    <div>
  <div className="relative w-full h-screen">
  <div className="relative w-full h-full">
      <img src="/src/assets/logo/90183689_SL-040820-29750-17.jpg" alt="" className="w-full h-full inset-0" />
      <div className="absolute inset-0 bg-black opacity-40"></div> {/* Dark overlay */}
  </div>
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center gap-4">
  <DocBlurCard/>

  </div>
  </div>
   
      </div>
  )
}

export default DocHome;