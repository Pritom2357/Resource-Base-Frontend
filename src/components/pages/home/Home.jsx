import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import ResourceCard from '../resources/ResourceCard';
import PreferencesSelector from '../../layout/PreferencesSelector';
import { useLoading } from '../../context/LoadingContext';
import { useAuth } from '../../context/AuthProvider';


function Home() {
  const { user, isAuthenticated, refreshAccessToken } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPreferences, setHasPreferences] = useState(null); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const resourcesPerPage = 6;

  const [userStats, setUserStats] = useState({
    sharedCount: 0,
    viewedCount: 0,
    bookmarkCount: 0,
    commentCount: 0,
  });

  useEffect(()=>{
    if(isAuthenticated && user){
      fetchUserStats();
    }
  }, [isAuthenticated, user]);

  const fetchUserStats = async()=>{
    try {
      let token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

      if(!token){
        token = await refreshAccessToken();
      }

      if(!token){
        throw new Error("Authentication required");
      }

      const response = await fetch(
        'https://resource-base-backend-production.up.railway.app/api/users/stats/weekly', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if(!response.ok){
        throw new Error('Failed to fetch user statistics');
      }

      const data = await response.json();

      setUserStats({
        sharedCount: data.shared_resources_count || 0,
        viewedCount: data.viewed_resources_count || 0,
        bookmarkCount: data.bookmarked_count || 0,
        commentCount: data.commented_count || 0
      });

    } catch (error) {
      console.error("Error fetching user status: ", error);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const checkPreferences = async () => {
      try {
        let token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

        if(!token){
          token = refreshAccessToken();
        }
        
        const response = await fetch(
          'https://resource-base-backend-production.up.railway.app/api/users/preferences',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch preferences');
        }
        
        const data = await response.json();
        setHasPreferences(
          (data.tags && data.tags.length > 0) || (data.categories && data.categories.length > 0)
        );
      } catch (err) {
        console.error('Error checking preferences:', err);
        setHasPreferences(false);
      }
    };
    
    checkPreferences();
  }, [isAuthenticated]);

  useEffect(() => {
    if (hasPreferences === true) {
      fetchPersonalizedResources();
    }
  }, [hasPreferences, currentPage]);

  const fetchPersonalizedResources = async () => {
    try {
      setIsLoading(true);
      showLoading('Loading your personalized feed...');
      
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      
      const response = await fetch(
        `https://resource-base-backend-production.up.railway.app/api/resources/personalized?limit=${resourcesPerPage}&offset=${(currentPage - 1) * resourcesPerPage}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch personalized resources');
      }
      
      const data = await response.json();
      
      if (data.resources && data.pagination) {
        setResources(data.resources);
        setTotalPages(data.pagination.totalPages);
        setTotalResources(data.pagination.totalCount);
      } else {
        setResources(data);
        setTotalPages(Math.ceil(data.length / resourcesPerPage));
      }
    } catch (err) {
      console.error('Error fetching personalized resources:', err);
      setError(err.message || 'Failed to load personalized resources');
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  const handleSavePreferences = (preferences) => {
    setHasPreferences(true);
    fetchPersonalizedResources();
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

  if (!isAuthenticated) {
    return (
      <>
        <Header/>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Resource Base</h1>
            <p className="text-xl text-gray-600 mb-10">Please sign in to access your personalized homepage.</p>
            <Link to="/login" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Sign In
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gray-50">
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row'>
            <div className="md:w-64 md:mr-8 mb-6 md:mb-0">
              <Sidebar />
            </div>            
            <div className="flex-1">
              {hasPreferences === null ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              ) : hasPreferences === false ? (
                <PreferencesSelector 
                  onSave={handleSavePreferences}
                  onCancel={() => setHasPreferences(true)} // Add this new prop
                />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Your Feed</h1>
                    <div className="flex space-x-4 items-center">
                      <Link 
                        to="/create-resource" 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                      >
                        Add Resource
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Resources Shared Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-50 rounded-md mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Shared Resources</h3>
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-800 mr-2">{userStats.sharedCount || 0}</span>
                            <span className="text-xs text-gray-500">this week</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resources Viewed Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="p-3 bg-green-50 rounded-md mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Viewed Resources</h3>
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-800 mr-2">{userStats.viewedCount || 0}</span>
                            <span className="text-xs text-gray-500">this week</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="p-3 bg-amber-50 rounded-md mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Your Engagement</h3>
                          <div className="flex items-baseline space-x-2">
                            <div>
                              <span className="text-2xl font-bold text-gray-800">{userStats.bookmarkCount || 0}</span>
                              <span className="text-xs text-gray-500 ml-1">bookmarks</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <div>
                              <span className="text-2xl font-bold text-gray-800">{userStats.commentCount || 0}</span>
                              <span className="text-xs text-gray-500 ml-1">comments</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}
                  
                  {!isLoading && !error && resources.length > 0 && (
                    <div className="text-sm text-gray-500 mb-4">
                      Showing resources {((currentPage - 1) * resourcesPerPage) + 1}-
                      {Math.min(currentPage * resourcesPerPage, totalResources || resources.length)} 
                      {totalResources ? ` of ${totalResources}` : ''}
                    </div>
                  )}
                  
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
                    <>
                      {resources.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                          <p className="text-gray-500">No resources found matching your preferences.</p>
                          <button 
                            onClick={() => setHasPreferences(false)} 
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                          >
                            Update Preferences
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {resources.map(resource => (
                              <ResourceCard key={resource.id} resource={resource} />
                            ))}
                          </div>
                          
                          {/* Preference update button - now outside the grid */}
                          <div className="flex justify-center mt-6">
                            <button 
                              onClick={() => setHasPreferences(false)} 
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                            >
                              Update Preferences
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  
                  {/* Pagination */}
                  {!isLoading && resources.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <nav className="flex items-center">
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Home;