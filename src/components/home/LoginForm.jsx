import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/homepage/loginform.css';
import axios from 'axios';
import { msalInstance, initializeMsalInstance } from '../../config/msalConfig';
import { InteractionType } from '@azure/msal-browser';
import { loginForm, resetPassword } from '../../service/LoginForm';


const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')
  const [error, setError] = useState('');
  const [session, setSession] = useState({})
  const [forgotPassword, setForgotPassWord] = useState(false)
  const [isSendPassword, setIsSendPassword] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem("session")) {
      navigate('/')
    }
  }, [])

  const handleTogglePassword = () => {
    setForgotPassWord(!forgotPassword)
  }

  const handleResendPassword = async (e) => {
    e.preventDefault();
    try {
      const data = await resetPassword(email)
      console.log(data)
    } catch (e) {
      console.log(e)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const data = await loginForm(username, password);
      setSession(data.data)
      setError("")
      if(data && data.status === 200) {
        console.log(data)
        localStorage.setItem("session", JSON.stringify(data.data.data.session_id))
        localStorage.setItem("username", data.data.username)
        localStorage.setItem("role", data.data.role)
        localStorage.setItem("userid", data.data.user_id)
        navigate('/')
      }

    } catch (error) {
      console.error('Error logging in:', error);
      setError("Wrong Username or Password")
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
      <div className={`login-container ${forgotPassword ? 'disable' : ''}`}>
        <form className="login-form" onSubmit={handleSubmit}>
          <img
            src="https://upload.wikimedia.org/wikipedia/vi/8/8b/Logo_Petrovietnam.svg"
            alt="Petrovietnam Logo"
            className="logo"
          />
              <div className={`login-form-container ${forgotPassword ? 'disable' : ''}`}>

              <div className={`login-form-normal `}>
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
                <p onClick={handleTogglePassword} className='forgot-password-button'>Forgot Password?</p>
                <button type="submit">Login</button>
                <div className='line-split-login'></div>
                <button className='button-login-microsoft' type="button" onClick={handleMicrosoftLogin}>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjR8068a50hnJwYx1pzj6iG5VsKAcFz4732w&s" alt="" />
                  Sign in with Microsoft
                </button>
              </div>


               <div className={`login-form-forgot ${forgotPassword ? 'disable' : ''}`}>
                <h2>Reset Password</h2>
                  <div>
                  
                  {!isSendPassword ? (
                  <div className="forgot-password-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                     type="email"
                      id="email"
                      name="email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>
                  ) : (
                  <p>A new password will be sent to you by email, please check your email (spam).</p>
                  )}
                  <div className="forgot-password-actions">
                    <span onClick={handleTogglePassword} className={`back-to-login ${isSendPassword ? 'success' : ''}`} >Back to Login</span>
                    <span onClick={handleResendPassword} className={`send-password ${isSendPassword ? 'disable' : ''}`} type="submit" >Reset Password</span>
                </div>
                  </div>
              </div>
              </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;