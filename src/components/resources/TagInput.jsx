import React, { useEffect, useState } from 'react'

function TagInput({tags, onChange, maxTags = 5}) {
    const [inputValue, setInputValue] = useState('');
    const [popularTags, setPopularTags] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(()=>{
        fetchPopularTags();
    }, []);

    const fetchPopularTags = async ()=>{
        try {
            const response = await fetch('https://resource-base-backend-production.up.railway.app/api/resources/tags/popular?limit=1000');

            if(response.ok){
                const data = await response.json();
                setPopularTags(data.map(tag => tag.tag_name.toLowerCase()));
            }
        } catch (error) {
            console.error("Failed to fetch popular tags: ", error);
        }
    }

    const handleInputChange = (e)=>{
        const value = e.target.value;
        setInputValue(value);

        if(value.trim()){
            const filtered = popularTags.filter(
                tag => tag.includes(value.toLowerCase()) && !tags.includes(tag)
            );
    
            setSuggestions(filtered.slice(0, 5));
            setShowSuggestions(true);
        }else{
            setShowSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const addTag = (tag)=>{
        tag = tag.trim().toLowerCase();

        if(!tag) return;
        if(tags.includes(tag)) return;
        if(tags.length >= maxTags) return;

        onChange([...tags, tag]);
        setInputValue('');
        setSuggestions([]);
        setShowSuggestions(false);
    }

    const removeTag = (tagToRemove)=>{
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e)=>{
        if(e.key === 'Enter'){
            e.preventDefault();
            addTag(inputValue);
        }else if(e.key === 'Backspace' && inputValue === '' && tags.length > 0){
            removeTag(tags[tags.length-1])
        }
    };

    const selectSuggestion = (tag) =>{
        addTag(tag);
    }
  return (
    <div className='relative'>
        <div className='flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-[44px]'>
            {tags.map((tag, index)=>(
                <div key={index} className='bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center'>
                    <span>{tag}</span>
                    <button
                    type='button'
                    onClick={()=>removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                        &times;
                    </button>
                </div>
            ))}

            <input
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.trim() && setShowSuggestions(true)}
            onBlur={()=> setTimeout(()=>setShowSuggestions(false), 100)}
            className="flex-grow outline-none min-w-[120px] py-1"
            placeholder={tags.length === 0 ? 'Add tags...' : ""}
            disabled = {tags.length > maxTags}
            />
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
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => selectSuggestion(suggestion)}
                >
                    {suggestion}
                </li>
                ))}
            </ul>
        </div>
        )}
    </div>
  )
}

export default TagInput