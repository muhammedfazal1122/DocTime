import React from 'react';
import './BlurCard.css'

const BlurCard = () => {
 return (
    <div className="cards">
      <div className="card red">
        <p className="tip">Book your appointment.</p>
        <p className="second-text">Book an appointment for an in-clinic consultation</p>
      </div>
      <div className="card blue">
        <p className="tip">Instant Video Consultation</p>
        <p className="second-text">Connect within 60 secs</p>
      </div>
      <div className="card green">
        <p className="tip">Find Your Doctor</p>
        <p className="second-text">Find The Best One</p>
      </div>
    </div>
 );
};

export default BlurCard;
