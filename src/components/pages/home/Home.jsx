import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider.jsx'
import Sidebar from '../../layout/Sidebar.jsx';
import ResourceCard from '../resources/ResourceCard.jsx';

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
                  <div className="grid gap-6 md:grid-cols-2">
                    {resources.map(resource => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
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