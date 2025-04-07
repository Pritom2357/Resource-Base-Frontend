import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SimilarResources({ resourceId, tags = [] }) {
  const [similarResources, setSimilarResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSimilarResources = async () => {
      if (!resourceId || !tags || tags.length === 0) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const tagString = Array.isArray(tags) ? tags.join(',') : tags;
        
        console.log("Fetching similar resources with tags:", tagString);
        
        const response = await fetch(
          `https://resource-base-backend-production.up.railway.app/api/resources/similar?resourceId=${resourceId}&tags=${tagString}`
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log("Similar resources data:", data);
          const filtered = Array.isArray(data) ? data.filter(item => item && item.id !== resourceId) : [];
          setSimilarResources(filtered.slice(0, 3)); 
        } else {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          setError(`Failed to fetch similar resources: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching similar resources:", error);
        setError(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarResources();
  }, [resourceId, tags]);

  if (error) {
    return null; // Don't show anything if there's an error
  }

  return (
    <div className="mt-8 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Similar Resources <span className="text-blue-600">({isLoading ? "..." : similarResources.length})</span>
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : similarResources.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {similarResources.map(resource => (
            <Link 
              key={resource.id} 
              to={`/resources/${resource.id}`}
              className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{resource.post_title}</h4>
                <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {resource.post_description && (
                    <div dangerouslySetInnerHTML={{
                      __html: resource.post_description.replace(/<[^>]+>/g, ' ').substring(0, 100) + '...'
                    }} />
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <div className="flex items-center mr-3">
                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    {resource.vote_count || 0} votes
                  </div>
                  <div className="flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {resource.view_count || 0} views
                  </div>
                </div>
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {resource.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="text-xs text-gray-500 px-1">+{resource.tags.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">No similar resources found</p>
        </div>
      )}
    </div>
  );
}

export default SimilarResources;