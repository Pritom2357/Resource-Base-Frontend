import React, { createContext, useContext, useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = ()=>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used with the AuthProvider");
    }
    return context;
}

function AuthProvider({children}){

    // const  navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const checkAuth = ()=>{
            const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');

            if(accessToken && userStr){
                setIsAuthenticated(true);
                setUser(JSON.parse(userStr));            
            }else{
                setIsAuthenticated(false);
                setUser(null);
            }

            setLoading(false);
        }
        checkAuth();
    }, []);

    const login = (userData, tokens, remember=false)=>{
        const storage = remember ? localStorage : sessionStorage;

        storage.setItem('accessToken', tokens.accessToken);
        storage.setItem('refreshToken', tokens.refreshToken);
        storage.setItem('user', JSON.stringify(userData));

        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = async ()=> {
        
        try {
            const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

            if(refreshToken){
                await fetch('http://localhost:3000/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({refreshToken})
                });
            }
            // navigate('/login');
        } catch (error) {
            console.error("Error during logout:", error);
        }finally{
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            sessionStorage.removeItem('user');

            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
            
            if (!refreshToken) {
                setIsAuthenticated(false);
                setUser(null);
                return null;
            }
            
            const response = await fetch('http://localhost:3000/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });
            
            if (!response.ok) throw new Error('Token refresh failed');
            
            const data = await response.json();
            const storage = localStorage.getItem('refreshToken') ? localStorage : sessionStorage;
            storage.setItem('accessToken', data.accessToken);
            
            return data.accessToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
            return null;
        }
    };

    return (
        <AuthContext.Provider
        value={{
            isAuthenticated,
            user,
            loading,
            login,
            logout,
            refreshAccessToken
        }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

