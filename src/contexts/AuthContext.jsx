import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { signUp, signIn, logOut } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sign up function
  const signup = async (email, password, displayName) => {
    setError('');
    try {
      return await signUp(email, password, displayName);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in function
  const login = async (email, password) => {
    setError('');
    try {
      return await signIn(email, password);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Log out function
  const logout = async () => {
    setError('');
    try {
      await logOut();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    setError('');
  };

  useEffect(() => {
    console.log('AuthContext: Setting up Firebase auth listener...');
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('AuthContext: Firebase auth taking too long, proceeding anyway...');
      setLoading(false);
    }, 5000); // 5 second timeout

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('AuthContext: Auth state changed:', user ? 'User logged in' : 'User logged out');
        clearTimeout(timeoutId);
        setCurrentUser(user);
        setLoading(false);
      }, (error) => {
        console.error('AuthContext: Auth state change error:', error);
        clearTimeout(timeoutId);
        setError(error.message);
        setLoading(false);
      });

      return () => {
        clearTimeout(timeoutId);
        unsubscribe();
      };
    } catch (error) {
      console.error('AuthContext: Failed to set up auth listener:', error);
      clearTimeout(timeoutId);
      setError(error.message);
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    error,
    clearError,
    loading
  };

  // Always render children, but show loading state when needed
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Loading WordWise...
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}; 