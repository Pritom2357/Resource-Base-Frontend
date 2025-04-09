import React from 'react';
import { Link } from 'react-router-dom';

function ResourceCard({ resource }) {
  // console.log(resource);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Card Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="md:w-1/2 w-1/3 flex items-center space-x-2">
          <Link to={`/search?category=${encodeURIComponent(resource.category_id)}`} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full hover:bg-blue-200">
            {resource.category_name || 'Uncategorized'}
          </Link>
        </div>
        <div className="md:w-1/2 w-2/3 text-xs text-gray-500 text-end">
          Posted by <span className='text-red-400'>{resource.author_username}</span> on <span className='text-red-400'>{new Date(resource.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric' ,
              year: 'numeric'
            })}</span>
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
          <div className="text-gray-600 text-sm mb-4 line-clamp-2" dangerouslySetInnerHTML={{__html: resource.post_description}}/>
        )}
        
        {/* Resource Stats */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {/* Vote icon (up arrow) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 text-sm">{resource.vote_count || 0} votes</span>
            </div>
            <div className="flex items-center">
              {/* Comment icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 text-sm">{resource.comment_count || 0}</span>
            </div>
            <div className="flex items-center">
              {/* View/Eye icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 text-sm">{resource.view_count || 0}</span>
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