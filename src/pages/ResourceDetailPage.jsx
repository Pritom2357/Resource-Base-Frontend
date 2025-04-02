import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/layout/Layout';

function ResourceDetailPage() {

    const {id} = useParams();
    const [resource, setResource] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchResource = async ()=>{
            try {
                setIsLoading(true);
                const response = await fetch(`https://resource-base-backend-production.up.railway.app/api/resources/${id}`);

                if(!response.ok){
                    throw new Error('Resource not found');
                }

                const data = await response.json();
                setResource(data);
            } catch (error) {
                console.error('Error fetching resource:', error);
                setError(error.message || 'Failed to load resource');
            } finally{
                setIsLoading(false);
            }
        }

        fetchResource();
    }, [id]);

    if(isLoading){
        return (
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
        );
    }

    if (error || !resource) {
        return (
            <div className="container mx-auto px-4 py-8">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-6">
                <p className="font-medium">Error</p>
                <p>{error || 'Resource not found'}</p>
              </div>
              <Link to="/" className="text-blue-600 hover:underline">
                &larr; Back to home
              </Link>
            </div>
        );
    }

  return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{resource.post_title}</h1>
            
            <div className="flex flex-wrap items-center mt-2 text-sm text-gray-600">
              <span className="mr-4">
                Posted by {resource.author_username}
              </span>
              <span className="mr-4">
                {new Date(resource.created_at).toLocaleDateString()}
              </span>
              {resource.category_name && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                  {resource.category_name}
                </span>
              )}
            </div>
          </div>
          
          {resource.post_description && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Description</h2>
              <p className="text-gray-700">{resource.post_description}</p>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Resources</h2>
            <div className="space-y-3">
              {resource.resources.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium text-blue-600">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {item.title}
                    </a>
                  </h3>
                  {item.description && (
                    <p className="text-gray-700 mt-1 text-sm">{item.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2 truncate">{item.url}</p>
                </div>
              ))}
            </div>
          </div>
          
          {resource.tags && resource.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/tags/${tag}`}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm hover:bg-gray-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
  )
}

export default ResourceDetailPage