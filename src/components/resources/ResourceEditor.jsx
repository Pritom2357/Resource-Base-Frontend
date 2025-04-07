import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimilarityChecker from './SimilarityChecker';
import CategorySelect from './CategorySelect';
import ResourceItemList from './ResourceItemList';
import TagInput from '../resources/TagInput';
import { useAuth } from '../context/AuthProvider';
import { useLoading } from '../context/LoadingContext';
import TipTapEditor from '../layout/TipTapEditor';

function ResourceEditor({initialData = null, isEdit = false, resourceId = null}) {
    // console.log("Resource Editor mounting");

    console.log("Initial Data: ", initialData);
    
    
    const {refreshAccessToken} = useAuth();
    const { showLoading, hideLoading } = useLoading();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [similarResources, setSimilarResources] = useState([]);
    const [showSimilarWarning, setShowSimilarWarning] = useState(false);

    // Form state
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [category, setCategory] = useState(initialData?.category || '');
    const [resources, setResources] = useState(initialData?.resources || [{title: '', url: '', description: ''}]);
    const [tags, setTags] = useState(initialData?.tags || []);

    useEffect(() => {
        // This will ensure the description editor only loads after the component is mounted
        // which improves TipTap initialization performance
        if (initialData?.description) {
            setDescription(initialData.description);
        }
    }, [initialData?.description]);

    const checkSimilarity = async (resourceUrl) => {
        if(!resourceUrl) return;

        try {
            const response = await fetch(`https://resource-base-backend-production.up.railway.app/api/resources/check-similarity?url=${encodeURIComponent(resourceUrl)}`);

            if(response.ok){
                const data = await response.json();

                if(data.similar && data.similar.length > 0){
                    setSimilarResources(data.similar);
                    setShowSimilarWarning(true);
                }
            } 
        } catch (error) {
            console.error('Error checking similarity:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if(!title.trim()){
            setError("Title is required");
            return;
        }

        if(!category){
            setError("Please select a category");
            return;
        }
        
        if(resources.length === 0 || !resources[0].url || !resources[0].title){
            setError("At least one resource with title and URL is required");
            return;
        }

        if(tags.length === 0){
            setError("Please add at least one tag");
            return;
        }

        if(tags.length > 5){
            setError("Maximum 5 tags allowed");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        showLoading(initialData ? 'Updating resource...' : 'Creating resource...');

        try {
            let token = await refreshAccessToken();

            if(!token){
                token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            }

            if(!token){
                throw new Error("Authenticatoin required. Please log in");
            }

            console.log(token);
            
            const postData = {
                postTitle: title,
                postDescription: description,
                category,
                resources: resources
                    .filter(res => res.title.trim() && res.url.trim())
                    .map(res => ({
                        title: res.title,
                        url: res.url,
                        description: res.description,
                        thumbnail_url: res.thumbnail_url || '',
                        favicon_url: res.favicon_url || '',
                        site_name: res.site_name || ''
                    })),
                tags
            };

            // console.log("Postdata: ", postData);
            

            console.log("Submitting resource data:", postData); 

            const response = await fetch(
                isEdit 
                    ? `https://resource-base-backend-production.up.railway.app/api/resources/${resourceId}`
                    : 'https://resource-base-backend-production.up.railway.app/api/resources', 
                {
                    method: isEdit ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(postData)
                }
            );

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Failed to save resource');
            }

            showLoading('Success! Redirecting to your resource...');
            const redirectId = isEdit ? resourceId : data.postId;
            navigate(`/resources/${redirectId}`); 
        } catch (error) {
            hideLoading();
            console.error('Error submitting resource:', error);
            setError(error.message || 'An error occurred while saving your resource');
        } finally {
            setIsSubmitting(false);
        }
    }

    console.log("resources: ", resources);
    

    return (
        <div className="bg-white border border-blue-300 rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {initialData ? 'Edit Resource' : 'Create New Resource'}
            </h1>
            
            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                </div>
            )}
            
            {showSimilarWarning && similarResources.length > 0 && (
                <SimilarityChecker 
                    similarResources={similarResources} 
                    onClose={() => setShowSimilarWarning(false)}
                />
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter a descriptive title for your resource post"
                        required
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Category *
                    </label>
                    <CategorySelect value={category} onChange={setCategory} />
                </div>
                
                <div className="mb-6">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                        Description
                    </label>
                    <div className="relative">
                        <TipTapEditor 
                            value={description} 
                            onChange={setDescription} 
                            placeholder="Provide a general description of this resource collection"
                        />
                    </div>
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Resources *
                    </label>
                    <ResourceItemList 
                        resources={resources} 
                        onChange={setResources} 
                        onCheckSimilarity={checkSimilarity}
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags <span className="text-xs text-gray-500">(up to 5)</span>
                    </label>
                    <TagInput 
                        tags={tags} 
                        onChange={(newTags) => setTags(newTags)}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Add relevant tags to help others find your resource
                    </p>
                </div>
                
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : initialData ? 'Update Resource' : 'Create Resource'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ResourceEditor;