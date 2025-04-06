import React, { useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

function PreferencesSelector({ onSave, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        showLoading('Loading preferences data...');
        
        const categoriesResponse = await fetch(
          'https://resource-base-backend-production.up.railway.app/api/resources/categories'
        );
        
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        const tagsResponse = await fetch(
          'https://resource-base-backend-production.up.railway.app/api/resources/tags/popular?limit=50'
        );
        
        if (!tagsResponse.ok) {
          throw new Error('Failed to fetch tags');
        }
        
        const tagsData = await tagsResponse.json();
        setTags(tagsData);
      } catch (err) {
        console.error('Error fetching preferences data:', err);
        setError(err.message || 'Failed to load preferences data');
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    };
    
    fetchData();
  }, []);
  
  const toggleCategory = (categoryId) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter(id => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };
  
  const toggleTag = (tagName) => {
    setSelectedTags(prevSelected => {
      if (prevSelected.includes(tagName)) {
        return prevSelected.filter(tag => tag !== tagName);
      } else {
        return [...prevSelected, tagName];
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedCategories.length === 0 && selectedTags.length === 0) {
      setError('Please select at least one category or tag');
      return;
    }
    
    try {
      showLoading('Saving your preferences...');
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      
      const response = await fetch(
        'https://resource-base-backend-production.up.railway.app/api/users/preferences',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            categories: selectedCategories,
            tags: selectedTags
          })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save preferences');
      }
      
      const data = await response.json();
      onSave(data.preferences);
      hideLoading();
    } catch (err) {
      hideLoading();
      console.error('Error saving preferences:', err);
      setError(err.message || 'Failed to save preferences');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Personalize Your Experience</h2>
        <p className="text-gray-600">
          Select categories and tags that interest you, and we'll personalize your home page.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map(category => (
              <div 
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-4 py-3 rounded-lg cursor-pointer border transition-colors ${
                  selectedCategories.includes(category.id)
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <div 
                key={tag.tag_name}
                onClick={() => toggleTag(tag.tag_name)}
                className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                  selectedTags.includes(tag.tag_name)
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                #{tag.tag_name.toLowerCase()}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
          >
            Return to Homepage
          </button>
          
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}

export default PreferencesSelector;