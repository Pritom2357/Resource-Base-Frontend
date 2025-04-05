import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import Sidebar from '../../layout/Sidebar';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `https://resource-base-backend-production.up.railway.app/api/resources/categories`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const data = await response.json();
            setCategories(data);
            setFilteredCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            const filtered = categories.filter(category => 
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(categories);
        }
    }, [searchTerm, categories]);

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
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">All Categories</h1>
                                <p className="text-gray-600 mb-6">Browse categories to find specific types of resources</p>
                                
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
                                            placeholder="Search for categories..."
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
                                ) : filteredCategories.length === 0 ? (
                                    <div className="text-center py-16 text-gray-500">
                                        {searchTerm ? 'No categories match your search' : 'No categories found'}
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-sm text-gray-500 mb-4">
                                            {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} found
                                            {searchTerm && ` for "${searchTerm}"`}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {filteredCategories.map((category) => (
                                                <Link
                                                    key={category.id}
                                                    to={`/search?category=${encodeURIComponent(category.id)}`}
                                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center hover:bg-blue-50 group"
                                                >
                                                    <h3 className="text-lg font-medium text-blue-700 group-hover:text-blue-800 transition-colors mb-2">
                                                        {category.name}
                                                    </h3>
                                                    {category.description && (
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            {category.description}
                                                        </p>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
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


export default Categories;