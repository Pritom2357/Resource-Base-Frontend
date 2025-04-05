import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

const RouteChangeListener = () => {
  const location = useLocation();
  const { hideLoading } = useLoading();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      hideLoading();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [location.pathname, hideLoading]);
  
  return null;
};

export default RouteChangeListener;