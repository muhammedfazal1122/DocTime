import React, { useState } from 'react';
import faqImage from '../../../src/assets/FAQ1.jpg';

const FAQSection = () => {
 const [isOpen, setIsOpen] = useState([false, false, false]);

 const toggleAnswer = (index) => {
    setIsOpen((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
 };

 const faqData = [
    {
      question: 'How can I book an appointment?',
      answer: [
        'You have to click the "Search Doctors" button.',
        'Select the doctor in your location.',
        'Book the slot on the website.',
      ],
    },
    {
      question: 'Are all your professionals medically trained?',
      answer: [
        'We have certified, registered, and experienced professionals including:',
        '- Doctors',
        '- Nurses',
        '- Physiotherapists',
        '- Occupational therapists',
        '- Speech and swallow therapists',
        '- Respiratory therapists',
        '- Dietitians',
        '- Psychologists',
      ],
    },
    {
      question: 'How can I contact you?',
      answer: ['For any queries, please contact us at 9633244022.'],
    },
 ];

 return (
  <section className="py-6 bg-gray-50 sm:py-16 lg:py-24">
     <div className="flex flex-col md:flex-row items-center justify-center flex-wrap">
       {/* FAQ Section */}
       <div className="w-full md:w-2/3 px-2">
         <div className="max-w-2xl mx-auto text-center">
           <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
             Frequently Asked Questions
           </h2>
         </div>
         <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
           {faqData.map((faq, index) => (
             <div
               key={index}
               className="transition-all duration-200 bg-white border border-gray-200 shadow-lg cursor-pointer hover:bg-gray-50"
             >
               <button
                 type="button"
                 onClick={() => toggleAnswer(index)}
                 className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
               >
                 <span className="flex text-lg font-semibold text-black">
                  {faq.question}
                 </span>
                 <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-6 h-6 text-gray-400 ${isOpen[index] && 'transform rotate-180'}`}
                 >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     d="M19 9l-7 7-7-7"
                  ></path>
                 </svg>
               </button>
               <div
                 style={{ display: isOpen[index] ? 'block' : 'none' }}
                 className="px-4 pb-5 sm:px-6 sm:pb-6"
               >
                 <ul className="list-disc pl-6">
                  {faq.answer.map((item, idx) => (
                     <li key={idx}>{item}</li>
                   ))}
                 </ul>
               </div>
             </div>
           ))}
         </div>
         <p className="text-center text-gray-600 text-base mt-9">
           Still have questions?{' '}
           <span className="cursor-pointer font-medium text-tertiary transition-all duration-200 hover:text-tertiary focus:text-tertiary hover-underline">
             Contact our support
           </span>
         </p>
       </div>
 
       {/* Aside Image */}
      
     </div>
  </section>
 );
 
};

export default FAQSection;
