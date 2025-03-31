import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAgree, setTermsAgree] = useState(false);
    const [error, setError] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(null);
    const [isLoading, setIsLoading ] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(()=>{
        if(confirmPassword.length > 0){
            setPasswordMatch(password === confirmPassword);
        }else{
            setPasswordMatch(null);
        }
    }, [password, confirmPassword])

    const handleSubmit = async (e)=>{
        e.preventDefault();

        if(password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }

        // const formdata = new FormData();
        
        // formdata.append('username', username);
        // formdata.append('email', email);
        // formdata.append('password', password);

        // for(let [key, value] of formdata.entries()){
        //     console.log(`${key}: ${value}`);
        // }

        setIsLoading(true);
        setError('');

        try {
          const response = await fetch('http://localhost:3000/auth/register', {
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

          // setError('');
          setUsername('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setTermsAgree(false);

          setTimeout(()=>{
            navigate('/login');
          }, 2000);

          // console.log("Registration completed", data);

        } catch (error) {
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