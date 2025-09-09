import React, { useState } from 'react';
import './SignUp.css'; // Import the stylesheet
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const { signup, isSigningUp } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = '';

    if (name === 'fullname' && value.trim() === '') {
      errorMsg = 'Full name is required.';
    }
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorMsg = 'Please enter a valid email.';
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

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email.';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    await signup(formData);
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="logo">MindMate</div>
        <div className="welcome-content">
          <div className="image-container">
            {/* Use the imported image */}
            {/*<img src={signupImage} alt="Mindful meditation" />*/}
          </div>
          <h2>Your AI Mental Health Companion</h2>
          <p>
            Always available, multilingual, and culturally sensitive support for
            students in higher education.
          </p>
          <ul className="features">
            <li>
              <i className="fas fa-shield-alt"></i> 24×7 Stigma-Free Support
            </li>
            <li>
              <i className="fas fa-chart-line"></i> Mood Tracking & Early Stress
              Detection
            </li>
            <li>
              <i className="fas fa-hand-holding-heart"></i> Escalation to
              Counselor When Needed
            </li>
            <li>
              <i className="fas fa-globe"></i> Multilingual & Culturally
              Sensitive
            </li>
          </ul>
        </div>
      </div>

      <div className="right-panel">
        <form className="signup-form" noValidate onSubmit={handleSubmit}>
          <h2>Create Your Account</h2>

          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Enter your full name"
              className={`form-input ${errors.fullname ? 'error' : ''}`}
              value={formData.fullname}
              onChange={handleChange}
              required
            />
            {errors.fullname && <span className="error-message">{errors.fullname}</span>}
          </div>

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
            <label htmlFor="phone">Contact Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Create a secure password"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn-signup" disabled={isSigningUp}>
            {isSigningUp ? <span className="loading-spinner"></span> : 'Create Account'}
          </button>

          <div className="login-link">
            Already have an account? <a href="#">Log In</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;