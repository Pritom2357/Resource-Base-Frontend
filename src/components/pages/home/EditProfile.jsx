import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Sidebar from '../../layout/Sidebar';
import Footer from '../../layout/Footer';
import { useLoading } from '../../context/LoadingContext';
import { useCache } from '../../context/CacheContext';

function EditProfile() {
    const { user, isAuthenticated, refreshAccessToken, updateUserData } = useAuth();
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    const { clearCache } = useCache();

    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        description: '',
        photo: '',
        location: '',
        social_links: []
    });
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [socialLink, setSocialLink] = useState({ name: '', url: '' });

    useEffect(() => {
        // console.log("Current formData state:", formData);
        if (formData.social_links === null || formData.social_links === undefined) {
            console.warn("social_links is null or undefined");
        }
        if (formData.social_links && !Array.isArray(formData.social_links)) {
            console.warn("social_links is not an array:", formData.social_links);
        }
    }, [formData]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/profile/edit');
            return;
        }
        
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
                
                if (!token) {
                    throw new Error('No authentication token found');
                }
                
                const response = await fetch(
                    'https://resource-base-backend-production.up.railway.app/api/users/profile',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (response.status === 403) {
                    // Try to refresh the token
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        // Retry with new token
                        const retryResponse = await fetch(
                            'https://resource-base-backend-production.up.railway.app/api/users/profile',
                            {
                                headers: {
                                    'Authorization': `Bearer ${newToken}`
                                }
                            }
                        );
                        
                        if (retryResponse.ok) {
                            const userData = await retryResponse.json();
                            setFormData({
                                username: userData.username || '',
                                fullname: userData.fullname || '',
                                description: userData.description || '',
                                photo: userData.photo || '',
                                location: userData.location || '',
                                social_links: userData.social_links || []
                            });
                            
                            if (userData.photo) {
                                setPreviewImage(userData.photo);
                            }
                            return;
                        }
                    }
                    throw new Error('Authentication failed');
                }
                
                if (response.ok) {
                    const userData = await response.json();
                    setFormData({
                        username: userData.username || '',
                        fullname: userData.fullname || '',
                        description: userData.description || '',
                        photo: userData.photo || '',
                        location: userData.location || '',
                        social_links: userData.social_links || []
                    });
                    
                    if (userData.photo) {
                        setPreviewImage(userData.photo);
                    }
                } else {
                    throw new Error('Failed to load profile data');
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                setError('Unable to load profile data. Please try again later.');
            }
        };
        
        fetchProfile();
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // File validation
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('Image size must be less than 5MB');
            return;
        }
        
        if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
            setError('File must be an image (JPEG, PNG, GIF, or WebP)');
            return;
        }
        
        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file));
        setError(null);
    };

    const handleAddSocialLink = () => {
        if (socialLink.name && socialLink.url) {
            try {
                // Validate URL format
                new URL(socialLink.url);
                setFormData(prev => {
                    // Ensure social_links is always an array before spreading
                    const existingLinks = Array.isArray(prev.social_links) ? prev.social_links : [];
                    return {
                        ...prev,
                        social_links: [...existingLinks, { ...socialLink }]
                    };
                });
                setSocialLink({ name: '', url: '' });
                setError(null);
            } catch (err) {
                setError('Please enter a valid URL including http:// or https://');
            }
        }
    };

    const handleRemoveSocialLink = (index) => {
        setFormData(prev => {
            const existingLinks = Array.isArray(prev.social_links) ? prev.social_links : [];
            return {
                ...prev,
                social_links: existingLinks.filter((_, i) => i !== index)
            };
        });
    };

    // Upload image directly to Cloudinary via backend
    const uploadImage = async () => {
        if (!selectedFile) return null;
        setIsUploading(true);
        
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', selectedFile);
            
            const response = await fetch(
                'https://resource-base-backend-production.up.railway.app/api/users/upload-image',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    body: formDataUpload
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload image');
            }
            
            const data = await response.json();
            if(data.imageUrl){
                updateUserData({photo: data.imageUrl});
            }
            return data.imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image: ' + error.message);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        
        showLoading('Updating your profile...'); // Show loading overlay
        
        try {
            let photoUrl = formData.photo;
            
            // If a new file was selected, upload it first
            if (selectedFile) {
                showLoading('Uploading image...');
                photoUrl = await uploadImage();
                if (!photoUrl) {
                    throw new Error('Image upload failed');
                }
            }
            
            showLoading('Saving your changes...');
            const sanitizedSocialLinks = Array.isArray(formData.social_links) ? formData.social_links.map(link => ({
                name: link.name,
                url: link.url
            })) : [];

            const updatedFormData = {
                ...formData,
                photo: photoUrl,
                social_links: sanitizedSocialLinks
            };
            
            const response = await fetch(
                'https://resource-base-backend-production.up.railway.app/api/users/profile',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    body: JSON.stringify(updatedFormData)
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }

            const updatedUserData = await response.json();
            
            updateUserData(updatedUserData);
            
            const profileCacheKey = `profile-${user.username}`;
            clearCache(profileCacheKey);
            clearCache('user-preferences');
            
            setSuccess(true);
            
            showLoading('Profile updated successfully!', 'success');
            setTimeout(() => {
                hideLoading();
                navigate('/profile');
            }, 1500);
        } catch (error) {
            hideLoading();
            setError(error.message);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-64 md:mr-8 mb-6 md:mb-0">
                            <Sidebar />
                        </div>
                        
                        <div className="flex-1">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                    Edit Your Profile
                                </h1>
                                
                                {success && (
                                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                                        <p className="font-medium">Profile updated successfully!</p>
                                        <p className="text-sm">Your profile information has been updated.</p>
                                    </div>
                                )}
                                
                                {error && (
                                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                        <p className="font-medium">Error</p>
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Profile Image Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Profile Photo
                                        </label>
                                        
                                        <div className="flex items-center space-x-6">
                                            <div className="flex-shrink-0">
                                                {previewImage ? (
                                                    <img
                                                        src={previewImage}
                                                        alt="Profile preview"
                                                        className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-2xl text-gray-400">
                                                            {formData.username?.charAt(0)?.toUpperCase() || '?'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col space-y-2">
                                                <label className="cursor-pointer bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <span>{isUploading ? 'Uploading...' : 'Choose Image'}</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                                        disabled={isUploading}
                                                    />
                                                </label>
                                                
                                                {previewImage && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedFile(null);
                                                            setPreviewImage(formData.photo || '');
                                                        }}
                                                        className="text-sm text-red-600 hover:text-red-800 transition-colors"
                                                    >
                                                        Remove new image
                                                    </button>
                                                )}
                                                
                                                <p className="text-xs text-gray-500">
                                                    JPEG, PNG, GIF or WebP. Max 5MB.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Basic Info Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                                Username
                                            </label>
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                disabled 
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Usernames cannot be changed after registration.
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            <input
                                                id="fullname"
                                                name="fullname"
                                                type="text"
                                                value={formData.fullname}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                                Location
                                            </label>
                                            <input
                                                id="location"
                                                name="location"
                                                type="text"
                                                value={formData.location}
                                                onChange={handleChange}
                                                placeholder="City, Country"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* About Me Section */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                            About Me
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows="4"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Tell others about yourself..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        ></textarea>
                                    </div>
                                    
                                    {/* Social Links Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Social Links
                                        </label>
                                        
                                        <div className="space-y-4">
                                            {Array.isArray(formData.social_links) && formData.social_links.length > 0 ? (
                                                <div className="space-y-2">
                                                    {formData.social_links.map((link, index) => (
                                                        <div key={index} className="flex items-center">
                                                            <div className="flex-1 bg-gray-50 p-2 rounded-md truncate">
                                                                <span className="font-medium">{link.name}: </span>
                                                                <a 
                                                                    href={link.url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="text-blue-600 hover:underline truncate"
                                                                >
                                                                    {link.url}
                                                                </a>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveSocialLink(index)}
                                                                className="ml-2 text-red-600 hover:text-red-800"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic mb-4">No social links added yet.</p>
                                            )}
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                                <div className="md:col-span-2">
                                                    <label htmlFor="socialName" className="block text-xs text-gray-500 mb-1">Platform</label>
                                                    <input
                                                        id="socialName"
                                                        type="text"
                                                        value={socialLink.name}
                                                        onChange={(e) => setSocialLink({...socialLink, name: e.target.value})}
                                                        placeholder="Twitter, LinkedIn, etc."
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label htmlFor="socialUrl" className="block text-xs text-gray-500 mb-1">URL</label>
                                                    <input
                                                        id="socialUrl"
                                                        type="url"
                                                        value={socialLink.url}
                                                        onChange={(e) => setSocialLink({...socialLink, url: e.target.value})}
                                                        placeholder="https://..."
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddSocialLink}
                                                        disabled={!socialLink.name || !socialLink.url}
                                                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="pt-4 border-t border-gray-200 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/profile')}
                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md mr-4 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading || isUploading}
                                            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ${(isLoading || isUploading) ? 'cursor-not-allowed' : ''}`}
                                        >
                                            {isLoading || isUploading ? (
                                                <div className="flex items-center">
                                                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                                                    {isUploading ? 'Uploading...' : 'Saving...'}
                                                </div>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default EditProfile;