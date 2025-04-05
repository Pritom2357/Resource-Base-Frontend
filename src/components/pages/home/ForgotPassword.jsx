import React, { useState } from 'react'
import { useLoading } from '../../context/LoadingContext';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const {showLoading, hideLoading} = useLoading();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError('');
        setSuccess(false);

        if(!email.trim()){
            setError('Email is required');
            return;
        }

        setIsLoading(true);
        showLoading("Processing your request...");

        try {
            const response = await fetch('https://resource-base-backend-production.up.railway.app/auth/forgot-password', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
              });
              
            const data = await response.json();
            
            if (!response.ok) {
            throw new Error(data.error || 'Failed to process password reset request');
            }
            
            setSuccess(true);
            setEmail('');
        } catch (error) {
            setError(error.message || 'Something went wrong');
        } finally{
            setIsLoading(false);
            hideLoading();
        }
    }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-3 text-center text-base text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>
        
        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            <p className="font-medium">Password reset email sent!</p>
            <p className="text-sm">Please check your email for instructions to reset your password.</p>
            <div className="mt-4 text-center">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Return to login
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-base"
                placeholder="Enter your email address"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-md hover:shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
            
            <div className="text-center">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Go back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword