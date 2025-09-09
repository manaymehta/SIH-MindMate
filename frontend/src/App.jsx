import React from 'react'
import Login from './Login/Login'
import { Navigate, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login/>} />
      </Routes>
    </div>
  )
}

export default App
