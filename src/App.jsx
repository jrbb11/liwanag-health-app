import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AIChat from './pages/AIChat';
import ChatFloatingButton from './components/ChatFloatingButton';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<AIChat />} />
        </Routes>
      </main>
      <ChatFloatingButton />
    </div>
  );
}

export default App;
