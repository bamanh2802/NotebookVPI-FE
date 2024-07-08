import React, { useState, useEffect } from 'react';
import '../../css/homepage/loginform.css';
import axios from 'axios';
import { msalInstance, initializeMsalInstance } from '../../config/msalConfig';
import { InteractionType } from '@azure/msal-browser';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        username: username,
        password: password,
      });

      console.log(response.data);
    } catch (error) {
      // Handle error
      console.error('Login error:', error.response);
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  useEffect(() => {
    initializeMsalInstance();
  }, []);

  const handleMicrosoftLogin = async () => {
    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["user.read"],
        prompt: "select_account"
      });

      console.log('Microsoft login response:', loginResponse);
      // Handle successful login
      // You can send the loginResponse.accessToken to your backend if needed
    } catch (error) {
      console.error('Microsoft login error:', error);
      setError('Microsoft login failed');
    }
  };

  return (
    <div className='login-body'>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <img
            src="https://upload.wikimedia.org/wikipedia/vi/8/8b/Logo_Petrovietnam.svg"
            alt="Petrovietnam Logo"
            className="logo"
          />
          <h2>NotebookVPI Login</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className='forgot-password-button'>Forgot Password?</p>
          <button type="submit">Login</button>
          <div className='line-split-login'></div>
          <button className='button-login-microsoft' type="button" onClick={handleMicrosoftLogin}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjR8068a50hnJwYx1pzj6iG5VsKAcFz4732w&s" alt="" />
            Sign in with Microsoft
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;