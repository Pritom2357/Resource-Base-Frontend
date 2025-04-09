import React, { cache, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Sidebar from '../../layout/Sidebar';
import ResourceCard from '../resources/ResourceCard';
import { useCache } from '../../context/CacheContext';
import { useLoading } from '../../context/LoadingContext';

function SearchResults() {
    const [searchParams] = useSearchParams();
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');
    const query = searchParams.get('q');

    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    const {showLoading, hideLoading} = useLoading();
    const {isValidCache, getCachedData, setCachedData} = useCache();

    useEffect(()=>{
        const fetchResources = async ()=>{
            showLoading("Loading your resources...")
            setIsLoading(true);
            setError(null);
            try {
                let url = null;
                let cacheKey = null;

                if(tag){
                    cacheKey = `search-tag-${tag}`;
                    url = `https://resource-base-backend-production.up.railway.app/api/resources/search?tag=${encodeURIComponent(tag)}`;

                }else if(category){
                    cacheKey = `search-category-${category}`;
                    url = `https://resource-base-backend-production.up.railway.app/api/resources/search?category=${encodeURIComponent(category)}`;

                    if(isValidCache('categories')){
                        const categories = getCachedData('categories');
                        const categoryData = categories.find(c => c.id === category);
                        if(categoryData){
                            setCategoryName(categoryData.name);
                        }
                    }

                } else if(query){
                    cacheKey = `search-query-${query}`;
                    url = `https://resource-base-backend-production.up.railway.app/api/resources/search?q=${encodeURIComponent(query)}`
                }else{
                    setResources([]);
                    setError("No search parameters provided");
                    setIsLoading(false);
                    hideLoading();
                    return;
                }

                if(cacheKey && isValidCache(cacheKey)){
                    const cachedData = getCachedData(cacheKey);
                    setResources(cachedData);
                    if(cachedData[0]?.category_name){
                        setCategoryName(cachedData[0].category_name);
                    }
                    setIsLoading(false);
                    hideLoading();
                    return;
                }
                
                if(!url) {
                    throw new Error("No search URL could be constructed");
                }
                
                const response = await fetch(url);
                // console.log(response);
                

                if(!response.ok){
                    throw new Error(`Error fetching resources: ${response.statusText}`);
                }

                const data = await response.json();
                // console.log(data[0].category_name);
                setCategoryName(data[0]?.category_name || "Uncategorized");
                
                setResources(data);
                if (cacheKey) {
                    setCachedData(cacheKey, data, 5*60*1000);
                }
            } catch (error) {
                console.error('Search error:', error);
                setError('Failed to load resources. Please try again later.');
            } finally{
                setIsLoading(false);
                hideLoading();
            }
        }

        fetchResources();
    }, [tag, category, query]);

    const pageTitle = tag
        ? `Resources tagged with "${tag}"`
        : category
            ? `Resources in category "${categoryName}"`
            : query
                ? `Search results for "${query}"`
                : 'Search Results';
  return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-64 md:mr-8 mb-6 md:mb-0">
                            <Sidebar />
                        </div>
                        
                        <div className="flex-1">
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
                                {tag && (
                                    <div className="flex items-center">
                                        <span className="inline-flex text-sm bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md mr-2">
                                            #{tag}
                                        </span>
                                        <Link to="/tags" className="text-sm text-blue-600 hover:underline">
                                            Browse all tags
                                        </Link>
                                    </div>
                                )}
                            </div>
                            
                            {isLoading ? (
                                <div className="flex justify-center py-16">
                                    <div className="animate-spin h-12 w-12 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-16 text-red-600">{error}</div>
                            ) : resources.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                                    <p className="text-gray-600">
                                        {tag 
                                            ? `We couldn't find any resources tagged with "${tag}".`
                                            : category
                                                ? `We couldn't find any resources in category "${category}".`
                                                : `We couldn't find any resources matching "${query}".`
                                        }
                                    </p>
                                    <div className='flex space-x-3 justify-center items-center'>
                                        <div className="mt-6">
                                            <Link 
                                                to="/" 
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Browse all resources
                                            </Link>
                                        </div>
                                        <div className="mt-6">
                                            <Link 
                                                to="/create-resource" 
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Create a new one
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="text-sm text-gray-500 mb-4">
                                        {resources.length} {resources.length === 1 ? 'resource' : 'resources'} found
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {resources.map((resource) => (
                                            <ResourceCard key={resource.id} resource={resource} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default SearchResults