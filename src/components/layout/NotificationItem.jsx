import React from 'react';
import { formatDistanceToNow } from 'date-fns';

function NotificationItem({ notification, onClick }) {
  const renderIcon = () => {
    switch (notification.notification_type) {
      case 'VOTE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        );
        
      case 'COMMENT':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        );
        
      case 'RESOURCE_UPDATE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        );
      
      case 'SIMILAR_RESOURCE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        );
      
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <div 
      className={`p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''}`}
      onClick={() => onClick(notification)}
    >
      <div className="flex items-start">
        <div className="mr-3">
          {notification.sender_photo ? (
            <img 
              src={notification.sender_photo} 
              alt="User" 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              {(notification.sender_username || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <div className="mr-2">
              {renderIcon()}
            </div>
            <div className="text-sm text-gray-800 font-medium">
              {notification.notification_type === 'VOTE' && 'Upvote'}
              {notification.notification_type === 'COMMENT' && 'Comment'}
              {notification.notification_type === 'RESOURCE_UPDATE' && 'Resource Update'}
              {notification.notification_type === 'SIMILAR_RESOURCE' && 'Similar Resource'}
            </div>
          </div>
          
          <div className="text-sm text-gray-700">
            {notification.content}
          </div>
          
          <div className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </div>
        </div>
        
        {!notification.is_read && (
          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
        )}
      </div>
    </div>
  );
}

export default NotificationItem;