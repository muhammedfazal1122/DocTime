import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../utils/constants/Constants';
import { Rating } from "@material-tailwind/react";
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
 

const ReviewFormForDr = ({ doctorId ,transaction_id}) => {
    const [subject, setSubject] = useState('');
    const [comment, setComment] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [rating, setRating] = useState(0); // State for rating
    const [id, setId] = useState(null);
    const [patientID, setPatientID] = useState(null) 


    const fetchPatientCustomId =async ()=>{
        try {
          const refreshToken = localStorage.getItem("refresh");
          console.log(refreshToken, "nooooooooooooo");
      
          let decoded = jwtDecode(refreshToken);
          console.log(decoded, "hfhhhhhhhhhhhhhhhhhhhhhhhh");
          let id = decoded.user_id;
          setId(id);
          console.log(id,'iiiiiiiiiiiiiiiiiiddddddddddddddddddddd');
      
          const doct = await axios.get(`${baseUrl}auth/patient/list/${id}`);
          // http://localhost:8000/auth/patient/list/5f7876fe-6907-4386-94e0-2bfe2c5faeb2
          if (doct.status === 200) {
            const CustomId = doct.data.patient_user.custom_id
      
            setPatientID(CustomId);
      
            console.log('custom_id=======',patientID);
            console.log('custom_id=======',doct.data.patient_user.custom_id);
      
      
          }
        } catch (error) {
          console.log("error in iiiiiiiiiiiiiiiiiiddddddddddddddddddddd custom_id");
        }
       
      } 
      


    // Fetch doctor's reviews and rating on component mount
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${baseUrl}appointment/reviews/${doctorId}/`);
                setReviews(response.data.results);
                console.log(response.data.results,'rrrrrrrreeeeeeesssssssssssssss');
                setAverageRating(response.data.averageRating);
            } catch (error) {
                console.error(error);
                // Handle error, e.g., show an error comment
            }
        };

        fetchPatientCustomId();
        fetchReviews();
    }, [doctorId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!transaction_id) {
            toast.error("You have to consult this doctor at least once! ")
            // Show toast or alert indicating no transaction ID
            return;
          }
          
          const reviewData = {
            doctor: doctorId,
            patient: patientID,
            subject:subject,
            comment: comment,
            rating: rating, // Include rating in the review data
        };

        try {
            const response = await axios.post(`${baseUrl}appointment/reviews/create/`, reviewData);
            console.log(response.data);
            // Handle success, e.g., show a success message or clear the form
            setSubject('');
            setComment('');
            setRating(0); // Reset rating after submission
            // Update reviews after submitting a new review
            setReviews([...reviews, response.data]);
        } catch (error) {
            console.error(error);
            // Handle error, e.g., show an error message
        }
    };

    return (
        <section className="bg-gray-100 text-gray-800 py-10 md:py-16 mb-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-center items-center md:items-start">
                    <div className="md:w-1/2 md:pr-4">
                        <h2 className="text-3xl md:text-4xl font-semibold mb-4 md:mb-6">Doctor's Stories</h2>
                        {/* Display doctor's reviews */}
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review.id} className="bg-white rounded-lg shadow-md mb-4 p-4">
                                    <p className="font-bold">{review.patient_full_name}</p>
                                    <p className="text-xl mb-2 mt-2 font-serif">{review.subject}</p>
                                    <p className="text-sm mb-2">{review.comment}</p>
                                    <div className="flex items-center">
                                        <span className="text-sm mr-2">Rating:</span>
                                        <span className="text-yellow-400">
                                            
                                            {Array.from({ length: review.rating }, (_, index) => (
                                            <svg
                                            key={index}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            className="w-5 h-5 inline-block"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M11.296 2.392l1.748 4.782 5.37.024c.94.004 1.33 1.285.608 1.91l-4.36 3.624 1.24 5.72c.216.996-.792 1.788-1.622 1.196L12 17.054l-5.723 3.49c-.83.595-1.838-.2-1.622-1.196l1.24-5.72-4.36-3.624c-.722-.625-.332-1.906.608-1.91l5.37-.024 1.748-4.782c.29-.792 1.428-.792 1.718 0z"
                                            ></path>
                                        </svg>
                                        
                                        
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                    <div className="md:w-1/2 md:pl-4">
                        
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-300 text-black text-center mx-auto block w-full py-2 rounded-md hover:bg-blue-400"
                        >
                            {showForm ? 'Hide Form' : 'Post Review'}
                        </button>
                        {showForm && (
                         <form onSubmit={handleSubmit} className="bg-gray-400 rounded-lg shadow-md p-6 mt-4">
                         <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                         Subject
                         </label>
                         <input
                             type="text"
                             id="subject"
                             name="subject"
                             value={subject}
                             onChange={(e) => setSubject(e.target.value)}
                             className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4"
                             required
                         />
                         <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                             Message
                         </label>
                         <textarea
                             id="comment"
                             name="comment"
                             value={comment}
                             onChange={(e) => setComment(e.target.value)}
                             className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4 resize-none"
                             rows="4"
                             maxLength="300"
                             required
                         ></textarea>
                         <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                             Rating
                         </label>
                         <Rating
                             value={rating}
                             onChange={(value) => setRating(value)}
                             className="mb-4"
                         />
                         <button
                             type="submit"
                             className="bg-yellow-300 text-black text-center mx-auto block w-full py-2 rounded-md hover:bg-yellow-400"
                         >
                             Submit
                         </button>
                     </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewFormForDr;
