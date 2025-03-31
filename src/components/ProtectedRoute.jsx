import React from 'react'
import { useAuth } from '../context/AuthProvider'
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const {isAuthenticated, loading} = useAuth();
  if(loading){
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  return isAuthenticated ? <Outlet/> : <Navigate to='/login' />
}

export default ProtectedRoute