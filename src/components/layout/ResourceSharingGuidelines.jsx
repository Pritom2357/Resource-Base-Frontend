import React, { useState } from 'react';

function ResourceSharingGuidelines() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
      <div 
        className="flex justify-between items-center px-5 py-4 cursor-pointer bg-gradient-to-r from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <h3 className="font-semibold text-blue-800">Resource Sharing Guidelines</h3>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 text-blue-600 transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      {isExpanded && (
        <div className="px-5 py-4 text-sm text-blue-800 space-y-3">
          <p className="font-semibold">Please follow these guidelines when sharing resources:</p>
          
          <ul className="list-disc ml-5 space-y-2">
            <li><span className="font-medium">Respect copyright:</span> Only share resources that you have permission to share or are freely available.</li>
            <li><span className="font-medium">Verify information:</span> Make sure the resources you're sharing contain accurate and up-to-date information.</li>
            <li><span className="font-medium">Check for malware:</span> Ensure the links you're sharing are safe and do not contain malicious content.</li>
            <li><span className="font-medium">Be descriptive:</span> Provide clear titles and descriptions to help others understand the value of your resources.</li>
            <li><span className="font-medium">Use appropriate tags:</span> Add relevant tags to make your resources discoverable to the right audience.</li>
            <li><span className="font-medium">Avoid duplicate content:</span> Check if similar resources already exist before sharing.</li>
            <li><span className="font-medium">Protect privacy:</span> Don't share resources that contain personal or sensitive information without consent.</li>
          </ul>
          
          <p className="italic">By submitting resources, you confirm that you've followed these guidelines and that your submission complies with our <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>.</p>
        </div>
      )}
    </div>
  );
}

export default ResourceSharingGuidelines;