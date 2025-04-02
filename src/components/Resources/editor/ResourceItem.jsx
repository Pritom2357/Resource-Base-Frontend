import React from 'react'

function ResourceItem({resource, onChange, onRemove, showRemove, index}) {
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
                <label htmlFor={`resource-title-${index}`} className='block text-sm font-medium text-gray-700  mb-1'>
                    Title
                </label>
                <input
                    type='text'
                    id={`resource-title-${index}`}
                    value={resource.title}
                    onChange={(e)=>onChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Title of the resource"
                    required={index === 0}
                />
            </div>

            <div>
            <label htmlFor={`resource-url-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                URL *
            </label>
            <input
                type="url"
                id={`resource-url-${index}`}
                value={resource.url}
                onChange={(e) => onChange('url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="https://example.com"
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
  )
}

export default ResourceItem