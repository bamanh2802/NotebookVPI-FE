import React, { useState } from 'react';
import '../../css/homepage/loginform.css'
import axios from 'axios';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('localhost:3000/api/login', {
            username: username,
            password: password
        });

        console.log(response.data);
    } catch (error) {
        // Handle error
        console.error('Login error:', error.response);
        // setError(error.response.data.message);
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
        <h2>NotebookPVI Login</h2>
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
        <button type="submit">Login</button>
      </form>
    </div>
   </div>
  );
};

export default LoginForm;