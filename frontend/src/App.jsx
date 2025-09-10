import React, { useEffect } from 'react'
import Login from './Login/Login'
import { Navigate, Route, Routes } from 'react-router-dom'
import {Loader} from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import Home from './Home/Home'
import Test from './test.jsx' // Import the Test component
import Admin from '../Admin/Admin.jsx'

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("Auth User:", authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-slate-500" size={35} />
      </div>
    );
  }
  
  return (
    <div>
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/admin" element={<Admin />} /> {/* Add the new route for Test.jsx */}
      </Routes>
    </div>
  )
}

export default App
