import React from 'react';
import dentist from '../../../../public/assets/catogory/dentist.jpg';
import General from '../../../../public/assets/catogory/general.jpg';
import Gynecologist2 from '../../../../public/assets/catogory/Gynecologist.jpg';
import Neurologist from '../../../../public/assets/catogory/neurologist.jpg';

const DoctorCatogoryList = () => {
  const cards = [
    {
      title: 'Dentist',
      imageUrl: dentist,
    },
    {
      title: 'General',
      imageUrl: General,
    },
    {
      title: 'Gynecologist',
      imageUrl: Gynecologist2,
    },
    {
      title: 'Neurologist',
      imageUrl: Neurologist,
    },
    {
      title: 'Neurologist',
      imageUrl: Neurologist,
    },
    {
      title: 'Neurologist',
      imageUrl: Neurologist,
    },
    {
      title: 'Neurologist',
      imageUrl: Neurologist,
    },
    // Add more card objects here if needed
  ];

  return (
    <div className="relative mt-4 bg-slate-300 bottom-12">
      {/* Container with custom styles to enable horizontal scrolling */}
      <div className="mt-5 max-w-screen-xl mx-auto flex flex-wrap justify-start gap-4 p-4 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {cards.map((card, index) => (
          <div key={index} className="s-static__card w-full sm:w-48 h-48 transform hover:scale-105 transition-transform duration-200 overflow-hidden">
            <div className="card card--180 p-8 text-center m-2">
              <a href={card.consultUrl} aria-label={card.title} className="card-link" previewlistener="true">
                <div className="card__img--120x120">
                  <a href={card.consultUrl} tabIndex="-1" previewlistener="true">
                    <span className="LazyLoad is-visible">
                      <img src={card.imageUrl} alt={card.title} className="card_img" />
                    </span>
                  </a>
                </div>
                <div className="text-black text-sm font-bold mt-3">{card.title}</div>
                <div className="mt-2 text-xs uppercase text-blue-600 font-bold">CONSULT NOW</div>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorCatogoryList;
