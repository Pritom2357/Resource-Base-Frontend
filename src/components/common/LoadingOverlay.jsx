import React from 'react';

const LoadingOverlay = ({ isVisible, message = "Loading...", theme = "primary" }) => {
  if (!isVisible) return null;
  
  const themeClasses = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-700 text-white",
    success: "bg-green-600 text-white"
  };
  
  return (
    <div className="fixed inset-0 bg-blue-900/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-opacity duration-300">
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4 text-center">
        <div className="relative mx-auto w-20 h-20 mb-6">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
          
          {/* Inner spinning element */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
          
          {/* Central logo or icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-medium text-gray-900 mb-2">{message}</h3>
        <p className="text-gray-600">Please wait while we process your request...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;