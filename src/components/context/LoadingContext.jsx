import React, { createContext, useContext, useState } from 'react'
import LoadingOverlay from '../common/LoadingOverlay';

const LoadingContext = createContext();

export const useLoading = ()=> useContext(LoadingContext);

export const LoadingProvider = ({children})=>{
    const [loading, setLoading] = useState({
        isVisible: false,
        message: 'Loading...',
        theme: 'primary'
    });

    const showLoading = (message = "Loading...", theme = 'primary') =>{
        setLoading({
            isVisible: true,
            message,
            theme
        })
    }

    const hideLoading = ()=>{
        setLoading({
            isVisible: false,
            message: '',
            theme: 'primary'
        });
    }

    return (
        <LoadingContext.Provider value={{loading, showLoading, hideLoading}}>
            {children}
            <LoadingOverlay
                isVisible={loading.isVisible}
                message={loading.message}
                theme={loading.theme}
            />
        </LoadingContext.Provider>
    )
}