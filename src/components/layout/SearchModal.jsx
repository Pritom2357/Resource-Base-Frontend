import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import { useCache } from '../context/CacheContext';


function SearchModal({isOpen, onClose}) {

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [popularTags, setPopularTags] = useState([]);
    const [isLoadingTags, setIsLoadingTags] = useState(false);
    const searchInputRef = useRef(null);
    const { showLoading } = useLoading();
    const navigate = useNavigate();

    const {isValidCache, getCachedData, setCachedData} = useCache();

    useEffect(()=>{
        if(isOpen && searchInputRef.current){
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(()=>{
        if(isOpen){
            fetchPopularTags();
        }
    }, [isOpen]);

    const fetchPopularTags = async()=>{
        setIsLoadingTags(true);
        try {
            // Add cache check here
            if(isValidCache('tags')) {
                setPopularTags(getCachedData('tags'));
                setIsLoadingTags(false);
                return;
            }
            
            const response = await fetch(
                'https://resource-base-backend-production.up.railway.app/api/resources/tags/popular'
            );

            if(response.ok){
                const data = await response.json();
                setPopularTags(data.slice(0, 8));
                setCachedData('tags', data.slice(0, 8), 15 * 60 * 1000); // 15 minutes
            }else{
                setPopularTags([
                    { tag_name: 'React', count: 65 },
                    { tag_name: 'Node.js', count: 52 },
                    { tag_name: 'JavaScript', count: 48 },
                    { tag_name: 'CSS', count: 41 },
                    { tag_name: 'HTML', count: 37 },
                    { tag_name: 'Python', count: 29 }
                ]);
            }
        } catch (error) {
            console.error("Failed to fetch popular tags: ", error);
            setPopularTags([
                { tag_name: 'React', count: 65 },
                { tag_name: 'Node.js', count: 52 }, 
                { tag_name: 'JavaScript', count: 48 },
                { tag_name: 'CSS', count: 41 },
                { tag_name: 'HTML', count: 37 },
                { tag_name: 'Python', count: 29 }
            ])
        } finally{
            setIsLoadingTags(false)
        }
    }

    useEffect(()=>{
        const handleEsc = (e)=>{
            if(e.key === 'Escape'){
                onClose();
            }
        }
        window.addEventListener('keydown', handleEsc);
        return ()=> window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(()=>{
        if(isOpen){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = 'auto';
        }

        return ()=>{document.body.style.overflow = 'auto'};
    }, [isOpen]);
    
    const handleSearch = async (e) =>{
        e.preventDefault();
        if(!searchTerm.trim()) return;

        setIsLoading(true);
        showLoading(`Searching for "${searchTerm}"...`);

        setTimeout(()=>{
            setIsLoading(false);
            onClose();
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        }, 300);
    };

    if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:pt-24">
      <div className="absolute inset-0 bg-gray-900 opacity-50" onClick={onClose}></div>
      <div className="relative z-10 bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden transform transition-all">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center border-b border-gray-200">
            <div className="px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 px-2 text-lg outline-none placeholder-gray-500"
              placeholder="Search resources..."
              autoComplete="off"
            />
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Searching...</p>
              </div>
            ) : searchTerm && suggestions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {suggestions.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-gray-50 cursor-pointer">
                    {item.title}
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="p-6 text-center text-gray-500">
                <p>Press Enter to search for "{searchTerm}"</p>
                <button 
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  type="submit"
                >
                  Search
                </button>
              </div>
            ) : (
              <div className="p-6">
                <h3 className="font-medium text-gray-900 mb-3">Popular searches</h3>
                {isLoadingTags ? (
                <div className="flex justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
                ):(
                <div className='flex flex-wrap gap-2'>
                    {popularTags.map((tag)=>(
                        <button
                        key={tag.tag_name}
                        type='button'
                        className='px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-800 transition-colors flex items-center'
                        onClick={()=>{
                            setSearchTerm(tag.tag_name)
                        }}
                        >
                        <span>{tag.tag_name}</span>
                        {/* <span className="ml-1 text-xs text-gray-500">({tag.count})</span> */}
                        </button>
                    ))}
                </div>
                )}
              </div>
            )}
          </div>

          <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
            <div>
              <span className="mr-2">Press</span>
              <kbd className="px-2 py-1 bg-white rounded shadow border border-gray-200">↵ Enter</kbd>
              <span className="ml-2">to search</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-white rounded shadow border border-gray-200">ESC</kbd>
              <span className="ml-2">to close</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SearchModal