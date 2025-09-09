import React from 'react';
import './SignUp.css'; // Import the stylesheet
//import signupImage from './image.signup.png'; // Make sure to place your image in the same folder

const SignUp = () => {
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
        <form className="signup-form">
          <h2>Create Your Account</h2>

          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Contact Number</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" required />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select id="gender" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a secure password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="btn-signup">
            Create Account
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