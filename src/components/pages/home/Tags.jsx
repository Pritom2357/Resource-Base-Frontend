import React, { useEffect, useState } from 'react'
import Sidebar from '../../layout/Sidebar';
import { Link } from 'react-router-dom';

function Tags() {
    const [tags, setTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(()=>{
        fetchTags();
    }, []);

    const fetchTags = async ()=>{
        try {
            const response = await fetch(
                `https://resource-base-backend-production.up.railway.app/api/resources/tags/popular?limit=100`
            );

            if(!response.ok){
                throw new Error("Failed to fetch tags");
            }

            const data = await response.json();
            setTags(data);
            setFilteredTags(data);
        } catch (error) {
            console.error('Error fetching tags:', error);
            setError('Failed to load tags. Please try again later.');
        } finally{
            setIsLoading(false);
        }
    };

    useEffect(()=>{
        if(searchTerm){
            const filtered = tags.filter(tag => 
                tag.tag_name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
            );
            setFilteredTags(filtered);
        }else{
            setFilteredTags(tags);
        }
    }, [searchTerm, tags]);

  return (
    <div className='min-h-screen bg-gray-50'>
        {/* <Header/> */}
        <div className='flex'>
            <Sidebar/>
            <div className='flex-1 pl-3'>
                <div className='bg-white rounded-lg shadow-sm px-4 py-6 my-6 mx-6'>
                    <h1 className='text-2xl font-bold text-gray-900 mb-2'>All Tags</h1>
                    <p className='text-gray-600 mb-6'>Browse and discover topics accross our resource library</p>
                    <div className='mb-8'>
                        <div className='relative max-w-md'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                            type='text'
                            value={searchTerm}
                            onChange={(e)=> setSearchTerm(e.target.value)}
                            placeholder='Search for tags...'
                            className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ): error ? (
                        <div className='text-center py-16 text-red-600'>{error}</div>
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
                            {filteredTags.map((tag) => (
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
                        </>
                    )}
                </div>
            </div>
        </div>
        {/* <Footer/> */}
    </div>
  )
}

export default Tags