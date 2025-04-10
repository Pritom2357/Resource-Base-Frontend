// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useWebSocket } from '../../context/WebSocketProvider';
// import NotificationItem from '../../layout/NotificationItem';
// import { useAuth } from '../../context/AuthProvider';

// function NotificationsPage() {
//   const { isAuthenticated } = useAuth();
//   const { notifications, unreadCount, isLoadingNotifications, fetchNotifications, markAsRead, markAllAsRead } = useWebSocket();
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     let isMounted = true;
    
//     const loadNotifications = async () => {
//       if (!isAuthenticated) {
//         navigate('/login');
//         return;
//       }
      
//       try {
//         if (isMounted) {
//           await fetchNotifications(true);
//         }
//       } catch (err) {
//         console.error("Error in notification load:", err);
//         if (isMounted) {
//           setError("Failed to load notifications");
//         }
//       }
//     };
    
//     loadNotifications();
    
//     return () => {
//       isMounted = false;
//     };
//   }, [isAuthenticated, navigate]); 

//   const handleNotificationClick = async (notification) => {
//     if (!notification.is_read) {
//       await markAsRead(notification.id);
//     }
    
//     if (notification.resource_id) {
//       navigate(`/resources/${notification.resource_id}`);
//     }
//   };

//   if (!isAuthenticated) {
//     return null; 
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
//           {unreadCount > 0 && (
//             <button 
//               onClick={markAllAsRead}
//               className="px-3 py-1 text-sm text-blue-700 border border-blue-200 rounded-md hover:bg-blue-50"
//             >
//               Mark all as read
//             </button>
//           )}
//         </div>
        
//         {isLoadingNotifications ? (
//           <div className="flex justify-center items-center py-10">
//             <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
//           </div>
//         ) : notifications.length === 0 ? (
//           <div className="text-center py-10 text-gray-500">
//             <p className="text-lg">No notifications yet</p>
//             <p className="text-sm mt-2">Notifications will appear here when someone interacts with your resources or shares content that matches your interests.</p>
//           </div>
//         ) : (
//           <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
//             {notifications.map(notification => (
//               <NotificationItem 
//                 key={notification.id}
//                 notification={notification}
//                 onClick={handleNotificationClick}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default NotificationsPage;

import React from 'react'

function NotificationsPage() {
  return (
    <div>Coming Soon </div>
  )
}

export default NotificationsPage