import { useEffect, useId, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import  AuthProvider  from './context/AuthProvider'
import OAuthCallback from './components/OAuthCallback'

function App() {
  
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/oauth-callback' element={<OAuthCallback/>} />
            {/* public routes */}
            <Route element={<ProtectedRoute/>}>
              <Route path='/' element={<Home/>} />
            </Route>
            {/* Fallback */}
            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
