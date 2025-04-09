import { cache } from "react";
import { useCache } from "../context/CacheContext";

const API_URL = "https://resource-base-backend-production.up.railway.app/api";

const getAuthHeaders = ()=>{
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    return token ? {'Authorization': `Bearer ${token}`} : {};
};

export const useCachedApi = () => {
    const {isValidCache, getCachedData, setCachedData, clearCache} = useCache();

    const fetchWithCache = async (endpoint, options={}) => {
        const {
            useCache = true,
            cacheKey = endpoint,
            cacheParams = {},
            cacheExpiry = null,
            forceRefresh = false
        } = options;

        if(useCache && !forceRefresh && isValidCache(cacheKey, cacheParams)){
            return getCachedData(cacheKey, cacheParams);
        }

        try {
            const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                    ...options.headers
                },
                ...options
            });

            if(!response.ok){
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if(useCache){
                setCachedData(cacheKey, data, cacheParams, cacheExpiry);
            }

            return data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    const invalidateCache = (cacheKey, cacheParams = {})=>{
        clearCache(cacheKey, cacheParams);
    };

    return (
        fetchWithCache,
        invalidateCache
    )
}