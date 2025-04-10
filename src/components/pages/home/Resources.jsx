import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider.jsx'
import Sidebar from '../../layout/Sidebar.jsx';
import ResourceCard from '../resources/ResourceCard.jsx';
import { useCache } from '../../context/CacheContext.jsx';
import { useLoading } from '../../context/LoadingContext.jsx';

function Resources() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [key, setKey] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const resourcesPerPage = 6; 

    const {isValidCache, getCachedData, setCachedData} = useCache();
    const {showLoading, hideLoading} = useLoading();
  
  useEffect(() => {
      fetchResources();
  }, [sortBy, currentPage, user]); 
  
  const fetchResources = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      showLoading("Setting the stage ready...")
      
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token && retryCount < 3) {
        console.log(`No token available, retrying (${retryCount + 1}/3)...`);
        setTimeout(() => fetchResources(retryCount + 1), 1000);
        return;
      }
  
      const cacheKey = `resources-${sortBy}-page${currentPage}`;
      setKey(cacheKey);
  
      if(isValidCache(cacheKey)){
        const cachedData = getCachedData(cacheKey);
        setResources(cachedData.resources);
        setTotalPages(cachedData.pagination.totalPages);
        setTotalResources(cachedData.pagination.totalCount);
        // setIsLoading(false);
        return;
      }
  
      console.log("Fetching resources for page", currentPage);
      const response = await fetch(
        `https://resource-base-backend-production.up.railway.app/api/resources?sortBy=${sortBy}&limit=${resourcesPerPage}&offset=${(currentPage - 1) * resourcesPerPage}`,
        {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.status}`);
      }
      
      const data = await response.json();
      setCachedData(cacheKey, data, 5*60*1000);
      
      if (data.resources && data.pagination) {
        setResources(data.resources);
        setTotalPages(data.pagination.totalPages);
        setTotalResources(data.pagination.totalCount);
      } else {
        setResources(data);
        setTotalPages(Math.max(1, Math.ceil(data.length / resourcesPerPage)));
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message);
      
      if (err.message === 'Failed to fetch' && retryCount < 3) {
        console.log(`Network error, retrying (${retryCount + 1}/3)...`);
        setTimeout(() => fetchResources(retryCount + 1), 1500);
      }
    } finally {
      hideLoading();
      setIsLoading(false);
    }
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); 
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col md:flex-row'>
          <div className="md:w-64 md:mr-8 mb-6 md:mb-0">
            <Sidebar />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
              <div className="flex space-x-4 items-center ml-2">
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
            
            {error && isValidCache(key) && getCachedData() && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-red-700">{error}</p>
                    <button 
                      onClick={() => fetchResources()} 
                      className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
                    >
                      May need a refresh
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Resource count indicator */}
            {!isLoading && !error && resources.length > 0 && (
              <div className="text-sm text-gray-500 mb-4">
                Showing resources {((currentPage - 1) * resourcesPerPage) + 1}-
                {Math.min(currentPage * resourcesPerPage, totalResources || resources.length)} 
                {totalResources ? `of ${totalResources}` : ''}
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
                {resources.length === 0 && !isLoading && !error ? (
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
            
            {/* Pagination */}
            {!isLoading && resources.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center">
                  {/* Previous page button */}
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md mr-2 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page number buttons */}
                  <ul className="flex">
                    {getPageNumbers().map((number, index) => (
                      <li key={index} className="mx-1">
                        {number === '...' ? (
                          <span className="px-3 py-1">...</span>
                        ) : (
                          <button
                            onClick={() => paginate(number)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === number
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {number}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Next page button */}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ml-2 ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;