import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiEdit3, FiCheck, FiClock, FiZap, FiTrash2 } from 'react-icons/fi';
import GrammarSuggestions from './GrammarSuggestions';

const Editor = ({ theme }) => {
  const { currentUser } = useAuth();
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  // Mock grammar check function
  const checkGrammar = async () => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    setIsChecking(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockSuggestions = [
        {
          id: 1,
          type: 'grammar',
          original: 'My name sabeeh is',
          suggested: 'My name is Sabeeh',
          explanation: 'The correct word order in English for stating one\'s name is \'My name is [Name].\' Additionally, names should be capitalized.',
          position: { start: 0, end: 17 }
        },
        {
          id: 2,
          type: 'grammar',
          original: 'my brother name wajeeh is',
          suggested: 'My brother\'s name is Wajeeh',
          explanation: 'The correct possessive form is \'brother\'s\' to indicate that the name belongs to the brother. Also, names and the first word of a sentence should be capitalized.',
          position: { start: 18, end: 43 }
        }
      ];
      
      setSuggestions(mockSuggestions);
      setIsChecking(false);
    }, 1500);
  };

  const applySuggestion = (suggestion) => {
    const newText = text.replace(suggestion.original, suggestion.suggested);
    setText(newText);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const clearText = () => {
    setText('');
    setSuggestions([]);
  };

  useEffect(() => {
    if (autoSave && text && currentUser) {
      const timer = setTimeout(() => {
        setLastSaved(new Date());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [text, autoSave, currentUser]);

  return (
    <div 
      className="min-h-screen p-8"
      style={{
        background: `linear-gradient(135deg, ${theme?.colors?.primary}05 0%, ${theme?.colors?.secondary}05 50%, ${theme?.colors?.accent}05 100%)`
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Beautiful Header */}
        <div 
          className="mb-8 p-6 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #ffffff 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="p-4 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${theme?.colors?.primary || 'var(--theme-primary)'}, ${theme?.colors?.secondary || 'var(--theme-secondary)'})`
                }}
              >
                <FiEdit3 className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Document Editor</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {currentUser && autoSave && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiCheck className="text-green-500 w-5 h-5" />
                  <span className="font-medium">Auto-save enabled</span>
                </div>
              )}
              
              {lastSaved && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiClock className="text-blue-500 w-5 h-5" />
                  <span className="font-medium">Saved {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Side by Side Layout with Proper Spacing */}
        <div className="flex h-[calc(100vh-250px)]">
          {/* Left Side - Text Editor */}
          <div 
            className="flex-shrink-0 w-1/2 mr-8"
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #ffffff 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="p-8 h-full flex flex-col">
              {/* Editor Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Write Your Text</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={checkGrammar}
                    disabled={isChecking || !text.trim()}
                    className="group relative flex items-center space-x-2 px-8 py-4 font-bold rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
                    style={{
                      background: isChecking 
                        ? 'linear-gradient(135deg, #9CA3AF, #6B7280)' 
                        : `linear-gradient(135deg, ${theme?.colors?.primary || 'var(--theme-primary)'}, ${theme?.colors?.secondary || 'var(--theme-secondary)'})`,
                      color: 'white',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                      border: '2px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    {isChecking ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span className="relative z-10">Checking...</span>
                      </>
                    ) : (
                      <>
                        <FiZap className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Check Grammar</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={clearText}
                    className="group relative flex items-center space-x-2 px-8 py-4 font-bold rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #F8FAFC, #E2E8F0)',
                      color: '#475569',
                      boxShadow: '0 12px 30px rgba(71, 85, 105, 0.15)',
                      border: '2px solid rgba(148, 163, 184, 0.3)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <FiTrash2 className="w-5 h-5 relative z-10 group-hover:text-red-600 transition-colors duration-300" />
                    <span className="relative z-10 group-hover:text-red-600 transition-colors duration-300">Clear</span>
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <div className="flex-1 flex flex-col">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start writing here to get AI-powered grammar suggestions..."
                  className="flex-1 w-full resize-none border-none outline-none p-8 text-gray-800 placeholder-gray-500 transition-all duration-300 focus:shadow-inner"
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '18px',
                    lineHeight: '1.8',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #ffffff 100%)',
                    borderRadius: '20px',
                    minHeight: '450px',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                />
                
                {/* Stats */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-6">
                    <span className="font-semibold flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>{text.length} characters</span>
                    </span>
                    <span className="font-semibold flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>{text.split(/\s+/).filter(word => word.length > 0).length} words</span>
                    </span>
                  </div>
                  <div className="text-gray-500 italic">Keep typing for real-time analysis</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Grammar Suggestions */}
          <div className="flex-1">
            <GrammarSuggestions 
              suggestions={suggestions}
              isLoading={isChecking}
              onApplySuggestion={applySuggestion}
              theme={theme}
            />
          </div>
        </div>

        {/* Call to Action for Non-Authenticated Users */}
        {!currentUser && (
          <div 
            className="mt-8 p-8 text-center rounded-3xl"
            style={{
              background: `linear-gradient(135deg, ${theme?.colors?.primary || 'var(--theme-primary)'}10, ${theme?.colors?.secondary || 'var(--theme-secondary)'}10)`,
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 className="text-3xl font-bold gradient-text mb-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Love what you see?
            </h3>
            <p className="text-gray-600 mb-8 text-lg" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Sign up now to save your documents, track your progress, and unlock advanced AI writing features.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                className="group relative flex items-center justify-center space-x-3 px-10 py-4 font-bold text-lg rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${theme?.colors?.primary || 'var(--theme-primary)'}, ${theme?.colors?.secondary || 'var(--theme-secondary)'})`,
                  color: 'white',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <span className="relative z-10">Create Free Account</span>
              </button>
              <button 
                className="group relative flex items-center justify-center space-x-3 px-10 py-4 font-bold text-lg rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #F8FAFC, #E2E8F0)',
                  color: '#475569',
                  boxShadow: '0 12px 30px rgba(71, 85, 105, 0.15)',
                  border: '2px solid rgba(148, 163, 184, 0.3)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Sign In</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor; 