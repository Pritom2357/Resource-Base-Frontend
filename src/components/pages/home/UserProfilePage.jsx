import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthProvider'
import { Link, useParams } from 'react-router-dom'
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import Sidebar from '../../layout/Sidebar';

function UserProfilePage() {

    const {username} = useParams();
    const {user: currentUser, isAuthenticated, refreshAccessToken} = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [userResources, setUserResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('about');
    const [viewedTags, setViewedTags] = useState([]);
    const [isLoadingTags, setIsLoadingTags] = useState(false);
    const [badges, setBadges] = useState([]);
    const [badgeCounts, setBadgeCounts] = useState({ bronze: 0, silver: 0, gold: 0 });
    const [isLoadingBadges, setIsLoadingBadges] = useState(false);

    const isOwnProfile = isAuthenticated && currentUser && (currentUser.username === username || (!username && currentUser.username));

    const profileUsername = username || (currentUser ? currentUser.username : '');

    useEffect(()=>{
        if(!profileUsername) return;

        const fetchUserProfile = async ()=>{
            setIsLoading(true);
            setError(null);

            try {
                
                const response = await fetch(
                    `https://resource-base-backend-production.up.railway.app/api/users/${profileUsername}`
                );

                if(!response.ok){
                    throw new Error("Failed to fetch user profile");
                }

                const data = await response.json();
                setUserProfile(data);
                document.title = `${data.username}'s Profile | Resource Base`
            } catch (error) {
                console.error("Error fetching profile: ", error);
                setError("Failed to load user profile. Please try again later. ");
            } finally{
                setIsLoading(false);
            }
        }

        const fetchUserResources = async ()=>{
           try {
                const response = await fetch(
                    `https://resource-base-backend-production.up.railway.app/api/users/${profileUsername}/resources`
                );

                if(response.ok){
                    const data = await response.json();
                    setUserResources(data);
                }
           } catch (error) {
                console.error("Error fetching user resources: ", error);
           }
        };

        const fetchViewedTags = async ()=>{
            if(!profileUsername) return;
            setIsLoadingTags(true);

            try {
                const response = await fetch(
                    `https://resource-base-backend-production.up.railway.app/api/users/${profileUsername}/tags/viewed`
                );

                if(response.ok){
                    const data = await response.json();
                    setViewedTags(data);
                }else{
                    console.error("Failed to fetch viewed tags");
                }
            } catch (error) {
                console.error("Error fetching viewed tags:", error);
                setViewedTags([]);
            } finally {
                setIsLoadingTags(false);
            }
        }

        fetchUserProfile();
        fetchUserResources();
        fetchViewedTags();
    }, [profileUsername]);

    const fetchBadges = async () => {
        if (!profileUsername) return;
        setIsLoadingBadges(true);
        
        try {
          // Fetch badge counts
          const countsResponse = await fetch(
            `https://resource-base-backend-production.up.railway.app/api/users/${profileUsername}/badge-counts`
          );
          
          if (countsResponse.ok) {
            const countsData = await countsResponse.json();
            console.log("Badge counts data:", countsData);
            setBadgeCounts(countsData);
          }
          
          // Fetch badges list
          const badgesResponse = await fetch(
            `https://resource-base-backend-production.up.railway.app/api/users/${profileUsername}/badges`
          );
          
          if (badgesResponse.ok) {
            const badgesData = await badgesResponse.json();
            console.log("Badges data:", badgesData);
            setBadges(badgesData);
          }
        } catch (error) {
          console.error("Error fetching badges:", error);
        } finally {
          setIsLoadingBadges(false);
        }
    };

    useEffect(() => {
        fetchBadges();
    }, [profileUsername]);

    const recalculateBadges = async () => {
        if (!isAuthenticated) return;
        
        try {
          setIsLoadingBadges(true);
          
          const response = await fetch(
            `https://resource-base-backend-production.up.railway.app/api/users/recalculate-badges`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.ok) {
            const result = await response.json();
            console.log("Badge recalculation result:", result);
            
            // Show success message
            alert(`Badges recalculated successfully! Found ${result.resourceCount} resources.`);
            
            // Refresh badge data
            fetchBadges();
          } else {
            const errorData = await response.json();
            console.error("Error recalculating badges:", errorData);
            alert("Failed to recalculate badges. Please try again later.");
          }
        } catch (error) {
          console.error("Error during badge recalculation:", error);
          alert("An error occurred during badge recalculation.");
        } finally {
          setIsLoadingBadges(false);
        }
    };
    
    if (isLoading) {
        return (
            <>
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="container mx-auto px-4">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                </div>
              </div>
            </div>
          </>
        );
    }
    
      if (error || !userProfile) {
        return (
          <>
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="container mx-auto px-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-red-700">
                  <p className="font-medium">Error</p>
                  <p>{error || 'User not found'}</p>
                </div>
              </div>
            </div>
          </>
        );
      }
      
    console.log("User Profile Data: ", userProfile);
    console.log("User Resources Data: ", userResources);
  return (
    <div className="min-h-screen bg-gray-50">
        <div className='container mx-auto px-4 py-6'>
            <div className='flex flex-col md:flex-row'>
                <div className="md:w-64 md:mr-8 mb-6 md:mb-0">
                    <Sidebar />
                </div>
                <div className='flex-1'>
                    <div className='flex flex-1'>
                        <div className='w-full bg-gray-50 rounded-lg overflow-hidden p-6'>
                            <div className='flex flex-col md:flex-row items-center md:items-start'>
                                {/* User Avatar/Photo Section */}
                                <div className='w-full md:w-1/4 flex justify-center md:justify-start mb-6 md:mb-0'>
                                    {userProfile.photo ? (
                                        <img 
                                            src={userProfile.photo} 
                                            alt={`${userProfile.username}'s profile`}
                                            className="h-40 w-40 rounded-full object-cover border-4 border-gray-200 shadow"
                                        />
                                    ) : (
                                        <div className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-100 shadow">
                                            <span className="text-4xl text-gray-400">{userProfile.username?.charAt(0).toUpperCase() || '?'}</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* User Details Section */}
                                <div className='w-full md:w-1/2 px-4'>
                                    <div className="mb-4 text-center">
                                        {userProfile.fullname ? (
                                            <h1 className="text-2xl font-bold text-gray-800">{userProfile.fullname}'s Profile</h1>
                                        ) : userProfile.username ? (
                                            <h1 className="text-2xl font-bold text-gray-800">{userProfile.username}'s Profile</h1>
                                        ) : (
                                            <h1 className="text-2xl font-bold text-red-500">No name provided</h1>
                                        )}
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 '>
                                        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-500">
                                            <p className="text-sm text-gray-500">Member Since</p>
                                            <p className="font-semibold text-gray-700">
                                                <span>{new Date(userProfile.created_at || Date.now()).toLocaleDateString()}</span>
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-400">
                                            <p className="text-sm text-gray-500">Resources</p>
                                            <p className="font-semibold text-blue-700">{userResources.length}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-500">
                                            <p className="text-sm text-gray-500">Last Active</p>
                                            <p className="font-semibold text-gray-700">
                                                <span>{userProfile.last_login ? new Date(userProfile.last_login).toLocaleDateString() : 'Unknown'}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Action Buttons Section */}
                                <div className='w-full md:w-1/4 flex flex-col items-center md:items-end mt-6 md:mt-0'>
                                    <div className='space-y-3 w-full md:w-auto'>
                                        <Link to='/profile/edit' className="w-full md:w-auto block">
                                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition duration-200 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                                Edit Profile
                                            </button>
                                        </Link>
                                        <Link to='/profile/password' className="w-full md:w-auto block">
                                            <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition duration-200 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" />
                                                </svg>
                                                Change Password
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8 w-full border-b border-gray-200 items-center justify-center'>
                        <nav className='flex -mb-px'>
                            <button 
                                onClick={() => setActiveTab('about')} 
                                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'about' 
                                    ? 'border-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                About
                            </button>
                            <button 
                                onClick={() => setActiveTab('points')} 
                                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'points' 
                                    ? 'border-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Points
                            </button>
                            <button 
                                onClick={() => setActiveTab('resources')} 
                                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'resources' 
                                    ? 'border-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Shared Resources
                            </button>
                            <button 
                                onClick={() => setActiveTab('tags')} 
                                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'tags' 
                                    ? 'border-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Tags & Categories
                            </button>
                        </nav>
                    </div>
                    <div className='mt-6'>
                        {activeTab === 'about' && (
                            <div className='bg-white rounded-lg shadow-sm p-6'>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                    About {userProfile.fullname || userProfile.username}
                                </h2>
                                
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                                    <div className='space-y-2'>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Full Name</p>
                                            <p className="text-base text-gray-800">
                                                {userProfile.fullname ? userProfile.fullname : 'N/A'}
                                            </p>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-500">Email</p>
                                            <p className="text-base text-gray-800">
                                                {userProfile.email || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className='space-y-2'>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Username</p>
                                            <p className="text-base text-gray-800">@{userProfile.username || 'N/A'}</p>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-500">Location</p>
                                            <p className="text-base text-gray-800">
                                                {userProfile.location || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-8">
                                    <p className="text-sm font-medium text-gray-500 mb-2">About Me</p>
                                    <div className="bg-gray-50 p-4 rounded-md text-gray-700">
                                        {userProfile.description ? (
                                            <p>{userProfile.description}</p>
                                        ) : (
                                            <p className="text-gray-400 italic">No description provided</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-3">Social Media</p>
                                    <div className='flex flex-wrap gap-3'>
                                        {userProfile.social_links && userProfile.social_links.length > 0 ? (
                                            userProfile.social_links.map((link, index) => (
                                                <a 
                                                    key={index} 
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
                                                >
                                                    {link.name}
                                                </a>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 italic">No social links added</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'resources' && (
                            userResources.length > 0 ? (
                                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                                    {userResources.map(resource => (
                                        <div key={resource.id} className="bg-gray-50 border border-blue-300 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                <div className="flex-1">
                                                    <Link to={`/resources/${resource.id}`} className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                                        {resource.post_title}
                                                    </Link>
                                                    
                                                    <p className="text-gray-600 mt-1 line-clamp-2">
                                                        {resource.post_description || 'No description provided'}
                                                    </p>
                                                    
                                                    <div className="flex items-center mt-3 text-sm text-gray-500 space-x-4">
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {new Date(resource.created_at).toLocaleDateString()}
                                                        </div>
                                                        
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            {resource.view_count || 0} views
                                                        </div>
                                                        
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                            </svg>
                                                            {resource.vote_count || 0} votes
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 md:mt-0 md:ml-4">
                                                    <Link 
                                                        to={`/resources/${resource.id}`} 
                                                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                                                    >
                                                        View Details
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                            
                                            {resource.tags && resource.tags.length > 0 && (
                                                <div className="mt-4 pt-3 border-t border-gray-200">
                                                    <div className="flex flex-wrap gap-2">
                                                        {resource.tags.map((tag, idx) => (
                                                            <Link 
                                                                key={idx} 
                                                                to={`/search?tag=${encodeURIComponent(tag)}`}
                                                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
                                                            >
                                                                #{tag}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ):(
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <p className="text-gray-500 text-lg">No resources shared yet.</p>
                                {isOwnProfile && (
                                    <Link to="/create-resource" className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Share Your First Resource
                                    </Link>
                                )}
                            </div>
                            )
                        )}
                        {activeTab === 'tags' && (
                            <div className='bg-white rounded-lg shadow-sm p-6'>
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                                        Viewed Tags
                                    </h3>
                                    
                                    {isLoadingTags ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                                        </div>
                                    ) : viewedTags.length > 0 ? (
                                        <div className="flex flex-wrap gap-3">
                                            {viewedTags.map((tag, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={`/search?tag=${encodeURIComponent(tag.tag_name)}`}
                                                    className="inline-flex items-center px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors group"
                                                >
                                                    <span>#{tag.tag_name.toLowerCase()}</span>
                                                    <span className="ml-2 px-2 py-0.5 bg-blue-100 group-hover:bg-blue-200 rounded-full text-xs text-blue-800 transition-colors">
                                                        {tag.count}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No viewed tags yet</p>
                                    )}
                                </div>
                                
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                                        Viewed Categories
                                    </h3>
                                    {/* Keep your placeholder for now */}
                                    <p className="text-gray-500 italic">Categories will be implemented later</p>
                                </div>
                                
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                                        Created Tags
                                    </h3>
                                    {/* Keep your placeholder for now */}
                                    <p className="text-gray-500 italic">Created tags will be implemented later</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                                        Created Categories
                                    </h3>
                                    {/* Keep your placeholder for now */}
                                    <p className="text-gray-500 italic">Created categories will be implemented later</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'points' && (
                            <div className='bg-white rounded-lg shadow-sm p-6'>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800">Achievements</h3>
                                    
                                    {/* {isOwnProfile && (
                                        <button
                                            onClick={recalculateBadges}
                                            disabled={isLoadingBadges}
                                            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200 flex items-center"
                                        >
                                            {isLoadingBadges ? (
                                                <>
                                                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                                                    Calculating...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Recalculate Badges
                                                </>
                                            )}
                                        </button>
                                    )} */}
                                </div>
                                
                                <div className="flex items-center justify-center my-6 space-x-8">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                                            <span className="text-amber-800 font-bold">{badgeCounts.gold || 0}</span>
                                        </div>
                                        <span className="text-sm text-gray-600">Gold</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                            <span className="text-gray-700 font-bold">{badgeCounts.silver || 0}</span>
                                        </div>
                                        <span className="text-sm text-gray-600">Silver</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-amber-700 flex items-center justify-center mb-2">
                                            <span className="text-amber-100 font-bold">{badgeCounts.bronze || 0}</span>
                                        </div>
                                        <span className="text-sm text-gray-600">Bronze</span>
                                    </div>
                                </div>
                                
                                {isLoadingBadges ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 mt-8">
                                        <h4 className="font-semibold text-gray-700 mb-4">Earned Badges</h4>
                                        
                                        {badges.length > 0 ? (
                                            badges.map((badge, index) => (
                                                <div key={index} className={`flex items-center p-3 rounded-md bg-opacity-10 ${
                                                    badge.level === 'gold' ? 'bg-yellow-100 border border-yellow-200' :
                                                    badge.level === 'silver' ? 'bg-gray-100 border border-gray-200' :
                                                    'bg-amber-100 border border-amber-200'
                                                }`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                                        badge.level === 'gold' ? 'bg-yellow-500 text-white' :
                                                        badge.level === 'silver' ? 'bg-gray-400 text-white' :
                                                        'bg-amber-700 text-white'
                                                    }`}>
                                                        {badge.level.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-800">{badge.name}</div>
                                                        <div className="text-sm text-gray-600">{badge.description}</div>
                                                    </div>
                                                    <div className="ml-auto text-xs text-gray-500">
                                                        {new Date(badge.awarded_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic text-center py-4">
                                                No badges earned yet. Start sharing resources to earn badges!
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default UserProfilePage