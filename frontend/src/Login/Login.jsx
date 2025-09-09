import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempted with:', { email, password });
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="logo">MindMate</div>
        <div className="welcome-content">
          <div className="image-container">
            <img src="image.signup.png" alt="Mindful meditation" />
          </div>
          <h2>Your AI Mental Health Companion</h2>
          <p>Always available, multilingual, and culturally sensitive support for students in higher education.</p>
        </div>
      </div>
      <div className="right-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="forgot-password">
            <a href="#">Forgot your password?</a>
          </div>
          <button type="submit" className="btn-login">Log In</button>
          <div className="signup-link">
            Don't have an account? <a href="#">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
