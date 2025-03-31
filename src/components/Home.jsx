import React from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom';

function Home() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <header className="bg-white shadow-sm border-t-4 border-blue-500">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="text-2xl font-bold text-blue-600">ResourceBase</div>
            
            {/* Search Bar */}
            <div className="relative w-96">
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Search resources..." 
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="font-medium">{user?.username || 'User'}</span>
              <button 
                onClick={handleLogout} 
                className="text-sm text-red-600 hover:text-red-800"
              >
                Log out
              </button>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-56 pr-6">
            <nav className="space-y-1">
              <a href="#" className="block px-3 py-2 bg-blue-50 text-blue-700 rounded-md font-medium">Home</a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Categories</a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Tags</a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Users</a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Bookmarked</a>
            </nav>

            <div className="mt-8">
              <h3 className="font-medium text-gray-500 uppercase tracking-wide text-xs mb-3">Popular Tags</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <a href="#" className="text-blue-600 hover:text-blue-800">javascript</a>
                  <span className="text-gray-500 text-sm">423</span>
                </div>
                <div className="flex justify-between">
                  <a href="#" className="text-blue-600 hover:text-blue-800">react</a>
                  <span className="text-gray-500 text-sm">352</span>
                </div>
                <div className="flex justify-between">
                  <a href="#" className="text-blue-600 hover:text-blue-800">python</a>
                  <span className="text-gray-500 text-sm">274</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Top Resources</h1>
              <div className="flex space-x-2">
                <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Resource</button>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option>Most Votes</option>
                  <option>Newest</option>
                  <option>Most Bookmarked</option>
                </select>
              </div>
            </div>

            {/* Resource Cards */}
            <div className="space-y-4">
              {/* Resource Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex">
                <div className="flex flex-col items-center mr-6">
                  <button className="text-gray-400 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <span className="text-lg font-medium my-1">42</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <a href="#" className="text-lg text-blue-600 font-medium hover:text-blue-800">Building scalable Node.js applications with TypeScript</a>
                    <button className="text-yellow-500 hover:text-yellow-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1 text-gray-600">A comprehensive guide to building maintainable Node.js applications using TypeScript with best practices.</p>
                  <div className="flex mt-3">
                    <div className="flex flex-wrap gap-2">
                      <a href="#" className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">nodejs</a>
                      <a href="#" className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">typescript</a>
                      <a href="#" className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">backend</a>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span>Posted by</span>
                      <a href="#" className="ml-1 text-blue-600">johndoe</a>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>3 days ago</span>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>12 comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Resource Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex">
                <div className="flex flex-col items-center mr-6">
                  <button className="text-gray-400 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <span className="text-lg font-medium my-1">28</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <a href="#" className="text-lg text-blue-600 font-medium hover:text-blue-800">CSS Grid vs Flexbox: When to use which layout</a>
                    <button className="text-gray-400 hover:text-yellow-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1 text-gray-600">Learn the key differences between CSS Grid and Flexbox layouts and when to choose one over the other.</p>
                  <div className="flex mt-3">
                    <div className="flex flex-wrap gap-2">
                      <a href="#" className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">css</a>
                      <a href="#" className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">flexbox</a>
                      <a href="#" className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">grid</a>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span>Posted by</span>
                      <a href="#" className="ml-1 text-blue-600">sarahsmith</a>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>1 week ago</span>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>8 comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 pl-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium text-lg mb-3">Top Contributors</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">S</div>
                  <div>
                    <a href="#" className="text-blue-600 font-medium">sarahsmith</a>
                    <p className="text-sm text-gray-500">842 reputation</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold mr-3">J</div>
                  <div>
                    <a href="#" className="text-blue-600 font-medium">johndoe</a>
                    <p className="text-sm text-gray-500">736 reputation</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-3">M</div>
                  <div>
                    <a href="#" className="text-blue-600 font-medium">mikebrown</a>
                    <p className="text-sm text-gray-500">651 reputation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
              <h3 className="font-medium text-lg mb-3">Recent Activity</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm">
                    <a href="#" className="text-blue-600">johndoe</a>
                    <span className="text-gray-700"> commented on </span>
                    <a href="#" className="text-blue-600">Building scalable Node.js applications</a>
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div>
                  <p className="text-sm">
                    <a href="#" className="text-blue-600">sarahsmith</a>
                    <span className="text-gray-700"> posted </span>
                    <a href="#" className="text-blue-600">CSS Grid vs Flexbox tutorial</a>
                  </p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
                <div>
                  <p className="text-sm">
                    <a href="#" className="text-blue-600">mikebrown</a>
                    <span className="text-gray-700"> bookmarked </span>
                    <a href="#" className="text-blue-600">React Hooks explained</a>
                  </p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home