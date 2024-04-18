import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import dentist from '../../../../public/assets/catogory/dentist.jpg';
import General from '../../../../public/assets/catogory/general.jpg';
import Gynecologist2 from '../../../../public/assets/catogory/Gynecologist.jpg';
import Neurologist from '../../../../public/assets/catogory/neurologist.jpg';

const DoctorCatogoryList = () => {
 const cards = [
    {
      title: 'Dentist',
      imageUrl: dentist,
      specialization: 'dentist',
    },
    {
      title: 'General',
      imageUrl: General,
      specialization: 'general',
    },
    {
      title: 'Gynecologist',
      imageUrl: Gynecologist2,
      specialization: 'gynecologist',
    },
    {
      title: 'Neurologist',
      imageUrl: Neurologist,
      specialization: 'neurologist',
    },
    // Add more card objects here if needed
 ];

 
 return (
    <div className="relative  bg-slate-300 bottom-0 ">
      <div className="mt-5 max-w-screen-xl mx-auto flex flex-wrap justify-start gap-4 p-4 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {cards.map((card, index) => (
          <div key={index} className="s-static__card w-full sm:w-48 h-48 transform hover:scale-105 transition-transform duration-200 overflow-hidden">
            <div className="card card--180 p-8 text-center m-2">
              <Link to={`/DoctorShow/${card.specialization}`} aria-label={card.title} className="card-link" previewlistener="true">
                <div className="card__img--120x120">
                 <span className="LazyLoad is-visible">
                    <img src={card.imageUrl} alt={card.title} className="card_img" />
                 </span>
                </div>
                <div className="text-black text-sm font-bold mt-3">{card.title}</div>
                <div className="mt-2 text-xs uppercase text-blue-600 font-bold">CONSULT NOW</div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
 );
};

export default DoctorCatogoryList;
