import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GrammarProvider } from './contexts/GrammarContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import TryIt from './pages/TryIt';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GrammarProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/try-it" element={<TryIt />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </GrammarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
