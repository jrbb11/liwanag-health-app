import { Link } from 'react-router-dom';
import { Hospital, Stethoscope, Calculator, MessageSquare } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Hospital className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-800">Liwanag Health</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/hospitals" className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600">
              <Hospital className="h-5 w-5" />
              <span>Hospitals</span>
            </Link>
            <Link to="/procedures" className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600">
              <Stethoscope className="h-5 w-5" />
              <span>Procedures</span>
            </Link>
            <Link to="/estimate" className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600">
              <Calculator className="h-5 w-5" />
              <span>Estimate</span>
            </Link>
            <Link to="/chat" className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600">
              <MessageSquare className="h-5 w-5" />
              <span>AI Chat</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 