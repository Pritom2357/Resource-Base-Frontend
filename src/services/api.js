import { useAuth } from '../context/AuthProvider';

const API_URL = 'https://resource-base-backend-production.up.railway.app';

export const createApiClient = (refreshTokenCallback) => {
  const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
  };

  const handleResponse = async (response) => {
    if (response.ok) {
      return response.json();
    }
    
    if (response.status === 401) {
        
      const newToken = await refreshTokenCallback();
      if (newToken) {
        // Retry the original request with the new token
        const originalRequest = response.url;
        const options = {
          ...response.clone().json(),
          headers: {
            ...response.clone().headers,
            'Authorization': `Bearer ${newToken}`
          }
        };
        return fetch(originalRequest, options).then(handleResponse);
      }
    }
    
    // If we get here, the refresh failed or wasn't a 401 error
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  };

  return {
    get: async (endpoint) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      return handleResponse(response);
    },
    
    post: async (endpoint, data) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    
    put: async (endpoint, data) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    
    delete: async (endpoint) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders()
        }
      });
      return handleResponse(response);
    }
  };
};

export const useApi = () => {
  const { refreshAccessToken } = useAuth();
  return createApiClient(refreshAccessToken);
};