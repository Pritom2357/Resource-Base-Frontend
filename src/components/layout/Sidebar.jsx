import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'

function Sidebar() {
    const location = useLocation();
    const [popularTags, setPopularTags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPopularTags();
    }, []);

    const fetchPopularTags = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://resource-base-backend-production.up.railway.app/api/resources/tags/popular`
            );
    
            if(response.ok){
                const data = await response.json();
                setPopularTags(data.slice(0, 5));
            } else {
                setPopularTags([
                    { tag_name: 'JavaScript', count: 48 },
                    { tag_name: 'React', count: 42 },
                    { tag_name: 'Node.js', count: 36 },
                    { tag_name: 'CSS', count: 29 },
                    { tag_name: 'HTML', count: 24 }
                ])
            }
        } catch (error) {
            console.error("Failed to fetch popular tags:", error);
            setPopularTags([
                { tag_name: 'JavaScript', count: 48 },
                { tag_name: 'React', count: 42 },
                { tag_name: 'Node.js', count: 36 },
                { tag_name: 'CSS', count: 29 },
                { tag_name: 'HTML', count: 24 }
            ]);
        } finally {
            setIsLoading(false);
        }
     }

     const isActive = (path) => location.pathname === path;
  
     return (
        <div className="w-64 pr-8 hidden md:block border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <div className="pr-4"> {/* Added inner container with padding */}
            {/* Navigation Links */}
            <nav className="space-y-1">
                <Link 
                  to="/" 
                  className={`block px-3 py-2 rounded-md ${
                    isActive('/') 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/categories" 
                  className={`block px-3 py-2 rounded-md ${
                    isActive('/categories') 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Categories
                </Link>
                <Link 
                  to="/tags" 
                  className={`block px-3 py-2 rounded-md ${
                    isActive('/tags') 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Tags
                </Link>
                <Link 
                  to="/users" 
                  className={`block px-3 py-2 rounded-md ${
                    isActive('/users') 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Users
                </Link>
                <Link 
                  to="/bookmarks" 
                  className={`block px-3 py-2 rounded-md ${
                    isActive('/bookmarks') 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Bookmarked
                </Link>
            </nav>

            {/* Popular Tags Section - Enhanced Styling */}
            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 uppercase tracking-wide text-xs mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Popular Tags
                </h3>
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                  ) : (
                    popularTags.map((tag) => (
                      <div key={tag.tag_name} className="flex justify-between items-center py-1">
                        <Link 
                          to={`/search?tag=${encodeURIComponent(tag.tag_name)}`} 
                          className="text-blue-600 hover:text-blue-800 transition-colors hover:underline font-medium flex-1 truncate"
                        >
                          {tag.tag_name.toLowerCase()}
                        </Link>
                        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {tag.count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              
                <Link to="/tags" className="mt-4 text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center pt-2 border-t border-gray-200">
                  View all tags
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
            </div>
          </div>
        </div>
     )
}

export default Sidebar