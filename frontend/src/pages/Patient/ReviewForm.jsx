import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ doctorId }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reviewData = {
            doctor: doctorId,
            email,
            message,
        };

        try {  
            const response = await axios.post('http://localhost:8000/reviews/create/', reviewData);
            
            // Handle success, e.g., show a success message or clear the form
            setEmail('');
            setMessage('');
        } catch (error) {
            console.error(error);
            // Handle error, e.g., show an error message
        }
    };

    return (
        <section className="bg-gray-100 text-gray-800 py-10 md:py-16 mb-110 ">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-center items-center md:items-start">
                    <div className="md:w-1/2 md:pr-4">
                        <h2 className="text-3xl md:text-4xl font-semibold mb-4 md:mb-6">Review</h2>
                        <p className="text-lg mb-4 md:mb-6">Leave us a feedback!</p>
                        <p className="text-base md:text-lg mb-6">
                            Please provide your valuable feedback and something something ...
                        </p>
                    </div>
                    <div className="md:w-1/2 md:pl-4">
                        <form onSubmit={handleSubmit} className="bg-gray-400 rounded-lg shadow-md p-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4"
                                required
                            />
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4 resize-none"
                                rows="4"
                                maxLength="300"
                                required
                            ></textarea>
                            <button
                                type="submit"
                                className="bg-yellow-300 text-black text-center mx-auto block w-full py-2 rounded-md hover:bg-yellow-400"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewForm;
