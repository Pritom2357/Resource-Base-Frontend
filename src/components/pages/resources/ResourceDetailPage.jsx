import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../layout/Sidebar';
import { useAuth } from '../../context/AuthProvider';
import { useLoading } from '../../context/LoadingContext';
import SimilarResources from '../../layout/SimilarResources';
import { useCache } from '../../context/CacheContext';

const formatCommentDate = (dateString) => {
  try {
    if (dateString && typeof dateString === 'string') {
      if (dateString.match(/^\d{2}:\d{2}:\d{2}/) && !dateString.includes('-')) {
        const now = new Date();
        const date = new Date(`2025-04-05T${dateString.split('+')[0]}Z`);
        return formatFullDate(date);
      }
      
      return formatFullDate(new Date(dateString));
    }
    return "Invalid date";
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const formatFullDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}${getOrdinalSuffix(day)} ${month}, ${year} at ${hours}:${minutes}`;
};

function ResourceDetailPage() {
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [resource, setResource] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('resources');

    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState(null);

    const [userVote, setUserVote] = useState(null);
    const [isSubmittingVote, setIsSubmittingVote] = useState(false);
    const [voteError, setVoteError] = useState(null);

    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isSubmittingBookmark, setIsSubmittingBookmark] = useState(false);
    const [bookmarkError, setBookmarkError] = useState(null);

    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const [shareMessage, setShareMessage] = useState('');
    const shareMenuRef = useRef(null);

    const [showFullDescription, setShowFullDescription] = useState(false);
    const descriptionCharLimit = 300;

    const { user, isAuthenticated, refreshAccessToken } = useAuth();
    const { showLoading, hideLoading } = useLoading();

    const {isValidCache, getCachedData, setCachedData, clearCache} = useCache();

    const truncateHTML = (html, limit) => {
      if (!html) return '';
      if (html.length <= limit) return html;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      const textContent = tempDiv.textContent || tempDiv.innerText;
      
      if (textContent.length <= limit) return html;
      
      return textContent.substring(0, limit).trim() + '...';
    };

    useEffect(()=>{
        const handleClickOutside = (event)=>{
            if(shareMenuRef.current && !shareMenuRef.current.contains(event.target)){
                // console.log(shareMenuRef.current);
                setIsShareMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    useEffect(() => {
        const fetchResource = async () => {
            if(!id) return;

            try {
                setIsLoading(true);

                const resourceCacheKey = `resource-${id}`;

                if(isValidCache(resourceCacheKey)){
                    // console.log(`✅ CACHE HIT: ${resourceCacheKey}`);
                    const cachedResource = getCachedData(resourceCacheKey);
                    setResource(cachedResource);
                    
                    document.title = `${cachedResource.post_title} | Resource Base`;
                    
                    recordResourceView(id);
                    if(isAuthenticated) {
                        fetchUserSpecificData(id);
                    }
                    
                    setIsLoading(false);
                    return;
                } else {
                    // console.log(`❌ CACHE MISS: ${resourceCacheKey}`);
                }

                const response = await fetch(`https://resource-base-backend-production.up.railway.app/api/resources/${id}`);

                if (!response.ok) {
                    throw new Error('Resource not found');
                }

                const data = await response.json();
                // console.log(data);
                
                setResource(data);
                document.title = `${data.post_title} | Resource Base`;

                setCachedData(resourceCacheKey, data, 15 * 60 * 1000);

                recordResourceView(id);
            } catch (error) {
                console.error('Error fetching resource:', error);
                setError(error.message || 'Failed to load resource');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchUserSpecificData = async (resourceId) => {
            try {
                const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
                if (!token) return;

                const [voteResponse, bookmarkResponse] = await Promise.all([
                    fetch(`https://resource-base-backend-production.up.railway.app/api/resources/${resourceId}/user-vote`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`https://resource-base-backend-production.up.railway.app/api/resources/${resourceId}/bookmark-status`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                if (voteResponse.ok) {
                    const voteData = await voteResponse.json();
                    setUserVote(voteData.voteType);
                }

                if (bookmarkResponse.ok) {
                    const bookmarkData = await bookmarkResponse.json();
                    setIsBookmarked(bookmarkData.isBookmarked);
                }

                const commentsResponse = await fetch(
                    `https://resource-base-backend-production.up.railway.app/api/resources/${resourceId}/comments`
                );

                if (commentsResponse.ok) {
                    const commentsData = await commentsResponse.json();
                    setComments(commentsData);
                }
            } catch (error) {
                console.error('Error fetching user-specific data:', error);
            }
        };

        fetchResource();
        window.scrollTo(0, 0);
    }, [id, isAuthenticated, isValidCache, getCachedData, setCachedData]);

    const recordResourceView = async (resourceId) => {
        try {
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            
            await fetch(`https://resource-base-backend-production.up.railway.app/api/resources/${resourceId}/view`, {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });
            
        } catch (error) {
            console.error('Error recording view:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!commentText.trim()) {
            setCommentError('Comment cannot be empty');
            return;
        }

        if (!isAuthenticated) {
            setCommentError('You must be logged in to comment');
            return;
        }

        setIsSubmittingComment(true);
        showLoading('Posting your comment...');
        setCommentError(null);

        try {
            let token = await refreshAccessToken();

            if (!token) {
                token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            }

            if (!token) {
                throw new Error('Authentication required. Please log in.');
            }

            const response = await fetch(`https://resource-base-backend-production.up.railway.app/api/resources/${id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    comment: commentText,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to post comment');
            }

            const result = await response.json();

            const newComment = {
                id: result.commentId,
                user_id: user.id,
                username: user.username,
                comment: commentText,
                created_at: new Date().toISOString(),
            };

            setResource((prev) => ({
                ...prev,
                comments: [newComment, ...(prev.comments || [])],
            }));

            setCommentText('');
            clearCache(`resource-${id}`);
            hideLoading();
            
            fetchNotifications(); 
            
            if (typeof clearCache === 'function') {
              clearCache('user-stats-weekly');
            }
        } catch (error) {
            hideLoading();
            console.error('Error posting comment:', error);
            setCommentError(error.message || 'Failed to post comment');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleVote = async (voteType) => {
        if (!isAuthenticated) {
            setVoteError('Please sign in to vote on resources.');
            setTimeout(() => setVoteError(null), 3000);
            return;
        }

        setIsSubmittingVote(true);
        showLoading(userVote === voteType ? 'Removing vote...' : 'Submitting your vote...');

        try {
            const newVoteType = userVote === voteType ? null : voteType;

            let token = await refreshAccessToken();

            if (!token) {
                token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            }

            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(
                `https://resource-base-backend-production.up.railway.app/api/resources/${id}/vote`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ voteType: voteType }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to vote');
            }

            let voteDifference = 0;

            if (userVote === null) {
                voteDifference = newVoteType === 'up' ? 1 : -1;
            } else if (newVoteType === null) {
                voteDifference = userVote === 'up' ? -1 : 1;
            } else if (userVote !== newVoteType) {
                voteDifference = newVoteType === 'up' ? 2 : -2;
            }

            setUserVote(newVoteType);
            setResource((prev) => ({
                ...prev,
                vote_count: Number(prev.vote_count || 0) + voteDifference,
            }));

            clearCache(`resource-${id}`);
            hideLoading();
        } catch (error) {
            hideLoading();
            console.error('Error voting:', error);
        } finally {
            setIsSubmittingVote(false);
        }
    };

    const handleToggleBookmark = async () => {
        if (!isAuthenticated) {
            setBookmarkError('Please sign in to bookmark resources.');
            setTimeout(() => setBookmarkError(null), 3000);
            return;
        }

        setIsSubmittingBookmark(true);
        showLoading(isBookmarked ? 'Removing bookmark...' : 'Adding bookmark...');

        try {
            let token = await refreshAccessToken();

            if (!token) {
                token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            }

            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(
                `https://resource-base-backend-production.up.railway.app/api/resources/${id}/bookmark`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to bookmark');
            }

            const result = await response.json();
            setIsBookmarked(result.action === 'added');

            clearCache(`resource-${id}`);
            hideLoading();
        } catch (error) {
            hideLoading();
            console.error('Error bookmarking:', error);
            setBookmarkError(error.message || 'Failed to bookmark resource');
        } finally {
            setIsSubmittingBookmark(false);
        }
    };

    const handleShare = () => {
        setIsShareMenuOpen(!isShareMenuOpen);
    };

    const handleCopyLink = () => {
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl)
        .then(()=>{
            setShareMessage('Link copied to clipboard');
            setTimeout(()=>setShareMessage(''), 3000);
        })
        .catch((error)=>{
            console.error("Failed to copy link: ", error);
            setShareMessage("Failed to copy link");
        });

        setIsShareMenuOpen(false);
    };

    const handleSocialShare = async (platform) => {
        const shareUrl = window.location.href;
        const shareTitle = resource.post_title;
        let shareText, platformUrl;
        
        switch(platform) {
            case 'twitter':
                shareText = `Check out this resource: "${shareTitle}" on ResourceBase\n\n${shareUrl}`;
                platformUrl = 'https://twitter.com/intent/tweet';
                break;
            case 'facebook':
                shareText = `Check out this resource: "${shareTitle}" on ResourceBase\n\n${shareUrl}`;
                platformUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl);
                break;
            case 'linkedin':
                shareText = `Check out this resource I found on ResourceBase:\n\n"${shareTitle}"\n\n${shareUrl}`;
                platformUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(shareUrl);
                break;
            case 'email':
                shareText = `Subject: Check out this resource: ${shareTitle}\n\nBody: I thought you might be interested in this resource I found on ResourceBase:\n\n${shareTitle}\n\n${shareUrl}`;
                platformUrl = 'mailto:?subject=' + encodeURIComponent(`Check out this resource: ${shareTitle}`) + 
                             '&body=' + encodeURIComponent(`I thought you might be interested in this resource I found on ResourceBase:\n\n${shareTitle}\n\n${shareUrl}`);
                break;
            default:
                shareText = `${shareTitle}\n\n${shareUrl}`;
                platformUrl = '';
        }
        
        try {
            await navigator.clipboard.writeText(shareText);
            
            setShareMessage(`${platform.charAt(0).toUpperCase() + platform.slice(1)} text copied! Opening ${platform}...`);
            setIsShareMenuOpen(false);
            
            setTimeout(() => {
                setShareMessage('');
                window.open(platformUrl, '_blank');
            }, 1500);
        } catch (error) {
            console.error(`Failed to copy ${platform} share text:`, error);
            setShareMessage(`Failed to copy text. Try again.`);
            setTimeout(() => setShareMessage(''), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading resource...</p>
                </div>
            </div>
        );
    }

    if (error || !resource) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md text-red-700 mb-6">
                    <p className="font-medium text-lg mb-2">Error</p>
                    <p>{error || 'Resource not found'}</p>
                </div>
                <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Back to home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 md:mr-8 mb-6 md:mb-0">
                        <Sidebar />
                    </div>
                    <div className="flex-1">
                        <div className="mb-4 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="w-7/8 pr-4">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{resource.post_title}</h1>
                                    <div className="flex flex-wrap items-center text-sm text-gray-600 mt-2 space-x-4">
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <span className="text-gray-500">shared by:</span>
                                            <span className="ml-1 font-medium text-blue-600">{resource.author_username}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span className="text-gray-500">shared on:</span>
                                            <span className="ml-1">{new Date(resource.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                            <span className="text-gray-500">viewed:</span>
                                            <span className="ml-1">{resource.view_count || '0'} times</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                  <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2">
                                    <Link
                                      to="/create-resource"
                                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      Add Resource
                                    </Link>
                                    {isAuthenticated && user && resource && user.id === resource.user_id && (
                                      <Link
                                        to={`/resources/edit/${id}`}
                                        className="inline-flex items-center justify-center px-3 py-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-md transition-colors"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Edit Resource
                                      </Link>
                                    )}
                                  </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4 py-4">
                            <div className="flex flex-col lg:flex-row">
                                <div className="w-full lg:w-2/3 pr-0 lg:pr-6">
                                    <div className='flex'>
                                        <div className='w-1/8 mr-2'>
                                            <div className='flex flex-col items-center'>
                                                <div className="">
                                                    <div className="flex flex-col items-start bg-gray-50 rounded-lg ">
                                                        <button
                                                            onClick={() => handleVote('up')}
                                                            disabled={isSubmittingVote}
                                                            className={`p-1 transition-colors ${
                                                                userVote === 'up'
                                                                    ? 'text-green-500'
                                                                    : 'text-gray-400 hover:text-green-500'
                                                            }`}
                                                            aria-label="Upvote"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-6 w-6"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M5 15l7-7 7 7"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <span className="mx-3 font-medium text-lg">
                                                            {isSubmittingVote ? '...' : resource.vote_count || 0}
                                                        </span>
                                                        <button
                                                            onClick={() => handleVote('down')}
                                                            disabled={isSubmittingVote}
                                                            className={`p-1 transition-colors ${
                                                                userVote === 'down'
                                                                    ? 'text-red-500'
                                                                    : 'text-gray-400 hover:text-red-500'
                                                            }`}
                                                            aria-label="Downvote"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-6 w-6"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 9l-7 7-7-7"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    {voteError && (
                                                        <div className="mt-2 text-sm text-red-600 bg-red-50 px-1 py-1 rounded">
                                                            {voteError}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="mt-3">
                                                    <div className="">
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={handleToggleBookmark}
                                                                disabled={isSubmittingBookmark}
                                                                className={`flex items-center px-3 py-2 rounded-md transition-colors shadow-sm ${
                                                                    isBookmarked
                                                                        ? 'bg-blue-50 text-blue-600'
                                                                        : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                                                }`}
                                                                aria-label={
                                                                    isBookmarked
                                                                        ? 'Remove bookmark'
                                                                        : 'Bookmark this resource'
                                                                }
                                                            >
                                                                {isSubmittingBookmark ? (
                                                                    <svg
                                                                        className="animate-spin h-5 w-5"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <circle
                                                                            className="opacity-25"
                                                                            cx="12"
                                                                            cy="12"
                                                                            r="10"
                                                                            stroke="currentColor"
                                                                            strokeWidth="4"
                                                                        ></circle>
                                                                        <path
                                                                            className="opacity-75"
                                                                            fill="currentColor"
                                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                        ></path>
                                                                    </svg>
                                                                ) : (
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className={`h-5 w-5 ${
                                                                            isBookmarked ? 'fill-current' : 'stroke-current'
                                                                        }`}
                                                                        fill={isBookmarked ? 'currentColor' : 'none'}
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                        {bookmarkError && (
                                                            <div className="mt-2 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                                                                {bookmarkError}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="relative py-2 mt-2" ref={shareMenuRef}>
                                                    <button
                                                        onClick={handleShare}
                                                        className="flex items-center px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors shadow-sm"
                                                        aria-label="Share this resource"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                                        </svg>
                                                    </button>
                                                    
                                                    {isShareMenuOpen && (
                                                        <div className="absolute left-0 mt-2 w-64 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-10 overflow-hidden">
                                                            
                                                        </div>
                                                    )}
                                                    
                                                    {shareMessage && (
                                                        <div className="absolute left-0 mt-2 px-3 py-2 bg-green-100 text-green-700 rounded-md shadow-md z-10">
                                                            {shareMessage}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Vertical Separator */}
                                        <div className="pr-2 border-l border-gray-300 h-auto self-stretch"></div>
                                        
                                        {/* Description Section */}
                                        <div className="mb-6 w-7/8">
                                            <h3 className="font-medium text-gray-800 mb-2">Description</h3>
                                            <div className="text-gray-700 leading-relaxed">
                                                {showFullDescription ? (
                                                    <div dangerouslySetInnerHTML={{__html: resource.post_description || ''}} />
                                                ) : (
                                                    <>
                                                        <div dangerouslySetInnerHTML={{__html: truncateHTML(resource.post_description, descriptionCharLimit)}} />
                                                        {resource.post_description && resource.post_description.length > descriptionCharLimit && (
                                                            <button 
                                                                onClick={() => setShowFullDescription(true)}
                                                                className="mt-3 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white 
                                                                        rounded-full text-sm font-medium
                                                                        shadow-[0_0_15px_rgba(59,130,246,0.5)] 
                                                                        hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] 
                                                                        hover:from-blue-600 hover:to-indigo-600
                                                                        animate-pulse hover:animate-none
                                                                        transition-all duration-300 ease-in-out"
                                                            >
                                                                See More
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                
                                                {showFullDescription && (
                                                    <button 
                                                        onClick={() => setShowFullDescription(false)}
                                                        className="mt-2 text-gray-500 font-medium hover:text-gray-700 text-sm"
                                                    >
                                                        Show Less
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                            Resources <span className="text-blue-600">({resource.resources.length})</span>
                                        </h3>
                                        <div className="space-y-6">
                                            {resource.resources.map((resc, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden"
                                                >
                                                    <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex justify-between items-center">
                                                        <h2 className="font-medium text-blue-700">
                                                            Resource{' '}
                                                            <span className="font-medium text-blue-700">{index + 1}</span>
                                                        </h2>
                                                        <a
                                                            href={resc.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                        >
                                                            <span>Visit Resource</span>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 ml-1"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                                />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                                            {resc.title}
                                                        </h3>
                                                        {resc.description && (
                                                            <p className="text-gray-600 mb-4">{resc.description}</p>
                                                        )}
                                                        <div className="flex flex-col sm:flex-row border-t border-gray-100 pt-4 mt-2 bg-amber-50 justify-center items-center text-center">
                                                            <div className="w-full sm:w-1/4 mb-3 sm:mb-0 flex justify-center items-center">
                                                                <div className="bg-gray-50 border border-gray-100 rounded w-24 h-24 flex items-center justify-center overflow-hidden">
                                                                    {resc.thumbnail_url ? (
                                                                        <img
                                                                            src={resc.thumbnail_url}
                                                                            alt={resc.title}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : resc.favicon_url ? (
                                                                        <img
                                                                            src={resc.favicon_url}
                                                                            alt={resc.site_name || 'Site icon'}
                                                                            className="w-8 h-8"
                                                                        />
                                                                    ) : (
                                                                        <div className="text-gray-400 text-xs">No image</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="w-full sm:w-3/4 flex flex-col justify-center">
                                                                <div className="text-center sm:text-left">
                                                                    {resc.site_name && (
                                                                        <div className="flex items-center justify-center sm:justify-start mb-1">
                                                                            <span className="text-xs text-gray-500 uppercase tracking-wider bg-gray-100 py-1 px-2 rounded">
                                                                                {resc.site_name}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center justify-center sm:justify-start flex-wrap">
                                                                        <a
                                                                            href={resc.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm break-all"
                                                                        >
                                                                            {resc.url}
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0 pt-5">
                                        <div className="flex space-x-2">
                                            {resource.category_name &&
                                                 (
                                                    <Link
                                                        key={resource.category_name}
                                                        to={`/search?category=${encodeURIComponent(resource.category_name)}`}
                                                        className="inline-flex text-sm bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md hover:bg-blue-100 transition-colors"
                                                    >
                                                        <span className='text-black'>*</span>{resource.category_name}
                                                    </Link>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 justify-end sm:flex-1">
                                            {resource.tags &&
                                                resource.tags.map((tag, index) => (
                                                    <Link
                                                        key={index}
                                                        to={`/search?tag=${encodeURIComponent(tag)}`}
                                                        className="inline-flex text-sm bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md hover:bg-blue-100 transition-colors"
                                                    >
                                                        #{tag}
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="mb-4 py-4 flex justify-end">
                                        <div className="w-full sm:w-80 bg-blue-50 rounded-md border border-blue-100 shadow-sm overflow-hidden">
                                            <div className="p-4 flex items-center">
                                                <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center text-blue-500 mr-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-8 w-8"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <Link
                                                        to={`/user/${resource.author_username}`}
                                                        className="text-md font-medium text-blue-600 hover:text-blue-800"
                                                    >
                                                        {resource.author_username}
                                                    </Link>
                                                    <div className="mt-1 text-sm flex items-center">
                                                        <span className="font-medium text-blue-700">
                                                            {resource.author_points || 0}
                                                        </span>
                                                        <span className="ml-1 text-blue-600">points</span>
                                                    </div>
                                                    <div className="flex items-center mt-2">
                                                        <div className="flex items-center mr-2">
                                                            <span className="h-2 w-2 rounded-full bg-yellow-400 mr-1"></span>
                                                            <span className="text-xs text-blue-600">
                                                                {resource.author_gold_badges || 0}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center mr-2">
                                                            <span className="h-2 w-2 rounded-full bg-gray-400 mr-1"></span>
                                                            <span className="text-xs text-blue-600">
                                                                {resource.author_silver_badges || 0}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="h-2 w-2 rounded-full bg-amber-600 mr-1"></span>
                                                            <span className="text-xs text-blue-600">
                                                                {resource.author_bronze_badges || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-blue-100 px-4 py-2 text-xs border-t border-blue-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-blue-700">
                                                        <span className="font-medium">
                                                            {resource.author_resource_count || 'x'}
                                                        </span>{' '}
                                                        resources shared
                                                    </div>
                                                    <div className="text-blue-700">
                                                        <span className="font-medium">{resource.author_rank || 'Newcomer'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <SimilarResources resourceId={id} tags={resource.tags}/>
                                </div>
                                <div className="hidden lg:block border-l border-gray-200 mx-4"></div>
                                <hr className="md:hidden border-t-2 border-gray-300 rounded-lg" />
                                <div className="w-full lg:w-1/3">
                                    <h3 className="font-medium text-gray-800 mb-3">Comments</h3>
                                    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 mb-6">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Add a comment</h3>
                                        {!isAuthenticated && (
                                            <div className="mb-3 bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                                                <Link to="/login" className="font-medium hover:underline">
                                                    Sign in
                                                </Link>{' '}
                                                to leave a comment.
                                            </div>
                                        )}
                                        {commentError && (
                                            <div className="mb-3 bg-red-50 text-red-700 p-3 rounded-md text-sm">
                                                {commentError}
                                            </div>
                                        )}
                                        <form onSubmit={handleCommentSubmit} className="space-y-3">
                                            <div>
                                                <textarea
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    disabled={!isAuthenticated || isSubmittingComment}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none min-h-[100px]"
                                                    placeholder={
                                                        isAuthenticated
                                                            ? 'Share your thoughts about this resource...'
                                                            : 'Please sign in to comment'
                                                    }
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        !isAuthenticated || isSubmittingComment || !commentText.trim()
                                                    }
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmittingComment ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                            Posting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 mr-1"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M12 19l9 2-9-18-9 18-9-2zm0 0v-8"
                                                                />
                                                            </svg>
                                                            Post Comment
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    {comments && comments.length > 0 ? (
                                        <div className="space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm p-4 max-h-[400px] overflow-y-auto">
                                            {comments.map((comment, index) => (
                                                <div
                                                    key={comment.id || index}
                                                    className="border-b border-gray-100 pb-3 last:border-0"
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-medium text-blue-600">
                                                            {comment.author_username || comment.username}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {formatCommentDate(comment.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700">{comment.comment || comment.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                                            <p className="text-gray-500 text-center py-4">No comments yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResourceDetailPage;