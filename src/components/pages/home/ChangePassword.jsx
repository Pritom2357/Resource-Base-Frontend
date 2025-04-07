import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthProvider'
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';
import Header from '../../layout/Header';
import Sidebar from '../../layout/Sidebar';
import Footer from '../../layout/Footer';

function ChangePassword() {

    const {isAuthenticated, refreshAccessToken} = useAuth();
    const navigate = useNavigate();
    const {showLoading, hideLoading} = useLoading();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        if(formData.confirmPassword){
            setPasswordMatch(formData.newPassword === formData.confirmPassword);
        }else {
            setPasswordMatch(null)
        }
    }, [formData.newPassword, formData.confirmPassword]);

    useEffect(()=>{
        if(!isAuthenticated){
            navigate('/login?redirect=/profile/password');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e)=>{
        // console.log(e.target);
        
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if(formData.newPassword !== formData.confirmPassword){
            setError("New Password do not match");
            return;
        }

        if(formData.newPassword.length < 8){
            setError("New password must be at least 8 characters long");
            return;
        }

        setIsLoading(true);
        showLoading("Changing your password...");

        try {
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

            let response = await fetch(
                `https://resource-base-backend-production.up.railway.app/auth/change-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        currentPassword: formData.currentPassword,
                        newPassword: formData.newPassword
                    })
                }
            );

            // If token expired, try refreshing
            if(response.status === 403){
                const newToken = await refreshAccessToken();
                if(newToken){
                    response = await fetch(
                        `https://resource-base-backend-production.up.railway.app/auth/change-password`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${newToken}`
                            },
                            body: JSON.stringify({
                                currentPassword: formData.currentPassword,
                                newPassword: formData.newPassword
                            })
                        }
                    );
                }
            }

            // Handle the response (either original or after token refresh)
            if(response.ok){
                setSuccess(true);
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                
                showLoading('Password changed successfully!', 'success');
                setTimeout(() => {
                    hideLoading();
                    navigate('/profile');
                }, 2000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to change password");
            }
        } catch (error) {
            hideLoading();
            setError(error.message || 'An error occurred while changing your password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <Header />
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 md:mr-8 mb-6 md:mb-0">
                        <Sidebar />
                    </div>
                    
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                                Change Password
                            </h1>
                            
                            {success && (
                                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                                    <p className="font-medium">Password updated successfully!</p>
                                    <p className="text-sm">Your password has been changed.</p>
                                </div>
                            )}
                            
                            {error && (
                                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                    <p className="font-medium">Error</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type="password"
                                        autoComplete="current-password"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Password must be at least 8 characters long
                                    </p>
                                </div>
                                
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-blue-500
                                            ${passwordMatch === false ? 'border-red-300 focus:ring-red-500' : 
                                              passwordMatch === true ? 'border-green-300 focus:ring-green-500' : 
                                              'border-gray-300 focus:ring-blue-500'}`}
                                    />
                                    {passwordMatch !== null && (
                                        <p className={`mt-1 text-sm ${passwordMatch ? 'text-green-600' : 'text-red-600'}`}>
                                            {passwordMatch ? 'Passwords match ✓' : 'Passwords do not match ✗'}
                                        </p>
                                    )}
                                </div>
                                
                                <div className="pt-4 border-t border-gray-200 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/profile')}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md mr-4 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !passwordMatch}
                                        className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ${isLoading ? 'cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                                                Updating...
                                            </div>
                                        ) : (
                                            'Change Password'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </>
  )
}

export default ChangePassword