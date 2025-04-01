import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-t-4 border-blue-500 sticky top-0 z-50">
      <div className="container mx-auto">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-16 px-4">
          {/* Logo and primary navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center transform transition-transform duration-200 hover:scale-105"
            >
              <div className="text-2xl font-bold text-blue-600">ResourceBase</div>
            </Link>
            
            {/* Primary navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link 
                to="/tags" 
                className="text-gray-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1.5 rounded-md transition-colors duration-200"
              >
                Tags
              </Link>
              <Link 
                to="/users" 
                className="text-gray-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1.5 rounded-md transition-colors duration-200"
              >
                Users
              </Link>
              <Link 
                to="/leaderboard" 
                className="text-gray-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1.5 rounded-md transition-colors duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Leaderboard
              </Link>
            </nav>
          </div>
          
          {/* Search bar (center) */}
          <div className="flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200" 
                placeholder="Search resources..." 
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>
          
          {/* Right section: user profile & icons */}
          <div className="flex items-center space-x-4">
            {/* Add Resource Button */}
            <Link 
              to="/create-resource" 
              className="w-9 h-9 flex items-center justify-center bg-blue-100 text-blue-800 text-2xl font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md"
              title="Add new resource"
            >
              +
            </Link>
            
            {/* User Points */}
            <Link 
              to="/profile/points" 
              className="hidden md:flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors duration-200"
              title="Your reputation points"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-sm text-gray-700">{user?.points || 0}</span>
            </Link>
            
            {/* Notifications */}
            <button 
              className="p-1.5 text-gray-600 hover:bg-blue-50 rounded-md relative transition-transform duration-200 hover:scale-110 active:scale-95"
              title="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Show badge if there are notifications - with pulse animation */}
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
            </button>
            
            {/* Bookmarks */}
            <Link 
              to="/bookmarks" 
              className="p-1.5 text-gray-600 hover:bg-blue-50 rounded-md transition-transform duration-200 hover:scale-110 active:scale-95"
              title="Your bookmarks"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Link>
            
            {/* User profile */}
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="hidden md:flex flex-col items-end">
                <span className="font-medium text-sm group-hover:text-blue-600 transition-colors duration-200">{user?.username || 'User'}</span>
                <button 
                  onClick={handleLogout} 
                  className="text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  Log out
                </button>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-110">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between h-14 px-2">
          {/* Hamburger menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-blue-50 rounded-md transition-transform duration-200 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-blue-600 transform transition-transform duration-200 hover:scale-105">ResourceBase</Link>
          
          {/* Right controls */}
          <div className="flex items-center space-x-3">
            {/* Add Resource Button (Mobile) */}
            <Link 
              to="/create-resource" 
              className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 text-xl font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
              title="Add new resource"
            >
              +
            </Link>
            
            {/* Search icon */}
            <button 
              onClick={() => navigate('/search')}
              className="p-2 text-gray-600 hover:bg-blue-50 rounded-md transition-transform duration-200 hover:scale-110 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* User profile icon */}
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm transition-transform duration-200 hover:scale-110">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown - with slide down animation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4 shadow-md animate-slideDown">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">Home</Link>
              <Link to="/tags" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">Tags</Link>
              <Link to="/users" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">Users</Link>
              <Link to="/leaderboard" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Leaderboard
              </Link>
              <Link to="/create-resource" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">Add Resource</Link>
              <Link to="/bookmarks" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">Bookmarks</Link>
              
              {/* Points display in mobile */}
              <div className="py-2 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-sm text-gray-700">{user?.points || 0} points</span>
              </div>
              
              <hr className="my-1" />
              <div className="flex justify-between py-2">
                <span className="font-medium">{user?.username || 'User'}</span>
                <button 
                  onClick={handleLogout} 
                  className="text-red-600 hover:text-red-800 transition-colors duration-200 transform hover:scale-105 active:scale-95"
                >
                  Log out
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// Add slideDown animation to your globals or App.css
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .animate-slideDown {
    animation: slideDown 0.2s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default Header;