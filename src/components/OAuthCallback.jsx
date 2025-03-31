import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function OAuthCallback() {
    const navigate = useNavigate();
    const {login} = useAuth();

    useEffect(()=>{
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const userStr = params.get('user');
        
        if(accessToken && refreshToken && userStr){
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                login(user, {
                    accessToken,
                    refreshToken
                }, true);

                setTimeout(()=>{
                    navigate('/');
                }, 2000);
            } catch (error) {
                console.error("Error processing OAuth callback:", error);
                navigate('/login?error=Authentication%20failed');
            }
        }else{
            navigate('/login?error=Missing%20authentication%20data');
        }
    }, [login, navigate])
  return (
    <div>
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Completing login...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        </div>
    </div>
  )
}

export default OAuthCallback