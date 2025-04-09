import React, { useEffect, useState } from 'react'
import { useLoading } from '../../context/LoadingContext';
import Sidebar from '../../layout/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useCache } from '../../context/CacheContext';

function Users() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const {showLoading, hideLoading} = useLoading();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [authChecked, setAuthChecked] = useState(false);
    const [usersPerPage] = useState(12);
    const {user, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const {isValidCache, getCachedData, setCachedData} = useCache();

    useEffect(()=>{
        if(user || isAuthenticated){
            setAuthChecked(true);
        }else{
            const timer = setTimeout(()=>{
                if(!user || !isAuthenticated){
                    navigate('/login');
                }
                setAuthChecked(true);
            }, 500);

            return ()=> clearTimeout(timer);
        }
    }, [user, isAuthenticated, navigate]);

    useEffect(()=>{
        if( authChecked &&(user || isAuthenticated)){
            fetchUsers();
        }
    }, [currentPage, authChecked, user, isAuthenticated]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            showLoading("Loading users...");

            const cacheKey = `users-page${currentPage}`;
            
            if(isValidCache(cacheKey)){
                // console.log(`✅ CACHE HIT: ${cacheKey}`);
                const cachedData = getCachedData(cacheKey);
                
                if(cachedData.users && cachedData.pagination){
                    setUsers(cachedData.users);
                    setFilteredUsers(cachedData.users);
                    setTotalPages(cachedData.pagination.totalPages);
                    setTotalUsers(cachedData.pagination.totalCount);
                } else {
                    setUsers(cachedData);
                    setFilteredUsers(cachedData);
                    setTotalPages(Math.ceil(cachedData.length/usersPerPage));
                }
                
                setIsLoading(false);
                hideLoading();
                return;
            }
            
            // console.log(`❌ CACHE MISS: ${cacheKey}`);
            
            const response = await fetch(
                `https://resource-base-backend-production.up.railway.app/api/users/all?limit=${usersPerPage}&offset=${(currentPage - 1) * usersPerPage}`
            );

            if(!response.ok){
                throw new Error("Failed to fetch users"); 
            }

            const data = await response.json();
            
            setCachedData(cacheKey, data, 60*60*1000);
            
            if(data.users && data.pagination){
                setUsers(data.users);
                setFilteredUsers(data.users);
                setTotalPages(data.pagination.totalPages);
                setTotalUsers(data.pagination.totalCount);
            } else {
                setUsers(data);
                setFilteredUsers(data);
                setTotalPages(Math.ceil(data.length/usersPerPage));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users. Please try again later.');
        } finally{
            setIsLoading(false);
            hideLoading();
        }
    }

    useEffect(()=>{
        if(searchTerm){
            const filtered = users.filter(user => 
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) || (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredUsers(filtered);
            setCurrentPage(1);
        }else{
            setFilteredUsers(users);
        }
    }, [searchTerm, users]);

    const formatDate = (dateString)=>{
        if(!dateString) return 'Never';

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now-date);
        const diffDays = Math.floor(diffTime / (1000*60*60*24));

        if(diffDays === 0){
            return 'Today';
        }else if(diffDays === 1){
            return 'Yesterday';
        }else if(diffDays < 7){
            return `${diffDays} days ago`;
        }else{
            return date.toLocaleDateString();
        }
    }

    const paginate = (pageNumber)=>{
        if(pageNumber < 1 || pageNumber > totalPages) return;

        setCurrentPage(pageNumber);
        window.scrollTo({
            top: 0, behavior: 'smooth'
        });
    }

    const getPageNumbers = ()=>{
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if(totalPages <= maxPagesToShow){
            for(let i=1; i<=totalPages; i++){
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);

            let startPage = Math.max(2, currentPage-1);
            let endPage = Math.min(totalPages-1, currentPage+1);
            
            if(currentPage <= 2){
                endPage = 4;
            } else if(currentPage >= totalPages -1 ){
                startPage = totalPages - 3;
            }

            if(startPage > 2){
                pageNumbers.push('...');
            }

            for(let i=startPage; i <= endPage; i++){
                pageNumbers.push(i);
            }

            if(endPage < totalPages - 1){
                pageNumbers.push('...');
            }
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    }

  return (
    <>
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 md:mr-8 mb-6 md:mb-0">
                        <Sidebar />
                    </div>
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Community Members</h1>
                            <p className="text-gray-600 mb-6">Discover and connect with other Resource Base users</p>
                            
                            <div className="mb-8">
                                <div className="relative max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search for users..."
                                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            
                            {isLoading ? (
                                <div className="flex justify-center py-16">
                                    <div className="animate-spin h-12 w-12 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-16 text-red-600">{error}</div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="text-center py-16 text-gray-500">
                                    {searchTerm ? 'No users match your search' : 'No users found'}
                                </div>
                            ) : (
                                <>
                                    <div className="text-sm text-gray-500 mb-4">
                                        {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                                        {searchTerm && ` for "${searchTerm}"`}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredUsers.map((user) => (
                                            <Link 
                                                key={user.id} 
                                                to={`/user/${user.username}`}
                                                className="bg-white border border-blue-400 rounded-lg p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center hover:bg-blue-50 group"
                                            >
                                                <div className="mb-3">
                                                    {user.photo ? (
                                                        <img 
                                                            src={user.photo}
                                                            alt={`${user.username}'s profile`}
                                                            className="w-20 h-20 rounded-full object-cover border-2"
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <p className="text-lg font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                                    {user.username}
                                                </p>
                                                
                                                <div className="flex items-center justify-center mt-1 text-sm text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{user.location || 'No location'}</span>
                                                </div>
                                                
                                                <div className="flex flex-wrap justify-center gap-3 mt-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                        {user.resource_count} resources
                                                    </span>
                                                    
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {formatDate(user.last_login)}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    
                                    {/* Pagination */}
                                    {totalPages > 1 && (
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
        </div>
    </>
  )
}

export default Users