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

    const login = async (userData, tokens, remember=false)=>{
        const storage = remember ? localStorage : sessionStorage;

        storage.setItem('accessToken', tokens.accessToken);
        storage.setItem('refreshToken', tokens.refreshToken);
        storage.setItem('user', JSON.stringify(userData));

        setIsAuthenticated(true);
        setUser(userData);

        try {
            const response = await fetch(
                'https://resource-base-backend-production.up.railway.app/api/users/profile',
                {
                    headers: {
                        'Authorization': `Bearer ${tokens.accessToken}`
                    }
                }
            );
            
            if (response.ok) {
                const fullUserData = await response.json();
                const sanitizedUser = {
                    ...userData,  // Use userData from function parameter instead of user state
                    photo: fullUserData.photo,
                }
                storage.setItem('user', JSON.stringify(sanitizedUser));
                setUser(sanitizedUser);
            }
        } catch (error) {
            console.error("Error fetching full user profile:", error);
        }
    };

    const logout = async ()=> {
        
        try {
            const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

            if(refreshToken){
                await fetch('https://resource-base-backend-production.up.railway.app/auth/logout', {
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
            
            const response = await fetch('https://resource-base-backend-production.up.railway.app/auth/token', {
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
            
            const newAccessToken = data.accessToken;

            // After successful refresh, fetch the updated user profile
            const userResponse = await fetch(
                'https://resource-base-backend-production.up.railway.app/api/users/profile',
                {
                    headers: {
                        'Authorization': `Bearer ${newAccessToken}`
                    }
                }
            );
            
            if (userResponse.ok) {
                const userData = await userResponse.json();
                setUser(userData); // Update the user data with the latest info
                return newAccessToken;
            }
            
            return newAccessToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
            return null;
        }
    };

    const updateUserData = (updatedUserData)=>{
        const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;

        setUser(prevUser => ({
            ...prevUser,
            ...updatedUserData
        }));

        const userStr = storage.getItem('user');
        if(userStr){
            const currentUser = JSON.parse(userStr);
            const updatedUser = {...currentUser, ...updatedUserData};
            storage.setItem('user', JSON.stringify(updatedUser));
        }
    }

    return (
        <AuthContext.Provider
        value={{
            isAuthenticated,
            user,
            loading,
            login,
            logout,
            refreshAccessToken,
            updateUserData
        }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

