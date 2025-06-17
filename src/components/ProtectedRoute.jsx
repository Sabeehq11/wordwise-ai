import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 