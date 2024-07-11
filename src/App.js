import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/home/HomePage';
import Notebook from './components/Notebook';
import LoginForm from './components/home/LoginForm';
import { Provider } from 'react-redux';
import store from './redux/Store';
import ProtectedRoute from './components/home/PrivateRoute';

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
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notebook/:id" 
            element={
              <ProtectedRoute>
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