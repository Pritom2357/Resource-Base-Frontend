import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/pages/auth/Login'
import Register from './components/pages/auth/Register'
import Home from './components/pages/home/Home' // Updated path
import ProtectedRoute from './components/routes/ProtectedRoute'
import AuthProvider from './components/context/AuthProvider'
import OAuthCallback from './components/pages/auth/OAuthCallback'
import Tags from './components/pages/home/Tags'
import Layout from './components/layout/Layout'
import ResourceDetailPage from './components/pages/resources/ResourceDetailPage'
import CreateResourcePage from './components/resources/CreateResourcePage'
import UserProfilePage from './components/pages/home/UserProfilePage'
import EditProfile from './components/pages/home/EditProfile'
import { LoadingProvider } from './components/context/LoadingContext'
import RouteChangeListener from './components/common/RouteChangeListener'
import ChangePassword from './components/pages/home/ChangePassword'
import ForgotPassword from './components/pages/home/ForgotPassword'
import SearchResults from './components/pages/home/SearchResults'
import Categories from './components/pages/home/Categories'
import BookmarksPage from './components/pages/home/BookmarksPage'
import Users from './components/pages/home/Users'
import Resources from './components/pages/home/Resources'
import { WebSocketProvider } from './components/context/WebSocketProvider'
import NotificationsPage from './components/pages/home/NotificationsPage'

function App() {
  
  return (
    <Router>
      <AuthProvider>
        <LoadingProvider>
          <WebSocketProvider>
            <RouteChangeListener />
            <Routes>
              <Route path='/login' element={<Login/>} />
              <Route path='/register' element={<Register/>} />
              <Route path='/oauth-callback' element={<OAuthCallback/>} />

              <Route element={<Layout/>}>
                <Route path='/tags' element={<Tags/>}/>
                <Route path='/' element={<Resources/>}/>
                <Route path='/resources/:id' element={<ResourceDetailPage/>}/>
                <Route path='/user/:username' element = {<UserProfilePage/>}/>
                <Route path='/profile' element = {<UserProfilePage/>}/>
                <Route path='/forgot-password' element = {<ForgotPassword/>}/>
                <Route path='/search' element = {<SearchResults/>}/>
                <Route path='/categories' element = {<Categories/>}/>
                <Route path='/users' element={<Users/>}/>
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path='/home' element={<Home/>}/>
                <Route path='/create-resource' element={<CreateResourcePage />} />
                <Route path='/profile/edit' element={<EditProfile/>}/>
                <Route path='/profile/password' element = {<ChangePassword/>}/>
                <Route path='/bookmarks' element={<BookmarksPage/>}/>
                <Route path='/notifications' element={<NotificationsPage />} />
                {/* <Route path='/edit-resource/:id' element={<EditResourcePage />} /> */}
                {/* Add any other routes that require authentication */}
              </Route>

              <Route path='*' element={<Navigate to="/" />} />
            </Routes>
          </WebSocketProvider>
        </LoadingProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
