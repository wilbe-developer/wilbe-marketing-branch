
import React from 'react';

const FoundersStories = () => {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-lg font-medium text-gray-500 uppercase tracking-wide mb-8">FROM THE TRENCHES: THE LEADERS</h2>
          
          {/* Video content grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Conversations at the Crossroads */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src="/lovable-uploads/d2adef55-edba-455a-9952-2a1d35e7f7c7.png" 
                  alt="Conversations at the Crossroads"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-4 border-l-gray-800 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Conversations at the Crossroads: Navigating Technological and Societal Forces</h3>
                <p className="text-sm text-gray-600">Exploring the intersection of technology and society with industry leaders.</p>
              </div>
            </div>

            {/* The Entrepreneurial Mindset */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src="/lovable-uploads/ec58856d-e030-4ce2-806d-cc07bd376fe5.png" 
                  alt="The Entrepreneurial Mindset"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-4 border-l-gray-800 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">The Entrepreneurial Mindset: An Insider's Guide</h3>
                <p className="text-sm text-gray-600">Insights from successful entrepreneurs on building the right mindset.</p>
              </div>
            </div>

            {/* Building the Future of Science */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src="/lovable-uploads/fdf11930-f17c-4bb7-b2a1-91a164c453d3.png" 
                  alt="Building the Future of Science"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-4 border-l-gray-800 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Building the Future of Science: The Arcadia Way with Prachee Avasthi</h3>
                <p className="text-sm text-gray-600">Learn about innovative approaches to scientific research and development.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersStories;
