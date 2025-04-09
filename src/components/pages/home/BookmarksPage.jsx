import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import Sidebar from '../../layout/Sidebar';
import ResourceCard from '../resources/ResourceCard';
import { useAuth } from '../../context/AuthProvider';
import { useLoading } from '../../context/LoadingContext';
import { useCache } from '../../context/CacheContext'; 

function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useAuth();
    const { showLoading, hideLoading } = useLoading();
    const { isValidCache, getCachedData, setCachedData, clearCache } = useCache(); 

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchBookmarks();
        }
    }, [isAuthenticated, user]);

    const fetchBookmarks = async (forceRefresh = false) => {
        setIsLoading(true);
        setError(null);
        showLoading("Loading your bookmarks...");
        
        try {
            const cacheKey = `user-bookmarks-${user.id}`;
            
            if (!forceRefresh && isValidCache(cacheKey)) {
                // console.log(`✅ CACHE HIT: ${cacheKey}`);
                const cachedBookmarks = getCachedData(cacheKey);
                setBookmarks(cachedBookmarks);
                setIsLoading(false);
                hideLoading();
                return;
            }
            
            // console.log(`❌ CACHE MISS: ${cacheKey}`);
            
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            
            if (!token) {
                throw new Error("Authentication required");
            }
            
            const response = await fetch(
                'https://resource-base-backend-production.up.railway.app/api/resources/bookmarks',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error("Please login to view your bookmarks");
                }
                throw new Error(`Error fetching bookmarks: ${response.statusText}`);
            }
            
            const data = await response.json();
            setBookmarks(data);
            
            setCachedData(cacheKey, data, 5 * 60 * 1000);
            
        } catch (error) {
            console.error("Failed to fetch bookmarks:", error);
            setError(error.message || "Failed to load bookmarks. Please try again later.");
        } finally {
            setIsLoading(false);
            hideLoading();
        }
    };

    const handleRemoveBookmark = async (resourceId) => {
        try {
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            
            if (!token) {
                throw new Error("Authentication required");
            }
            
            const response = await fetch(
                `https://resource-base-backend-production.up.railway.app/api/resources/${resourceId}/bookmark`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error("Failed to remove bookmark");
            }
            
            setBookmarks(prevBookmarks => 
                prevBookmarks.filter(bookmark => bookmark.id !== resourceId)
            );
            
            clearCache(`user-bookmarks-${user.id}`);
            
            clearCache(`resource-${resourceId}`);
            
        } catch (error) {
            console.error("Failed to remove bookmark:", error);
            alert("Failed to remove bookmark. Please try again.");
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-64 md:mr-8 mb-6 md:mb-0">
                            <Sidebar />
                        </div>
                        <div className="flex-1">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Bookmarks</h1>
                                        <p className="text-gray-600">Resources you've saved for later reference</p>
                                    </div>
                                    {bookmarks.length > 0 && (
                                        <button 
                                            onClick={() => fetchBookmarks(true)}
                                            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                                        >
                                            Refresh
                                        </button>
                                    )}
                                </div>
                                
                                {!isAuthenticated ? (
                                    <div className="text-center py-16 bg-blue-50 rounded-lg">
                                        <h3 className="text-lg font-medium text-blue-800 mb-2">Sign in to see your bookmarks</h3>
                                        <p className="text-blue-600 mb-6">You need to be logged in to view and manage bookmarks</p>
                                        <Link 
                                            to="/login?redirect=/bookmarks" 
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Sign in
                                        </Link>
                                    </div>
                                ) : isLoading ? (
                                    <div className="flex justify-center py-16">
                                        <div className="animate-spin h-12 w-12 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-16 text-red-600">{error}</div>
                                ) : bookmarks.length === 0 ? (
                                    <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
                                        <p className="text-gray-600 mb-6">
                                            You haven't bookmarked any resources yet. Browse resources and click the
                                            bookmark icon to save them for later.
                                        </p>
                                        <Link 
                                            to="/" 
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Browse resources
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-sm text-gray-500 mb-4">
                                            {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'} found
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {bookmarks.map((resource) => (
                                                <ResourceCard 
                                                    key={resource.id} 
                                                    resource={resource} 
                                                    onRemoveBookmark={() => handleRemoveBookmark(resource.id)}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default BookmarksPage;