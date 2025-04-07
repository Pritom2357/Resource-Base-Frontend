import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import SearchModal from './SearchModal';
import { useWebSocket } from '../context/WebSocketProvider';
import NotificationItem from './NotificationItem';
import { useLoading } from '../context/LoadingContext';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useWebSocket();
  const { showLoading, hideLoading } = useLoading(); 
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const mobileNotificationRef = useRef(null);
  const notificationPanelRef = useRef(null);
  const userPhotoKey = user?.photo || 'no-photo';
  const [notificationPosition, setNotificationPosition] = useState({ top: 0, right: 0 });

  // console.log(user);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showNotifications && 
          notificationRef.current && 
          !notificationRef.current.contains(event.target) &&
          mobileNotificationRef.current && 
          !mobileNotificationRef.current.contains(event.target) &&
          notificationPanelRef.current && 
          !notificationPanelRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const handleLogout = () => {
    logout();
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleNotificationClick = (event, isMobile) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    
    if (isMobile) {
      setNotificationPosition({
        top: buttonRect.bottom,
        right: window.innerWidth - buttonRect.right
      });
    } else {
      setNotificationPosition({
        top: buttonRect.bottom,
        right: window.innerWidth - buttonRect.right
      });
    }
    
    setShowNotifications(!showNotifications);
  };

  const handleNotificationItemClick = async (notification) => {
    try {
      showLoading(`Wait, going there...`); 
      
      await markAsRead(notification.id);
      
      setShowNotifications(false);
      
      if (notification.resource_id) {
        navigate(`/resources/${notification.resource_id}`);
      } else {
        hideLoading(); 
      }
    } catch (error) {
      hideLoading(); 
      console.error("Error handling notification click:", error);
    }
  };

  return (
    <>
    <header className="bg-white shadow-sm border-t-4 border-blue-500 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="hidden md:flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center transform transition-transform duration-200 hover:scale-105"
            >
              <div className="text-2xl font-bold text-blue-600">ResourceBase</div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1.5 rounded-md transition-colors duration-200 flex items-center"
              >
                Resources
              </Link>
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
            </nav>
          </div>
          
          <div className="flex-1 max-w-md mx-6">
            <button
            onClick={openSearchModal}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-left text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200'
            >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 left-3 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search resources...
                </div>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/create-resource" 
              className="w-9 h-9 flex items-center justify-center bg-blue-100 text-blue-800 text-2xl font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md pb-1"
              title="Add new resource"
            >
              +
            </Link>
            
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={(e) => handleNotificationClick(e, false)}
                className="p-1.5 text-gray-600 hover:bg-blue-50 rounded-md relative"
                title="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
            
            <Link 
              to="/bookmarks" 
              className="p-1.5 text-gray-600 hover:bg-blue-50 rounded-md transition-transform duration-200 hover:scale-110 active:scale-95"
              title="Your bookmarks"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Link>
            
            <div className="flex items-center space-x-2 cursor-pointer group">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 group">
                  <div className="flex flex-col text-center">
                    <Link
                      to='/profile'
                      className="font-medium text-base group-hover:text-blue-600 transition-colors duration-200 text-center"
                    >
                      {user?.username || 'User'}
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200 px-1.5 py-0.5 rounded hover:bg-red-50 mt-0.5"
                    >
                      Log out
                    </button>
                  </div>
                  <Link to='/profile'>
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105 border-2 border-blue-100">
                      {user?.photo ? (
                        <img 
                          src={user.photo} 
                          alt={`${user.username}'s profile`} 
                          className="w-full h-full object-cover"
                          key={userPhotoKey}
                        />
                      ) : (
                        user?.username?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                  </Link>
                </div>
              ) : (
                <Link
                  to='/login'
                  className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 0H5v10h10V5z" clipRule="evenodd" />
                    <path d="M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:hidden flex items-center justify-between h-14 px-3 relative">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-gray-600 hover:bg-blue-50 rounded-md transition-transform duration-200 active:scale-95"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link to="/" className="text-lg sm:text-xl font-bold text-blue-600 transform transition-transform duration-200 hover:scale-105 truncate max-w-[40%]">
            ResourceBase
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              ref={mobileNotificationRef}  
              onClick={(e) => handleNotificationClick(e, true)}
              className="p-1 sm:p-1.5 text-gray-600 hover:bg-blue-50 rounded-md relative transition-transform duration-200 hover:scale-110 active:scale-95"
              title="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={openSearchModal}
              className="p-1 sm:p-1.5 text-gray-600 hover:bg-blue-50 rounded-md transition-transform duration-200 hover:scale-110 active:scale-95"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {isAuthenticated ? (
              <Link to='/profile'>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm transition-transform duration-200 hover:scale-110">
                  {user?.photo ? (
                    <img 
                      src={user.photo} 
                      alt={`${user.username}'s profile`} 
                      className="w-full h-full object-cover"
                      key={userPhotoKey}
                    />
                  ) : (
                    user?.username?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
              </Link>
            ) : (
              <Link to="/login" className="text-xs py-2 text-green-600 hover:text-blue-600 transition-colors duration-200">Login</Link>
            )}
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4 shadow-md animate-slideDown">
            <nav className="flex flex-col space-y-3">
              <Link to="/home" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">Home</Link>
              <Link to="/" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">Resources</Link>
              
              {isAuthenticated && (
                <>
                  <Link to="/create-resource" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">Add Resource</Link>
                  <Link to="/bookmarks" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">Bookmarks</Link>
                </>
              )}
              <Link to="/tags" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">Tags</Link>
              <Link to="/categories" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">Categories</Link>
              <Link to="/users" className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">Users</Link>

                {isAuthenticated ? (
                  <div className='flex justify-between'>
                  <div className='text-blue-500'>{user?.username || "User"}</div>
                  <button 
                    onClick={handleLogout}
                    className="py-2 text-red-600 hover:text-red-800 transition-colors duration-200 mr-5"
                  >
                    Log out
                  </button>
                </div>                
                ):(
                  <Link to="/login" className="py-2 text-green-600 hover:text-blue-600 transition-colors duration-200">Login</Link>
                )}
              
            </nav>
          </div>
        )}
      </div>
    </header>
    
    {showNotifications && (
      <div 
        ref={notificationPanelRef}
        className="fixed z-50 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 max-w-[calc(100vw-16px)]" 
        style={{ 
          width: '320px', 
          maxWidth: 'calc(100vw - 16px)',
          top: notificationPosition.top,
          right: notificationPosition.right
        }}
      >
        <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium text-gray-700">Notifications</h3>
          {unreadCount > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            <div>
              {notifications.slice(0, 5).map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onClick={handleNotificationItemClick}
                />
              ))}
              {notifications.length > 5 && (
                <div className="p-2 text-center">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      navigate('/notifications');
                      setShowNotifications(false);
                    }}
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )}
    
    <SearchModal
    isOpen={isSearchModalOpen}
    onClose={()=>setIsSearchModalOpen(false)}
    />
    </>
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