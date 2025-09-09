import React, { useState } from 'react';
import './Login.css';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Login = () => {
  const [isLoginView, setIsLoginView] = useState(true); // Added state for view toggle
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '', // Added fullname for signup
    email: '',
    password: '',
    confirmPassword: '' // Added confirmPassword for signup
  });
  const [errors, setErrors] = useState({});

  const { login, isLoggingIn, signup, isSigningUp } = useAuthStore(); // Added signup and isSigningUp

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Real-time field validation
  const validateField = (name, value) => {
    let errorMsg = '';
    
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(value)) {
      errorMsg = 'Please enter a valid email.';
    }
    if (!isLoginView && name === 'fullname' && value.trim() === '') {
      errorMsg = 'Full name is required.';
    }
    if (name === 'password' && value.length < 6) {
      errorMsg = 'Password must be at least 6 characters.';
    }
    if (name === 'confirmPassword' && value !== formData.password) {
      errorMsg = 'Passwords do not match.';
    }
    
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  // Complete form validation before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!isLoginView && !formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required.';
    }
    if (!/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email.';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (!isLoginView && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    console.log("Form submitted with data:", formData);
    e.preventDefault();
    

    if (isLoginView) {
      await login({ 
        
        email: formData.email, 
        password: formData.password 
      });
    } else {
      console.log("Signing in with data:", formData);
      await signup({
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
    }
  };

  // Toggle between login and signup views
  const toggleView = (e) => {
    e.preventDefault();
    setIsLoginView(!isLoginView);
    setErrors({});
    setFormData({ fullname: '', email: '', password: '', confirmPassword: '' });
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
        <form className="login-form" noValidate onSubmit={handleSubmit}>
          <h2>{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          {!isLoginView && (
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input 
                type="text" 
                id="fullname" 
                name="fullname" 
                placeholder="John Doe" 
                className={`form-input ${errors.fullname ? 'error' : ''}`}
                required 
                value={formData.fullname} 
                onChange={handleChange} 
              />
              {errors.fullname && <span className="error-message">{errors.fullname}</span>}
            </div>
          )}
          {!isLoginView && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="Confirm Password" 
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                required 
                value={formData.confirmPassword} 
                onChange={handleChange} 
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}
          <div className="forgot-password">
            <a href="#">Forgot your password?</a>
          </div>
          <button type="submit" className="btn-login" disabled={isLoggingIn || isSigningUp}>
            {(isLoggingIn || isSigningUp) ? <span className="loading-spinner"></span> : (isLoginView ? 'Log In' : 'Sign Up')}
          </button>
          <div className="signup-link">
            {isLoginView ? "Don't have an account?" : 'Already have an account?'} <a href="#" onClick={toggleView}>{isLoginView ? 'Sign Up' : 'Log In'}</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
