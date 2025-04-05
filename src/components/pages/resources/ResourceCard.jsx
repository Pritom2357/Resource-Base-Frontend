import React from 'react';
import { Link } from 'react-router-dom';

function ResourceCard({ resource }) {
  // console.log(resource);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Card Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to={`/search?category=${encodeURIComponent(resource.category_id)}`} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full hover:bg-blue-200">
            {resource.category_name || 'Uncategorized'}
          </Link>
          <span className="text-gray-500 text-xs">
            {new Date(resource.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric' 
            })}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          by {resource.author_username}
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-5">
        <Link 
          to={`/resources/${resource.id}`}
          className="block mb-2 text-xl font-semibold text-blue-700 hover:text-blue-900 transition-colors"
        >
          {resource.post_title}
        </Link>
        
        {resource.post_description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {resource.post_description}
          </p>
        )}
        
        {/* Resource Stats */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span className="text-gray-600 text-sm">{resource.vote_count || 0}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 text-sm">{resource.comment_count || 0}</span>
            </div>
          </div>
          
          <Link 
            to={`/resources/${resource.id}`} 
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            View
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Card Footer - Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <Link
                key={index}
                to={`/tags/${tag}`}
                className="text-xs text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-md hover:bg-gray-100 hover:text-blue-700 transition-colors"
              >
                #{tag}
              </Link>
            ))}
            {resource.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-0.5">
                +{resource.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceCard;