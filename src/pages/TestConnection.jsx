import { useState } from 'react';
import { testConnections } from '../lib/testConnection';

export default function TestConnection() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await testConnections();
      setTestResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Connection Tests</h2>
            
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Running Tests...' : 'Run Connection Tests'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {testResult && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Test Results</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-24 text-gray-600">Supabase:</span>
                      <span className={`font-medium ${
                        testResult.supabase === 'connected' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {testResult.supabase}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-gray-600">GPT:</span>
                      <span className={`font-medium ${
                        testResult.gpt === 'connected' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {testResult.gpt}
                      </span>
                    </div>
                  </div>
                </div>

                {testResult.gptResponse && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">GPT Response</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{testResult.gptResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 