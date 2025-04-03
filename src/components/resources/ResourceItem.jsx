import React, { useState, useEffect } from 'react'

function ResourceItem({resource, onChange, onRemove, showRemove, index}) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    if (resource.url && resource.url.trim().startsWith('http')) {
      fetchMetadata(resource.url);
    }
  }, [resource.url]);

  const fetchMetadata = async (url) => {
    if (!url.trim()) return;
    
    try {
      setIsLoading(true);
      console.log("Fetching metadata for:", url); // Debug log
      
      const response = await fetch(
        `https://resource-base-backend-production.up.railway.app/api/resources/extract-metadata?url=${encodeURIComponent(url)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("Metadata received:", data); // Debug log
        
        // Store the complete metadata object in the resource
        onChange('thumbnail_url', data.metadata.image || '');
        onChange('favicon_url', data.metadata.favicon || '');
        onChange('site_name', data.metadata.siteName || '');
        
        if (!resource.title && data.metadata.title) {
          onChange('title', data.metadata.title);
        }
        
        setPreviewData(data.metadata);
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='border border-gray-200 rounded-md p-4 bg-gray-50'>
      <div className='flex justify-between items-center mb-3'>
        <h3 className='font-medium text-gray-700'>
          Resource no. {index+1}
        </h3>
        {showRemove && (
          <button
            type='button'
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
            aria-label='Remove resource'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className='space-y-3'>
        <div>
          <label htmlFor={`resource-url-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            URL *
          </label>
          <div className="relative">
            <input
              type="url"
              id={`resource-url-${index}`}
              value={resource.url}
              onChange={(e) => onChange('url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="https://example.com"
              required={index === 0}
            />
            {isLoading && (
              <div className="absolute right-2 top-2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {previewData && (
          <div className="mt-2 border border-gray-200 rounded-md overflow-hidden bg-white">
            <div className="flex">
              <div className="w-1/4 min-w-[80px] max-w-[120px] bg-gray-100 flex items-center justify-center">
                {previewData.image ? (
                  <img 
                    src={previewData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      if (previewData.favicon) e.target.src = previewData.favicon;
                    }}
                  />
                ) : previewData.favicon ? (
                  <img 
                    src={previewData.favicon} 
                    alt="Site icon" 
                    className="w-8 h-8"
                  />
                ) : (
                  <div className="text-gray-400 text-xs text-center p-2">No preview</div>
                )}
              </div>
              
              <div className="flex-1 p-3 overflow-hidden">
                <div className="font-medium text-sm text-blue-700 line-clamp-2 mb-1">
                  {previewData.title || 'No title'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {previewData.siteName && (
                    <span className="mr-1">{previewData.siteName} •</span>
                  )}
                  {resource.url}
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor={`resource-title-${index}`} className='block text-sm font-medium text-gray-700 mb-1'>
            Title
          </label>
          <input
            type='text'
            id={`resource-title-${index}`}
            value={resource.title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Title of the resource"
            required={index === 0}
          />
        </div>

        <div>
          <label htmlFor={`resource-description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id={`resource-description-${index}`}
            value={resource.description}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Brief description of this resource"
            rows="2"
          />
        </div>
      </div>
    </div>
  );
}

export default ResourceItem