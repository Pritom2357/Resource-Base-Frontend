import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import Sidebar from '../../layout/Sidebar';

function Tags() {
    const [tags, setTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [tagsPerPage] = useState(20);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await fetch(
                `https://resource-base-backend-production.up.railway.app/api/resources/tags/popular?limit=200`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch tags");
            }

            const data = await response.json();
            setTags(data);
            setFilteredTags(data);
        } catch (error) {
            console.error('Error fetching tags:', error);
            setError('Failed to load tags. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            const filtered = tags.filter(tag => 
                tag.tag_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTags(filtered);
            setCurrentPage(1); // Reset to first page on new search
        } else {
            setFilteredTags(tags);
        }
    }, [searchTerm, tags]);

    // Get current page tags
    const indexOfLastTag = currentPage * tagsPerPage;
    const indexOfFirstTag = indexOfLastTag - tagsPerPage;
    const currentTags = filteredTags.slice(indexOfFirstTag, indexOfLastTag);
    const totalPages = Math.ceil(filteredTags.length / tagsPerPage);

    // Change page
    const paginate = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        // Scroll back to top of container
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            // Show all pages if total pages are less than max to show
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always include first page
            pageNumbers.push(1);
            
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);
            
            // Adjust when near edges
            if (currentPage <= 2) {
                endPage = 4;
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 3;
            }
            
            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pageNumbers.push('...');
            }
            
            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
            
            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }
            
            // Always include last page
            pageNumbers.push(totalPages);
        }
        
        return pageNumbers;
    };

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
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">All Tags</h1>
                            <p className="text-gray-600 mb-6">Browse and discover topics across our resource library</p>
                            
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
                                        placeholder="Search for tags..."
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
                            ) : filteredTags.length === 0 ? (
                                <div className="text-center py-16 text-gray-500">
                                    {searchTerm ? 'No tags match your search' : 'No tags found'}
                                </div>
                            ) : (
                                <>
                                    <div className="text-sm text-gray-500 mb-4">
                                        {filteredTags.length} {filteredTags.length === 1 ? 'tag' : 'tags'} found
                                        {searchTerm && ` for "${searchTerm}"`}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {currentTags.map((tag) => (
                                            <Link
                                                key={tag.tag_name}
                                                to={`/search?tag=${encodeURIComponent(tag.tag_name)}`}
                                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center hover:bg-blue-50 group"
                                            >
                                                <div className="text-blue-600 font-medium mb-2 group-hover:text-blue-800 transition-colors">
                                                    {tag.tag_name.toLowerCase()}
                                                </div>
                                                <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    {tag.count} {tag.count === 1 ? 'resource' : 'resources'}
                                                </span>
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
    );
}

export default Tags;