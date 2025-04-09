import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

function OAuthCallback() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [progress, setProgress] = useState(10);
    const [statusMessage, setStatusMessage] = useState("Validating your credentials...");
    
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(timer);
                    return 90;
                }
                return prev + 10;
            });
        }, 300);

        setTimeout(() => setStatusMessage("Preparing your account..."), 900);
        setTimeout(() => setStatusMessage("Almost there..."), 1800);
        
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const userStr = params.get('user');
        const error = params.get('error');
        
        if (error) {
            setStatusMessage("Authentication failed. Redirecting...");
            setTimeout(() => navigate('/login?error=Authentication%20failed'), 1500);
            return () => clearInterval(timer);
        }
        
        if (accessToken && refreshToken && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                login(user, { accessToken, refreshToken }, true);
                
                setTimeout(() => {
                    setProgress(100);
                    setStatusMessage("Login successful!");
                    
                    setTimeout(() => {
                        navigate('/');
                    }, 1000);
                }, 2000);
                
            } catch (error) {
                console.error("Error processing OAuth callback:", error);
                setStatusMessage("Something went wrong. Redirecting...");
                setTimeout(() => navigate('/login?error=Authentication%20error'), 1500);
            }
        } else {
            setStatusMessage("Missing authentication data. Redirecting...");
            setTimeout(() => navigate('/login?error=Missing%20authentication%20data'), 1500);
        }
        
        return () => clearInterval(timer);
    }, [login, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Signing you in</h2>
                    <p className="text-gray-600 mb-6">{statusMessage}</p>
                    
                    {/* Progress bar */}
                    <div className="h-2 w-full bg-gray-200 rounded-full mb-6 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                        Please wait while we complete your authentication
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OAuthCallback;