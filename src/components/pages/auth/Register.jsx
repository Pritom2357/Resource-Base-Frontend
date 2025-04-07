import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';

function Register() {

    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAgree, setTermsAgree] = useState(false);
    const [error, setError] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false
    });
    const [isLoading, setIsLoading ] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(()=>{
        if(confirmPassword.length > 0){
            setPasswordMatch(password === confirmPassword);
        }else{
            setPasswordMatch(null);
        }
    }, [password, confirmPassword])

    useEffect(() => {
        setPasswordStrength({
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    }, [password]);

    const isPasswordStrong = () => {
        return Object.values(passwordStrength).every(criteria => criteria === true);
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError('');
        showLoading('Creating your account...');

        if(password !== confirmPassword){
            setError("Passwords do not match");
            hideLoading();
            return;
        }

        if (!isPasswordStrong()) {
            setError("Password doesn't meet the security requirements");
            hideLoading();
            return;
        }

        setIsLoading(true);

        try {
          const response = await fetch('https://resource-base-backend-production.up.railway.app/auth/register', {
            method: 'POST',
            headers:{
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              username,
              email,
              password
            })
          });

          const data = await response.json();

          if(!response.ok){
            throw new Error(data.error || "Registration failed");
          }

          setIsSuccess(true);
          showLoading('Account created successfully! Redirecting...');

          setUsername('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setTermsAgree(false);

          setTimeout(()=>{
            navigate('/login');
            hideLoading();
          }, 2000);

        } catch (error) {
          hideLoading();
          setError(error.message || "Registration failed");
          console.log("Registration error: ", error);
        }finally{
          setIsLoading(false);
        }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-3 text-center text-base text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              sign in to existing account
            </Link>
          </p>
        </div>
        {isSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              <p className="font-medium">Registration successful!</p>
              <p className="text-sm">Your account has been created. You can now sign in.</p>
            </div>
        ):(
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <p className="font-medium">Registration failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  id="username"
                  value={username}
                  name="username"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-base transition-all duration-200"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  id="email-address"
                  value={email}
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e)=> setEmail(e.target.value)}
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-base transition-all duration-200"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="password"
                  value={password}
                  name="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-base transition-all duration-200"
                  placeholder="Password"
                />
                
                {password.length > 0 && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Password must contain:</p>
                    <ul className="space-y-1 text-sm">
                      <li className={`flex items-center ${passwordStrength.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordStrength.minLength ? (
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        )}
                        At least 8 characters
                      </li>
                      <li className={`flex items-center ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordStrength.hasUppercase ? (
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        )}
                        At least one uppercase letter (A-Z)
                      </li>
                      <li className={`flex items-center ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordStrength.hasLowercase ? (
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        )}
                        At least one lowercase letter (a-z)
                      </li>
                      <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordStrength.hasNumber ? (
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        )}
                        At least one number (0-9)
                      </li>
                      <li className={`flex items-center ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordStrength.hasSpecialChar ? (
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        )}
                        At least one special character (!@#$%^&*...)
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  id="confirm-password"
                  value={confirmPassword}
                  name="confirmPassword"
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-base transition-all duration-200"
                  placeholder="Confirm Password"
                />
                { passwordMatch !== null && (
                  <p className={`mt-1 text-sm ${passwordMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordMatch ? 'Passwords match ✓' : 'Passwords do not match ✗'}
              </p>
                )
                }
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                checked={termsAgree}
                name="terms"
                type="checkbox"
                onChange={(e) => setTermsAgree(e.target.checked)}
                required
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
              </label>
            </div>

            <div className='text-center items-center'>
              <button
                type="submit"
                disabled={!termsAgree || isLoading}
                className={`
                  group relative w-full flex justify-center py-3 px-4 border border-transparent 
                  text-base font-medium rounded-lg text-white transition-all duration-300
                  ${termsAgree || isLoading
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg" 
                    : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-70"}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  ${termsAgree ? "focus:ring-blue-500" : "focus:ring-gray-400"}
                `}
              >
                {isLoading ? 'Creating account' : 'Create Account'}
              </button>
            </div>
          </form>
        )}
        
      </div>
    </div>
  )
}

export default Register