import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GrammarProvider } from './contexts/GrammarContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import TryIt from './pages/TryIt';

// Theme configuration - now with dark theme
const themes = {
  blue: {
    name: 'Ocean Blue',
    bg: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #f3e8ff 100%)',
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#8b5cf6',
    isDark: false
  },
  green: {
    name: 'Forest Green',
    bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #dcfce7 100%)',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#65a30d',
    isDark: false
  },
  purple: {
    name: 'Royal Purple',
    bg: 'linear-gradient(135deg, #f3e8ff 0%, #e879f9 20%, #fdf4ff 100%)',
    primary: '#a855f7',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    isDark: false
  },
  dark: {
    name: 'Midnight Dark',
    bg: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    primary: '#4f46e5',
    secondary: '#7c3aed',
    accent: '#06b6d4',
    isDark: true,
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    cardBg: 'rgba(30, 41, 59, 0.8)',
    navbarBg: 'rgba(15, 23, 42, 0.95)'
  }
};

// Apply theme to CSS custom properties
const applyThemeToDocument = (theme) => {
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-accent', theme.accent);
  root.style.setProperty('--theme-bg', theme.bg);
  
  // Set theme-specific text colors
  if (theme.isDark) {
    root.style.setProperty('--theme-text-primary', theme.textPrimary);
    root.style.setProperty('--theme-text-secondary', theme.textSecondary);
    root.style.setProperty('--theme-card-bg', theme.cardBg);
    root.style.setProperty('--theme-navbar-bg', theme.navbarBg);
    document.body.style.color = theme.textPrimary;
  } else {
    root.style.setProperty('--theme-text-primary', '#1f2937');
    root.style.setProperty('--theme-text-secondary', '#6b7280');
    root.style.setProperty('--theme-card-bg', 'rgba(255, 255, 255, 0.95)');
    root.style.setProperty('--theme-navbar-bg', 'rgba(255, 255, 255, 0.95)');
    document.body.style.color = '#1f2937';
  }
  
  // Apply to body background as well for global theming
  document.body.style.background = theme.bg;
  document.body.style.minHeight = '100vh';
};

function App() {
  const [currentTheme, setCurrentTheme] = useState('blue');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('wordwise-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const theme = themes[currentTheme];
    applyThemeToDocument(theme);
  }, [currentTheme]);

  const changeTheme = (themeKey) => {
    setCurrentTheme(themeKey);
    localStorage.setItem('wordwise-theme', themeKey);
    const theme = themes[themeKey];
    applyThemeToDocument(theme);
  };

  const theme = themes[currentTheme];

  return (
    <Router>
      <AuthProvider>
        <GrammarProvider>
          <div 
            className="min-h-screen transition-all duration-500"
            style={{ background: theme.bg }}
          >
            <Navbar theme={theme} themes={themes} currentTheme={currentTheme} onThemeChange={changeTheme} />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
              <Routes>
                <Route path="/" element={<Home theme={theme} />} />
                <Route path="/try" element={<TryIt theme={theme} />} />
                <Route path="/login" element={<Login theme={theme} />} />
                <Route path="/signup" element={<Signup theme={theme} />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard theme={theme} />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/account" 
                  element={
                    <ProtectedRoute>
                      <Account theme={theme} />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
        </GrammarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
