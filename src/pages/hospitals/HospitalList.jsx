import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [type, setType] = useState('');
  const [philHealthOnly, setPhilHealthOnly] = useState(false);

  useEffect(() => {
    const fetchHospitals = async () => {
      const { data, error } = await supabase.from('hospitals').select('*');
      if (!error) {
        setHospitals(data);
        setFiltered(data);
      } else {
        console.error('Error fetching hospitals:', error.message);
      }
    };
    fetchHospitals();
  }, []);

  useEffect(() => {
    const filtered = hospitals.filter(h => {
      const matchesName = h.name.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = region ? h.region === region : true;
      const matchesType = type ? h.public_or_private === type : true;
      const matchesPhilHealth = philHealthOnly ? h.philhealth_accredited === true : true;
      return matchesName && matchesRegion && matchesType && matchesPhilHealth;
    });
    setFiltered(filtered);
  }, [search, region, type, philHealthOnly, hospitals]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Hospital Finder</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search hospital name"
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="border p-2 rounded" onChange={(e) => setRegion(e.target.value)}>
          <option value="">All Regions</option>
          {[...new Set(hospitals.map(h => h.region))].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select className="border p-2 rounded" onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={philHealthOnly}
            onChange={() => setPhilHealthOnly(!philHealthOnly)}
          />
          <span>PhilHealth Only</span>
        </label>
      </div>

      <ul className="space-y-4">
        {filtered.map(hospital => (
          <li key={hospital.id} className="border p-4 rounded shadow-sm bg-white">
            <h3 className="font-semibold text-lg">{hospital.name}</h3>
            <p className="text-sm text-gray-600">{hospital.city}, {hospital.region}</p>
            <p className="text-sm">
              Type: {hospital.public_or_private} | Level: {hospital.hospital_level} | PhilHealth: {hospital.philhealth_accredited ? '✅' : '❌'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HospitalList;
