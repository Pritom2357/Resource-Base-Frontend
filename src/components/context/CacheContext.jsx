import React, { createContext, useContext, useEffect, useState } from 'react'

const CacheContext = createContext();

const CACHE_DURATIONS = {
    categories: 60*60*1000,
    tags: 30*60*1000,
    users: 15*60*1000,
    resources: 5*60*1000,
    bookmarks: 5*60*1000,
    userProfile: 10*60*1000
};

export function CacheProvider({children}) {
    const [cache, setCache] = useState({});

    useEffect(()=>{
        try {
            const storedCache = localStorage.getItem('app_data_cache');
            if(storedCache){
                const parsedCache = JSON.parse(storedCache);
                setCache(parsedCache);
            }
        } catch (error) {
            console.error("Error laoding cache from localstorage: ", error);
        }
    }, []);

    useEffect(()=>{
        if(Object.keys(cache).length > 0){
            try {
                localStorage.setItem('app_data_cache', JSON.stringify(cache));
            } catch (error) {
                console.error("Error saving cache to localstorage: ", error);
            }
        }
    }, [cache]);

    const isValidCache = (key, params={}) => {
        const cacheKey = getCacheKey(key, params);

        if(!cache[cacheKey]) return false;

        const {timestamp, expiry} = cache[cacheKey];
        const now = Date.now();

        return timestamp && now -timestamp < (expiry || CACHE_DURATIONS[key] || 5*60*1000)
    }

    const getCachedData = (key, params={})=>{
        const cacheKey = getCacheKey(key, params);

        if(isValidCache(key, params)){
            return cache[cacheKey].data;
        }

        return null;
    }


    const setCachedData = (key, data, params={}, customExpiry = null) => {
        try {
            const cacheKey = getCacheKey(key, params);

            setCache(prevCache=>{
                const newCache = {
                    ...prevCache,
                    [cacheKey]:{
                        data,
                        timestamp: Date.now(),
                        expiry: customExpiry || CACHE_DURATIONS[key] || 5*60*1000
                    }
                }
                
                const jsonSize = JSON.stringify(newCache).length;
                if(jsonSize > 4000000){
                    console.warn('Cached size too large, clearing older items');
                    return removeOldestCacheItems(newCache);
                        
                }
                return newCache;
            });

            
        } catch (error) {
            console.error('Error in setCachedData:', error);
            if (error.name === 'QuotaExceededError') {
                clearCache();
            }
        }
    }

    const clearCache = (key = null, params = {})=>{
        if(key){
            const cacheKey = getCacheKey(key, params);

            setCache(prevCache => {
                const newCache = {...prevCache};
                delete newCache[cacheKey];
                return newCache;
            })
        }else{
            setCache({});
            localStorage.removeItem('app_data_cache');
        }
    }

    const removeOldestCacheItems = (currentCache)=>{
        const cacheEntries = Object.entries(currentCache).map(([key, value])=>({
            key,
            ...value
        }));

        cacheEntries.sort((a, b)=> a.timestamp - b.timestamp);

        const reducedCache = {...currentCache};

        const entriesToRemove = Math.ceil(cacheEntries.length*0.4);

        console.log(`Cache too large: Removing ${entriesToRemove} oldest entries from ${cacheEntries.length} total`);

        for(let i=0; i<entriesToRemove; i++){
            if(i<cacheEntries.length){
                const keyToRemove = cacheEntries[i].key;
                console.log(`Removing cache entry: ${keyToRemove}`);
                delete reducedCache[keyToRemove];
            }
        }
        return reducedCache;
    }

    const getCacheKey = (key, params={})=>{
        if(Object.keys(params).length === 0){
            return key;
        }

        const sortedParams = Object.keys(params)
        .sort()
        .reduce((result, paramKey)=>{
            result[paramKey] = params[paramKey];
            return result;
        }, {})

        return `${key}:${JSON.stringify(sortedParams)}`;
    }
    return (
        <CacheContext.Provider
            value={{
                isValidCache,
                getCachedData,
                setCachedData,
                clearCache
            }}
        >
            {children}
        </CacheContext.Provider>
    )
}


export const useCache = ()=> useContext(CacheContext);