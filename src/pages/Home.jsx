import { Link } from 'react-router-dom';
import { Search, Hospital, Calculator, MessageSquare } from 'lucide-react';

function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Estimate Your Healthcare Costs with Confidence
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get accurate cost estimates for medical procedures across Philippine hospitals. 
          Make informed healthcare decisions with our comprehensive database.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/hospitals" 
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Find Hospitals
          </Link>
          <Link 
            to="/procedures" 
            className="bg-white text-emerald-600 border border-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
          >
            Browse Procedures
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Search className="h-12 w-12 text-emerald-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
          <p className="text-gray-600">
            Find hospitals and procedures quickly with our intelligent search system.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Hospital className="h-12 w-12 text-emerald-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Hospital Directory</h3>
          <p className="text-gray-600">
            Comprehensive database of public and private hospitals across the Philippines.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Calculator className="h-12 w-12 text-emerald-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Cost Estimates</h3>
          <p className="text-gray-600">
            Get accurate cost ranges for various medical procedures and services.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <MessageSquare className="h-12 w-12 text-emerald-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
          <p className="text-gray-600">
            Get instant answers to your healthcare cost questions through our AI chat.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Estimate Your Healthcare Costs?
        </h2>
        <p className="text-gray-600 mb-6">
          Start your journey to transparent healthcare pricing today.
        </p>
        <Link 
          to="/estimate" 
          className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors inline-block"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}

export default Home; 