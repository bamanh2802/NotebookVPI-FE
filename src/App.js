import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, React, useEffect } from 'react';
import HomePage from './components/home/HomePage';
import Notebook from './components/Notebook';
import LoginForm from './components/home/LoginForm';
import { Provider } from 'react-redux';
import store from './redux/Store';
import ProtectedRoute from './components/home/PrivateRoute';
import SessionManager from './components/home/SessionManager';

function App() {
  
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <SessionManager />
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notebook/:id" 
            element={
              <ProtectedRoute>
                <SessionManager />
                <Notebook />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;