import React from 'react'
import { Link } from 'react-router-dom';

function SimilarityChecker({similarResources, onClose}) {

    if(!similarResources || similarResources.length === 0) return null;

  return (
    <div className='mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4'>
        <div className='flex justify-between items-start'>
            <div>
                <h3 className='font-medium text-yellow-800'>Similar resources found</h3>
                <p className='text-yellow-700 mt-1'>We found similar resources that might be duplicates. Please review before continuing. </p>
            </div>
            <button
            type='button'
            onClick={onClose}
            className="text-yellow-700 hover:text-yellow-900"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            </button>
        </div>

        <div className="mt-3 space-y-2">
            {similarResources.map((resource) => (
            <div key={resource.id} className="bg-white p-3 rounded-md border border-gray-200">
                <Link 
                to={`/resources/${resource.id}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
                >
                {resource.title}
                </Link>
                <div className="text-sm text-gray-500 mt-1">
                Posted by {resource.author_username} • {new Date(resource.created_at).toLocaleDateString()}
                </div>
            </div>
            ))}
        </div>
    </div>
  )
}

export default SimilarityChecker