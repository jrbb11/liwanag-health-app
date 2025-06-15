import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HospitalSearch from './pages/HospitalSearch';
import ProcedureSearch from './pages/ProcedureSearch';
import CostEstimator from './pages/CostEstimator';
import AIChat from './pages/AIChat';
import TestConnection from './pages/TestConnection';
import ChatFloatingButton from './components/ChatFloatingButton';

function App() {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/hospitals" 
            element={
              <HospitalSearch 
                onSelectHospital={setSelectedHospital}
              />
            } 
          />
          <Route 
            path="/procedures" 
            element={
              <ProcedureSearch 
                onSelectProcedure={setSelectedProcedure}
              />
            } 
          />
          <Route 
            path="/estimate" 
            element={
              <CostEstimator 
                hospital={selectedHospital}
                procedure={selectedProcedure}
              />
            } 
          />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/test" element={<TestConnection />} />
        </Routes>
      </main>
      <ChatFloatingButton />
    </div>
  );
}

export default App;
