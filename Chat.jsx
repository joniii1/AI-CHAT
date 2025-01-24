import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Check if the input is for image generation
      if (input.toLowerCase().startsWith('image:')) {
        const query = input.slice(6).trim(); // Extract the query
        const imageResponse = await fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=YOUR_UNSPLASH_API_KEY`);
        
        if (!imageResponse.ok) {
          throw new Error('Image API response was not ok');
        }

        const imageData = await imageResponse.json();
        const imageUrl = imageData.urls.small;

        setMessages(prev => [...prev, { role: 'assistant', content: `Here is your image: ![Image](${imageUrl})` }]);
      } else {
        // Handle regular chat messages
        const lastFewMessages = messages.slice(-3)
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n');

        const response = await fetch(
          'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: `<|system|>You are a helpful AI assistant. Respond directly to the user's question without generating unrelated content. Keep responses concise and focused on the user's needs. Do not include previous messages in your response.</s>
                      <|user|>Recent context:\n${lastFewMessages}\n\nCurrent message: ${input}</s>
                      <|assistant|>`,
              parameters: {
                max_new_tokens: 5000,
                temperature: 0.2,
                top_p: 0.9,
                do_sample: true,
                return_full_text: false
              }
            }),
          }
        );

        if (!response.ok) {
          throw new Error('API response was not ok');
        }

        const data = await response.json();
        
        let aiResponse = '';
        
        if (Array.isArray(data)) {
          aiResponse = data[0]?.generated_text;
        } else if (typeof data === 'string') {
          aiResponse = data;
        } else if (data.generated_text) {
          aiResponse = data.generated_text;
        }

        aiResponse = aiResponse
          ?.replace(/<\|system\|>|<\|user\|>|<\|assistant\|>|<\/s>/g, '')
          ?.replace(/^[^a-zA-Z0-9]*/, '')
          ?.trim();

        if (!aiResponse) {
          aiResponse = "Hi! How can I help you today?";
        }

        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: aiResponse
        }]);
      }
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble right now. Could you try again?"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-white text-center">Jon's AI Assistant</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-40 0 mt-10">
            <p className="text-lg text-white">👋 Welcome! Send a message to start chatting.</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              } shadow-lg text-justify`}
            >
              <ReactMarkdown className="text-sm sm:text-base prose prose-invert">
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-200 rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-700 bg-gray-800 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-700 text-white rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <PaperAirplaneIcon className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;