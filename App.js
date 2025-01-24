import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AIPage from './pages/AIPage';
import Chat from './components/Chat';
import ImageGeneration from './pages/ImageGeneration'; // Import the new component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/ai" element={<AIPage />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/image" element={<ImageGeneration />} /> {/* Route for image generation */}
                <Route path="/" element={<AIPage />} /> {/* Default route */}
            </Routes>
        </Router>
    );
}

export default App;