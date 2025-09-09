import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const LoginForm = () => {
  // State Management
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    fullname: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  
  // Auth store hooks
  const { login, isLoggingIn } = useAuthStore();
  const { signup, isSigningUp } = useAuthStore();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Real-time field validation
  const validateField = (name, value) => {
    let errorMsg = '';
    
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
    e.preventDefault();
    if (!validateForm()) return;

    if (isLoginView) {
      await login({ 
        email: formData.email, 
        password: formData.password 
      });
    } else {
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
    <div className="login-form-container">
      <div className="form-wrapper">
        <h2 className="form-title">
          {isLoginView ? 'Welcome Back' : 'Create Account'}
        </h2>

        <p className="form-subtitle">
          {isLoginView 
            ? 'Enter your credentials to access your account.' 
            : 'Get started by creating your new account.'
          }
        </p>

        <form noValidate onSubmit={handleSubmit}>
          {/* Full Name Field (Signup only) */}
          {!isLoginView && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
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

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="you@example.com" 
              className={`form-input ${errors.email ? 'error' : ''}`}
              required 
              value={formData.email} 
              onChange={handleChange} 
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password" 
                placeholder="Password" 
                className={`form-input password-input ${errors.password ? 'error' : ''}`}
                required 
                value={formData.password} 
                onChange={handleChange} 
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

          {/* Confirm Password Field (Signup only) */}
          {!isLoginView && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
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

          {/* Submit Button */}
          <div className="form-group">
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isLoggingIn || isSigningUp}
            >
              {(isLoggingIn || isSigningUp) 
                ? <span className="loading-spinner"></span> 
                : (isLoginView ? 'Login' : 'Sign Up')
              }
            </button>
          </div>
        </form>

        {/* Toggle View Link */}
        <div className="toggle-view">
          <p>
            {isLoginView ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <a href="#" className="toggle-link" onClick={toggleView}>
              {isLoginView ? 'Sign Up' : 'Login'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
