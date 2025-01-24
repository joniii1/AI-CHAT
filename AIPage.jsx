import React from 'react';
import { useNavigate } from 'react-router-dom';

const AIPage = () => {
    const navigate = useNavigate();

    const handleChatClick = () => {
        navigate('/chat'); 
    };

    const handleImageClick = () => {
        navigate('/image'); 
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-800 to-gray-900">
            <h1 className="text-4xl font-bold text-white mb-10">Jon's AI</h1>
            <div className="flex space-x-6">
                <button
                    onClick={handleChatClick}
                    className="bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105" // Added scale transition
                >
                    Open Chat
                </button>
                <button
                    onClick={handleImageClick}
                    className="bg-green-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105" // Added scale transition
                >
                    Generate Image
                </button>
            </div>
        </div>
    );
};

export default AIPage;