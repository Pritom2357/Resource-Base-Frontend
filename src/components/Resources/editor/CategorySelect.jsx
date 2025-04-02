import React, { useEffect, useState } from 'react'

function CategorySelect({value, onChange}) {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        fetchCategories()
    }, []);

    const fetchCategories = async ()=>{
        try {
            setIsLoading(true);
            const response = await fetch('https://resource-base-backend-production.up.railway.app/api/resources/categories');

            if(!response.ok){
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.log("Error fetching categories: ", error);
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
        } finally{
            setIsLoading(false);
        }
    }
  return (
    <div className="relative">
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
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      )}
      
      {error && (
        <p className="mt-1 text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}

export default CategorySelect