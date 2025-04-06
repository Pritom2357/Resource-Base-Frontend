import React, { createContext, useContext, useEffect, useState } from 'react';
import {io} from 'socket.io-client'
import { useAuth } from './AuthProvider';

const WebSocketContext = createContext();

export function WebSocketProvider({children}) {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const {isAuthenticated, user} = useAuth();
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  useEffect(()=>{
    let socketInstance = null;

    if(isAuthenticated && user){
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

      socketInstance = io('https://resource-base-backend-production.up.railway.app', {
        auth: {token}
      });

      socketInstance.on('connect', ()=>{
        console.log('Connected to notification service');
      });

      socketInstance.on('connect_error', (error)=>{
        console.error('Socket connection error: ', error.message);
      });

      socketInstance.on('notification', (notification)=>{
        console.log('Received real-time notification: ', notification);
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev+1);

        if('Notification' in window && Notification.permission === 'granted'){
          const title = getNotificationTitle(notification.notification_type);
          new Notification(title, {
            body: notification.content,
            icon: '/favicon.ico'
          });
        }
      })
      setSocket(socketInstance);
    }

    return ()=>{
      if(socketInstance){
        console.log('Disconnecting socket');
        socketInstance.disconnect();
      }
    }
  }, [isAuthenticated, user]);

  const getNotificationTitle = (type)=>{
    switch (type) {
      case 'COMMENT': return 'New Comment';
      case 'VOTE': return 'New Upvote';
      case 'RESOURCE_UPDATE': return 'Resource Updated';
      case 'SIMILAR_RESOURCE': return 'Similar Resource Added';
      default: return 'New Notification';
    }
  }

  useEffect(()=>{
    if(isAuthenticated){
      fetchNotifications();
    }else{
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async ()=>{
    if(!isAuthenticated) return;

    try {
      setIsLoadingNotifications(true);
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

      const response = await fetch(
        'https://resource-base-backend-production.up.railway.app/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if(!response.ok){
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally{
      setIsLoadingNotifications(false);
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? {...n, is_read: true} : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      await fetch(
        `https://resource-base-backend-production.up.railway.app/api/notifications/${notificationId}/read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

      setNotifications(prev => 
        prev.map(n => ({...n, is_read:true}))
      );

      setUnreadCount(0);

      await fetch(
        'https://resource-base-backend-production.up.railway.app/api/notifications/mark-all-read', {
          method: 'POST', 
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  return (
    <WebSocketContext.Provider value={{
      socket,
      notifications,
      unreadCount,
      isLoadingNotifications,
      fetchNotifications,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket(){
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}