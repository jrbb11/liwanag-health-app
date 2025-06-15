import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { hospitals } from '../data/hospitals';
import { procedures } from '../data/procedures';

export default function CostEstimator() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('CostEstimator mounted');
    const params = new URLSearchParams(location.search);
    const hospitalId = params.get('hospitalId');
    const procedureId = params.get('procedureId');

    if (hospitalId && procedureId) {
      const hospital = hospitals.find(h => h.id === parseInt(hospitalId));
      const procedure = procedures.find(p => p.id === parseInt(procedureId));
      
      if (hospital && procedure) {
        setSelectedHospital(hospital);
        setSelectedProcedure(procedure);
        fetchEstimate(hospital, procedure);
      }
    }
  }, [location]);

  const fetchEstimate = async (hospital, procedure) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const baseCost = procedure.baseCost[hospital.type];
      const additionalFees = procedure.additionalFees.reduce((sum, fee) => sum + fee.cost, 0);
      const totalCost = baseCost + additionalFees;
      const philhealthCoverage = hospital.philhealth === 'accredited' ? procedure.philhealthCoverage : 0;
      const outOfPocket = totalCost - philhealthCoverage;

      setEstimate({
        baseCost,
        additionalFees,
        totalCost,
        philhealthCoverage,
        outOfPocket,
        additionalFeesBreakdown: procedure.additionalFees
      });
    } catch (err) {
      setError('Failed to calculate estimate. Please try again.');
      console.error('Error calculating estimate:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    if (selectedProcedure) {
      fetchEstimate(hospital, selectedProcedure);
    }
  };

  const handleProcedureSelect = (procedure) => {
    setSelectedProcedure(procedure);
    if (selectedHospital) {
      fetchEstimate(selectedHospital, procedure);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Calculating your estimate...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-red-600 hover:text-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cost Estimate</h2>
            
            {/* Hospital Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Hospital</h3>
              <div className="grid grid-cols-1 gap-4">
                {hospitals.map((hospital) => (
                  <button
                    key={hospital.id}
                    onClick={() => handleHospitalSelect(hospital)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedHospital?.id === hospital.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{hospital.name}</h4>
                        <p className="text-sm text-gray-500">{hospital.location}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        hospital.type === 'public' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {hospital.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Procedure Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Procedure</h3>
              <div className="grid grid-cols-1 gap-4">
                {procedures.map((procedure) => (
                  <button
                    key={procedure.id}
                    onClick={() => handleProcedureSelect(procedure)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedProcedure?.id === procedure.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{procedure.name}</h4>
                        <p className="text-sm text-gray-500">{procedure.description}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        {procedure.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Estimate Display */}
            {estimate && (
              <div className="mt-8 border-t pt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estimated Costs</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Cost</span>
                    <span className="font-medium">₱{estimate.baseCost.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Fees</h4>
                    {estimate.additionalFeesBreakdown.map((fee, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{fee.name}</span>
                        <span>₱{fee.cost.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Cost</span>
                      <span className="font-medium">₱{estimate.totalCost.toLocaleString()}</span>
                    </div>
                    
                    {selectedHospital?.philhealth === 'accredited' && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>PhilHealth Coverage</span>
                        <span>-₱{estimate.philhealthCoverage.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center font-bold text-lg mt-2">
                      <span>Out of Pocket</span>
                      <span>₱{estimate.outOfPocket.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 