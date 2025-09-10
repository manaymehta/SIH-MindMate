import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import signupImage from './image.signup.png'; // Import the image

const Login = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const { login, isLoggingIn, signup, isSigningUp } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

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

  const toggleView = (e) => {
    e.preventDefault();
    setIsLoginView(!isLoginView);
    setErrors({});
    setFormData({ fullname: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="login-page-wrapper">
      <div className="container">
        <div className="left-panel">
          <div className="logo">MindMate</div>
          <div className="welcome-content">
            <div className="image-container">
              <img src={signupImage} alt="Mindful meditation" />
            </div>
            <h2>Your AI Mental Health Companion</h2>
            <p>
              Always available, multilingual, and culturally sensitive support
              for students in higher education.
            </p>
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
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
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
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
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
                {errors.fullname && (
                  <span className="error-message">{errors.fullname}</span>
                )}
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
                  className={`form-input ${
                    errors.confirmPassword ? 'error' : ''
                  }`}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            <div className="forgot-password">
              <a href="#">Forgot your password?</a>
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={isLoggingIn || isSigningUp}
            >
              {isLoggingIn || isSigningUp ? (
                <span className="loading-spinner"></span>
              ) : isLoginView ? (
                'Log In'
              ) : (
                'Sign Up'
              )}
            </button>

            <div className="signup-link">
              {isLoginView
                ? "Don't have an account?"
                : 'Already have an account?'}{' '}
              <a href="#" onClick={toggleView}>
                {isLoginView ? 'Sign Up' : 'Log In'}
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Scoped styles */}
      <style jsx>{`
        .login-page-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          display: flex;
          flex-direction: column;
          max-width: 1100px;
          width: 100%;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(90, 78, 66, 0.08);
        }
        @media (min-width: 900px) {
          .container {
            flex-direction: row;
            min-height: 600px;
          }
        }
        .left-panel {
          flex: 1;
          background: linear-gradient(135deg, #faf8f4 0%, #e8e1d4 100%);
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }
        .logo {
          position: absolute;
          top: 30px;
          left: 30px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #5a4e42;
        }
        .logo::after {
          content: '™';
          font-size: 10px;
          vertical-align: super;
          margin-left: 2px;
        }
        .image-container {
          margin: 20px 0;
        }
        .image-container img {
          width: 450px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(90, 78, 66, 0.08);
        }
        .welcome-content {
          max-width: 500px;
        }
        .welcome-content h2 {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 26px;
          margin-bottom: 20px;
          color: #5a4e42;
          line-height: 1.3;
        }
        .welcome-content p {
          color: #8a7c6c;
          font-size: 16px;
          margin-bottom: 30px;
        }
        .right-panel {
          flex: 1;
          padding: 40px 30px;
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .login-form {
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
        }
        .login-form h2 {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 24px;
          margin-bottom: 25px;
          color: #5a4e42;
          text-align: center;
        }
        .form-group {
          margin-bottom: 18px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #5a4e42;
          font-size: 15px;
        }
        .form-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #e8e1d4;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          background-color: #faf8f4;
          color: #5a4e42;
        }
        .form-input:focus {
          outline: none;
          border-color: #a5c8a4;
          box-shadow: 0 0 0 3px rgba(165, 200, 164, 0.2);
        }
        .error {
          border-color: red;
        }
        .error-message {
          font-size: 13px;
          color: red;
          margin-top: 5px;
          display: block;
        }
        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .password-toggle {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #5a4e42;
        }
        .forgot-password {
          font-size: 14px;
          margin-bottom: 20px;
          text-align: right;
        }
        .forgot-password a {
          color: #4c774a;
          text-decoration: none;
        }
        .forgot-password a:hover {
          text-decoration: underline;
        }
        .btn-login {
          width: 100%;
          padding: 16px;
          background-color: #a5c8a4;
          color: #5a4e42;
          border: none;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 20px;
        }
        .btn-login:hover {
          background-color: #4c774a;
          color: white;
          transform: translateY(-2px);
        }
        .signup-link {
          text-align: center;
          font-size: 15px;
          color: #8a7c6c;
        }
        .signup-link a {
          color: #4c774a;
          text-decoration: none;
          font-weight: 500;
        }
        .signup-link a:hover {
          text-decoration: underline;
        }
        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid white;
          border-top: 2px solid transparent;
          border-radius: 50%;
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
