import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import Sidebar from './layout/Sidebar.jsx';

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('vote_count');
  
  useEffect(() => {
    fetchResources();
  }, [sortBy]);
  
  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://resource-base-backend-production.up.railway.app/api/resources?sortBy=${sortBy}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      
      const data = await response.json();
      setResources(data);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col md:flex-row'>
          {/* Keep the existing sidebar */}
          <div className="md:w-64 md:mr-8 mb-6 md:mb-0">
            <Sidebar />
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
              <div className="flex space-x-4 items-center">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="vote_count">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="bookmarks">Most Bookmarked</option>
                </select>
                
                <Link 
                  to="/create-resource" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Add Resource
                </Link>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {/* Loading state */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border border-gray-200 rounded-lg bg-white p-5 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {resources.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No resources found.</p>
                  </div>
                ) : (
                  resources.map(resource => (
                    <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                      <div className="sm:flex sm:justify-between">
                        <div>
                          <Link 
                            to={`/resources/${resource.id}`}
                            className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                          >
                            {resource.post_title}
                          </Link>
                          
                          {resource.post_description && (
                            <p className="mt-2 text-gray-600">{resource.post_description}</p>
                          )}
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            {resource.tags && resource.tags.map((tag, i) => (
                              <Link 
                                key={i} 
                                to={`/tags/${tag}`}
                                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md"
                              >
                                {tag}
                              </Link>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col items-center">
                          <div className="flex flex-col items-center">
                            <button className="text-gray-400 hover:text-blue-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <span className="text-lg font-medium my-1">{resource.vote_count || 0}</span>
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm text-gray-500 flex items-center justify-between border-t border-gray-100 pt-3">
                        <div className="flex items-center">
                          <span>By </span>
                          <Link to={`/users/${resource.author_username}`} className="ml-1 text-blue-600">
                            {resource.author_username}
                          </Link>
                          <span className="ml-4">{new Date(resource.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{resource.comment_count || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span>{resource.bookmark_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;