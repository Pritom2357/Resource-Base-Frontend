import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';


export function useNavigateWithLoading() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  
  const navigateWithLoading = (path, options = {}) => {
    const { message = 'Loading page...', delay = 0 } = options;
    
    showLoading(message);
    
    // Add a minimal delay for better user experience
    setTimeout(() => {
      navigate(path);
    }, delay);
  };
  
  return { navigateWithLoading, navigate, hideLoading };
}