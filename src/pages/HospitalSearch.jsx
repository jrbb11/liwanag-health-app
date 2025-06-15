import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { Search, MapPin, Phone, Building2 } from 'lucide-react';

export default function HospitalSearch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('hospitals')
          .select('*');
        if (error) throw error;
        setHospitals(data || []);
      } catch (err) {
        setError('Failed to load hospitals.');
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const cities = ['all', ...Array.from(new Set(hospitals.map(h => h.city).filter(Boolean)))];
  const types = ['all', ...Array.from(new Set(hospitals.map(h => h.public_or_private).filter(Boolean)))];

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch =
      (hospital.name && hospital.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (hospital.city && hospital.city.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = selectedCity === 'all' || hospital.city === selectedCity;
    const matchesType = selectedType === 'all' || hospital.public_or_private === selectedType;
    return matchesSearch && matchesCity && matchesType;
  });

  const handleHospitalSelect = (hospital) => {
    navigate(`/estimate?hospitalId=${hospital.id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-blue-100 py-8 px-2">
      <div className="w-full max-w-7xl mx-auto rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-blue-100 p-8 flex flex-col relative">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Find a Hospital</h1>
          <p className="mt-4 text-lg text-gray-600">Search for hospitals in your area and compare costs</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 flex flex-col sm:flex-row sm:space-x-4 gap-4 items-center justify-center bg-white/70 rounded-2xl shadow p-6 border border-blue-100">
          <div className="flex-1 w-full max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-300" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hospitals by name or city..."
                className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-full leading-5 bg-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base shadow-sm"
              />
            </div>
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="block w-full sm:w-48 pl-3 pr-10 py-3 text-base border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-full bg-white shadow-sm text-blue-700"
          >
            {cities.map(city => (
              <option key={city} value={city}>
                {city === 'all' ? 'All Cities' : city}
              </option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="block w-full sm:w-48 pl-3 pr-10 py-3 text-base border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-full bg-white shadow-sm text-blue-700"
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown')}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-blue-400 text-lg font-semibold animate-pulse">Loading hospitals...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-red-500 text-lg font-semibold">{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHospitals.map((hospital) => (
              <button
                key={hospital.id}
                onClick={() => handleHospitalSelect(hospital)}
                className="bg-white/90 overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl hover:-translate-y-1 hover:ring-2 hover:ring-blue-200 transition-all duration-200 text-left border border-blue-100 group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-500 transition-colors duration-150">{hospital.name || 'N/A'}</h3>
                    <span className={`px-3 py-1 text-xs rounded-full font-semibold shadow-sm border ${
                      hospital.public_or_private === 'Public' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {hospital.public_or_private ? hospital.public_or_private : 'Unknown'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-blue-200 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm text-blue-700 font-medium">{hospital.city || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-blue-200" />
                      <p className="ml-3 text-sm text-blue-700">{hospital.contact || 'N/A'}</p>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-blue-200" />
                      <p className={`ml-3 text-sm font-semibold ${hospital.philhealth_accredited ? 'text-green-600' : 'text-blue-600'}`}>
                        PhilHealth {hospital.philhealth_accredited ? 'Accredited' : 'Not Accredited'}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {filteredHospitals.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-blue-400">No hospitals found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 