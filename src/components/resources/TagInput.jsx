import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthProvider';


function TagInput({tags, onChange, maxTags = 5}) {
    const [inputValue, setInputValue] = useState('');
    const [popularTags, setPopularTags] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [similarTagsAlert, setSimilarTagsAlert] = useState(null);
    const [confirmNewTag, setConfirmNewTag] = useState(null);
    const [isTagLoading, setIsTagLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const suggestionClickRef = useRef(false);

    useEffect(() => {
        fetchPopularTags();
    }, []);

    const fetchPopularTags = async () => {
        try {
            const response = await fetch(
                'https://resource-base-backend-production.up.railway.app/api/resources/tags/popular?limit=1000'
            );

            if (response.ok) {
                const data = await response.json();
                setPopularTags(data.map(tag => tag.tag_name.toLowerCase()));
            }
        } catch (error) {
            console.error("Failed to fetch popular tags: ", error);
        }
    };

    const calculateLocalSimilarity = (a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        
        if (aLower === bLower) return 1;
        
        if (aLower.includes(bLower) || bLower.includes(aLower)) {
            return Math.min(aLower.length, bLower.length) / Math.max(aLower.length, bLower.length);
        }
        
        const setA = new Set(aLower);
        const setB = new Set(bLower);
        const intersection = new Set([...setA].filter(x => setB.has(x)));
        return intersection.size / (setA.size + setB.size - intersection.size);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim()) {
            const filtered = popularTags
                .filter(tag => {
                    const similarity = calculateLocalSimilarity(tag, value.toLowerCase());
                    return similarity > 0.3 && !tags.includes(tag);
                })
                .sort((a, b) => {
                    const simA = calculateLocalSimilarity(a, value.toLowerCase());
                    const simB = calculateLocalSimilarity(b, value.toLowerCase());
                    return simB - simA;
                });
            
            const normalizedInput = value.trim().toLowerCase();
            const finalSuggestions = [];
            
            if (!filtered.includes(normalizedInput) && !tags.includes(normalizedInput)) {
                finalSuggestions.push({
                    value: normalizedInput,
                    isNew: true,
                    similarity: 1
                });
            }
            
            filtered.slice(0, 4).forEach(tag => {
                finalSuggestions.push({
                    value: tag,
                    isNew: false,
                    similarity: calculateLocalSimilarity(tag, value.toLowerCase())
                });
            });
            
            setSuggestions(finalSuggestions);
            setShowSuggestions(finalSuggestions.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const findOrCreateTag = async (tag) => {
        if (!isAuthenticated) {
            return { tag_name: tag };
        }

        try {
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            
            const response = await fetch(
                'https://resource-base-backend-production.up.railway.app/api/resources/tags/find-or-create',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ tagName: tag })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to process tag');
            }

            const data = await response.json();
            
            if (data.status === 'similar_found') {
                setSimilarTagsAlert({
                    originalTag: data.originalTag,
                    similarTags: data.similarTags
                });
                return null; 
            }
            
            return data.tag;
            
        } catch (error) {
            console.error('Error processing tag:', error);
            return { tag_name: tag };
        }
    };

    const addTag = async (tag, isNew = false) => {
        tag = tag.trim().toLowerCase();

        if (!tag) return;
        if (tags.includes(tag)) return;
        if (tags.length >= maxTags) return;
        
        if (isNew && !popularTags.includes(tag)) {
            setConfirmNewTag(tag);
            return;
        }

        setIsTagLoading(true);
        
        const tagResult = await findOrCreateTag(tag);
        
        setIsTagLoading(false);
        
        if (!tagResult) return; 
        
        onChange([...tags, tagResult.tag_name]);
        setInputValue('');
        setSuggestions([]);
        setShowSuggestions(false);
        setSimilarTagsAlert(null);
    };

    const confirmAndAddNewTag = async () => {
        if (!confirmNewTag) return;
        
        setIsTagLoading(true);
        const tag = confirmNewTag;
        setConfirmNewTag(null);
        
        const tagResult = await findOrCreateTag(tag);
        
        setIsTagLoading(false);
        
        if (!tagResult) return;
        
        onChange([...tags, tagResult.tag_name]);
        setInputValue('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const useSuggestedSimilarTag = (tag) => {
        setSimilarTagsAlert(null); 
        onChange([...tags, tag]); 
        setInputValue('');
    };
    
    const addOriginalTag = () => {
        if (similarTagsAlert && tags.length < maxTags) {
            onChange([...tags, similarTagsAlert.originalTag]);
            setSimilarTagsAlert(null);
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            if (suggestions.length > 0) {
                addTag(suggestions[0].value, suggestions[0].isNew);
            } else {
                addTag(inputValue, true);
            }
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    const selectSuggestion = (suggestion) => {
        if (suggestion.isNew === true && !popularTags.includes(suggestion.value)) {
            setConfirmNewTag(suggestion.value);
        } else {
            addTag(suggestion.value, false);
        }
    };

    return (
        <div className='relative'>
            <div className='flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-[44px]'>
                {tags.map((tag, index) => (
                    <div key={index} className='bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center'>
                        <span>{tag}</span>
                        <button
                            type='button'
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                            &times;
                        </button>
                    </div>
                ))}

                {isTagLoading && (
                    <div className="flex items-center px-2 py-1">
                        <div className="mr-2 h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-500">Adding tag...</span>
                    </div>
                )}

                {!isTagLoading && (
                    <input
                        type='text'
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => inputValue.trim() && setShowSuggestions(true)}
                        onBlur={(e) => {
                            if (!suggestionClickRef.current) {
                                setTimeout(() => setShowSuggestions(false), 100);
                            }
                            suggestionClickRef.current = false;
                        }}
                        className="flex-grow outline-none min-w-[120px] py-1"
                        placeholder={tags.length === 0 ? 'Add tags...' : ""}
                        disabled={tags.length >= maxTags || isTagLoading}
                    />
                )}
            </div>

            {tags.length >= maxTags && (
                <p className="mt-1 text-amber-600 text-sm">Maximum {maxTags} tags allowed</p>
            )}

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className={`px-4 py-2 hover:bg-blue-50 cursor-pointer flex justify-between ${suggestion.isNew ? 'border-l-4 border-blue-500' : ''}`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    suggestionClickRef.current = true;
                                    
                                    if (suggestion.isNew === true && !popularTags.includes(suggestion.value)) {
                                        setConfirmNewTag(suggestion.value);
                                    } else {
                                        addTag(suggestion.value, false);
                                    }
                                }}
                            >
                                <span>
                                    {suggestion.value}
                                    {suggestion.isNew && <span className="ml-2 text-blue-500 text-xs">Create new tag</span>}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {Math.round(suggestion.similarity * 100)}% match
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {similarTagsAlert && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-yellow-300 rounded-md shadow-lg p-3">
                    <h4 className="font-medium text-gray-800">Similar tags found</h4>
                    <p className="text-sm text-gray-600 mb-2">
                        We found similar existing tags. Did you mean one of these?
                    </p>
                    <ul className="mb-3">
                        {similarTagsAlert.similarTags.map((tag, index) => (
                            <li 
                                key={index}
                                className="px-2 py-1 hover:bg-blue-50 cursor-pointer flex justify-between"
                                onClick={() => useSuggestedSimilarTag(tag.tag_name)}
                            >
                                <span>{tag.tag_name}</span>
                                <span className="text-xs text-gray-400">
                                    {Math.round(tag.similarity * 100)}% match
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between">
                        <button 
                            type="button"
                            className="text-xs text-gray-500 hover:text-gray-700"
                            onClick={() => setSimilarTagsAlert(null)}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={addOriginalTag}
                        >
                            Use "{similarTagsAlert.originalTag}" anyway
                        </button>
                    </div>
                </div>
            )}

            {confirmNewTag && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-blue-300 rounded-md shadow-lg p-3">
                    <h4 className="font-medium text-gray-800">Create new tag?</h4>
                    <p className="text-sm text-gray-600 mb-2">
                        The tag "{confirmNewTag}" doesn't exist yet. Would you like to create it?
                    </p>
                    <div className="text-xs text-amber-600 mb-3">
                        <strong>Note:</strong> Unused tags may be removed from the database after 30 days.
                    </div>
                    <div className="flex justify-between">
                        <button 
                            type="button"
                            className="text-xs text-gray-500 hover:text-gray-700"
                            onClick={() => setConfirmNewTag(null)}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button"
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            onClick={confirmAndAddNewTag}
                        >
                            Create Tag
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TagInput;