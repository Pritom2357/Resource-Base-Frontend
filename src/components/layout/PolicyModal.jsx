import React, { useEffect, useRef } from 'react';

function PolicyModal({ isOpen, onClose, title, content }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => { document.body.style.overflow = 'auto' };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900 opacity-50" onClick={onClose}></div>
      <div 
        ref={modalRef} 
        className="relative z-10 bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden transform transition-all"
      >
        {/* Header with title and close button */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Scrollable content area */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="prose prose-blue max-w-none">
            {content}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PolicyModal;