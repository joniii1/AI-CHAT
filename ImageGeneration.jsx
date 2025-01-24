import React, { useState } from 'react';
import axios from 'axios';

const ImageGeneration = () => {
    const [input, setInput] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post('https://api.picogen.com/v1/generate', {
                prompt: input,
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_PICOGEN_API_KEY}`, // Use the Picogen API key
                },
            });

            if (response.data && response.data.image_url) {
                setImageUrl(response.data.image_url); // Get the generated image URL
            } else {
                setError('No image generated.');
            }
        } catch (err) {
            console.error('Error:', err.response ? err.response.data : err.message);
            setError('Image generation failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-800 to-gray-900">
            <h1 className="text-4xl font-bold text-white mb-10">Jon's Image Generation</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-gray-700 text-white rounded-lg px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a prompt for the image..."
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                >
                    Generate Image
                </button>
            </form>
            {isLoading && <p className="text-white mt-4">Generating image...</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {imageUrl && (
                <div className="mt-4">
                    <img src={imageUrl} alt="Generated" className="rounded-lg max-w-full h-auto" />
                </div>
            )}
        </div>
    );
};

export default ImageGeneration;