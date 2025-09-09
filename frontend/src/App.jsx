import React from 'react'
import Login from './Login/Login'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './Login/Signup'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
      </Routes>
    </div>
  )
}

export default App
