import React, { useEffect, useState, useRef } from 'react'

function CategorySelect({value, onChange}) {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // New state for search functionality
    const [searchText, setSearchText] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        fetchCategories();
    }, []);
    
    // Effect to set initial selected category based on value prop
    useEffect(() => {
        if (categories.length > 0 && value) {
            const selected = categories.find(cat => cat.id === value);
            if (selected) {
                setSelectedCategory(selected);
                setSearchText(selected.name);
            }
        }
    }, [categories, value]);
    
    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('https://resource-base-backend-production.up.railway.app/api/resources/categories');

            if(!response.ok){
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            // console.log("Error fetching categories: ", error);
            setError("Failed to load categories. Please try again");
            setCategories([
                { id: 'frontend', name: 'Frontend Development' },
                { id: 'backend', name: 'Backend Development' },
                { id: 'devops', name: 'DevOps' },
                { id: 'mobile', name: 'Mobile Development' },
                { id: 'design', name: 'UI/UX Design' },
                { id: 'database', name: 'Database' },
                { id: 'security', name: 'Security' },
                { id: 'career', name: 'Career' } 
            ])
        } finally {
            setIsLoading(false);
        }
    }
    
    // Filter categories based on search text
    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchText.toLowerCase())
    );
    
    const handleInputChange = (e) => {
        setSearchText(e.target.value);
        setIsDropdownOpen(true);
        setHighlightedIndex(-1);
        
        // If cleared, reset selection
        if (!e.target.value) {
            setSelectedCategory(null);
            onChange('');
        }
    };
    
    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setSearchText(category.name);
        onChange(category.id);
        setIsDropdownOpen(false);
    };
    
    const handleKeyDown = (e) => {
        if (!isDropdownOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsDropdownOpen(true);
                return;
            }
        }
        
        // Handle keyboard navigation
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev < filteredCategories.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredCategories.length) {
                    handleSelectCategory(filteredCategories[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsDropdownOpen(false);
                break;
            default:
                break;
        }
    };
    
    return (
        <div className="relative" ref={dropdownRef}>
            {isLoading ? (
                <div className="border border-gray-300 rounded-md px-4 py-2 bg-gray-50">
                    <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading categories...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchText}
                            onChange={handleInputChange}
                            onFocus={() => setIsDropdownOpen(true)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search or select a category"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredCategories.length === 0 ? (
                                <li className="px-4 py-2 text-gray-500">No categories found</li>
                            ) : (
                                filteredCategories.map((category, index) => (
                                    <li 
                                        key={category.id}
                                        onClick={() => handleSelectCategory(category)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                                            highlightedIndex === index ? 'bg-blue-50' : ''
                                        } ${selectedCategory?.id === category.id ? 'font-medium text-blue-600' : ''}`}
                                    >
                                        {category.name}
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </>
            )}
            
            {error && (
                <p className="mt-1 text-red-500 text-sm">{error}</p>
            )}
            
            {/* Hidden input to maintain form compatibility */}
            <input type="hidden" name="category" value={value || ''} />
        </div>
    )
}

export default CategorySelect