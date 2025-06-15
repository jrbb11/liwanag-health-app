import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { procedures } from '../data/procedures';
import { Search, Stethoscope, DollarSign, Info } from 'lucide-react';

export default function ProcedureSearch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(procedures.map(p => p.category))];

  const filteredProcedures = procedures.filter(procedure => {
    const matchesSearch = procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         procedure.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || procedure.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProcedureSelect = (procedure) => {
    navigate(`/estimate?procedureId=${procedure.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Find a Medical Procedure
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Search for medical procedures and compare costs across hospitals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search procedures by name or description..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProcedures.map((procedure) => (
            <button
              key={procedure.id}
              onClick={() => handleProcedureSelect(procedure)}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 text-left"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{procedure.name}</h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                    {procedure.category}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-gray-400 mt-0.5" />
                    <p className="ml-3 text-sm text-gray-600">{procedure.description}</p>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">
                        Base Cost Range:
                      </p>
                      <p className="text-sm text-gray-500">
                        Public: ₱{procedure.baseCost.public.toLocaleString()} - 
                        Private: ₱{procedure.baseCost.private.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Stethoscope className="h-5 w-5 text-gray-400" />
                    <p className="ml-3 text-sm text-gray-600">
                      PhilHealth Coverage: ₱{procedure.philhealthCoverage.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredProcedures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No procedures found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 