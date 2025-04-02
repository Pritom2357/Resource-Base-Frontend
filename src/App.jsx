import { useEffect, useId, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import  AuthProvider  from './context/AuthProvider'
import OAuthCallback from './components/OAuthCallback'
import Tags from './pages/Tags'
import Layout from './components/layout/Layout'
import Header from './components/layout/Header'
import ResourceDetailPage from './pages/ResourceDetailPage'
import CreateResourcePage from './pages/CreateResourcePage'

function App() {
  
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/oauth-callback' element={<OAuthCallback/>} />
            <Route path='/test' element={<div className="p-10 bg-blue-100">Test Route Works!</div>} />
            <Route element={<Layout/>}>
              <Route path='/' element={<Home/>}/>
              <Route path='/tags' element={<Tags/>}/>
              <Route path='/resources/:id' element={<ResourceDetailPage/>}/>
              <Route path='/create-resource' element={<CreateResourcePage />} />
            </Route>
            <Route path='*' element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
