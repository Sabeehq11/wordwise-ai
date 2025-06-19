import React, { useState, useEffect, useRef } from 'react';
import { updateDocument } from '../firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useGrammar } from '../contexts/GrammarContext';
import GrammarSuggestions from './GrammarSuggestions';

const Editor = ({ document, onDocumentUpdate, isPublic = false }) => {
  const { currentUser } = useAuth();
  const { checkTextGrammar, corrections, stats, loading: grammarLoading, checkGrammarNow } = useGrammar();
  
  // Create a unique key for localStorage based on document or session
  const storageKey = document ? `editor-${document.id}` : 'editor-public-session';
  
  // Initialize content from localStorage first, then document
  const getInitialContent = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) return saved;
    }
    return document ? document.content || '' : '';
  };

  const [content, setContent] = useState(getInitialContent);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveError, setSaveError] = useState(null);
  
  const saveTimeoutRef = useRef(null);
  const textareaRef = useRef(null);

  // Save to localStorage whenever content changes
  useEffect(() => {
    if (typeof window !== 'undefined' && content !== undefined) {
      localStorage.setItem(storageKey, content);
    }
  }, [content, storageKey]);

  // Calculate stats when content changes
  useEffect(() => {
    const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
    const chars = content.length;
    
    setWordCount(words);
    setCharCount(chars);
  }, [content]);

  // Auto-save functionality with debounce (only for authenticated users)
  useEffect(() => {
    if (document && content !== undefined && currentUser && !isPublic) {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Only save if content has actually changed from the original
      if (content !== (document.content || '')) {
        saveTimeoutRef.current = setTimeout(async () => {
          await saveDocument();
        }, 3000); // 3 second debounce
      }
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content]);

  // Real-time grammar checking with smart debouncing
  useEffect(() => {
    if (content.trim() && content.length > 5) { // Reduced minimum length for faster feedback
      console.log('🔍 Auto-checking triggered for content:', content.substring(0, 50) + '...');
      checkTextGrammar(content);
    }
  }, [content, checkTextGrammar]);

  const saveDocument = async () => {
    if (!document || !currentUser) {
      console.log('Cannot save: missing document or user');
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      
      await updateDocument(document.id, {
        content,
        wordCount,
        charCount
      });
      
      setLastSaved(new Date());
      
      // Notify parent component if callback provided (deferred to prevent re-render flicker)
      if (onDocumentUpdate) {
        setTimeout(() => onDocumentUpdate(), 0);
      }
      
    } catch (error) {
      console.error('Save error:', error);
      setSaveError(error.message);
      
      // Show user-friendly error message
      if (error.code === 'permission-denied') {
        alert('Permission denied: You can only edit your own documents.');
      } else if (error.code === 'not-found') {
        alert('Document not found. It may have been deleted.');
      } else {
        alert(`Failed to save document: ${error.message}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (document && currentUser && !isPublic) {
      await saveDocument();
    }
  };

  const handleManualGrammarCheck = async () => {
    if (content.trim() && checkGrammarNow) {
      await checkGrammarNow(content);
    }
  };

  // Apply a grammar correction to the text
  const handleApplyCorrection = (original, corrected) => {
    const newContent = content.replace(original, corrected);
    setContent(newContent);
    
    // Trigger a new grammar check after applying correction
    setTimeout(() => {
      if (checkGrammarNow) {
        checkGrammarNow(newContent);
      }
    }, 100);
  };

  // Clear localStorage data
  const handleClearText = () => {
    if (confirm('Are you sure you want to clear all text? This cannot be undone.')) {
      setContent('');
      localStorage.removeItem(storageKey);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const formatSaveTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString();
  };

  // Show setup notice for public pages (homepage)
  if (isPublic) {
    return (
      <div className="editor-container">
        <div className="editor-stats">
          <span>Words: {wordCount}</span>
          <span>Characters: {charCount}</span>
          {content.trim() && (
            <button 
              onClick={handleClearText}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.75rem',
                marginLeft: '1rem'
              }}
            >
              Clear Text
            </button>
          )}
        </div>
        
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h4 style={{ color: '#92400e', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            📝 Grammar Feedback Tool
          </h4>
          <p style={{ color: '#92400e', fontSize: '0.875rem', margin: 0 }}>
            This tool provides grammar feedback only - your text will never be changed automatically. Sign up to save your documents!
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing to see grammar feedback... Your text will never be changed automatically!"
            style={{
              minHeight: '300px',
              resize: 'vertical'
            }}
          />
        </div>
        
        {content.trim() && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleManualGrammarCheck}
              disabled={grammarLoading}
              style={{
                backgroundColor: grammarLoading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                cursor: grammarLoading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {grammarLoading ? 'Checking...' : '🔍 Check Grammar'}
            </button>
          </div>
        )}
        
        {/* Show grammar suggestions for public page */}
        {content.trim() && (
          <div style={{ marginTop: '1rem' }}>
            <GrammarSuggestions 
              onManualCheck={handleManualGrammarCheck}
              currentContent={content}
              onApplyCorrection={handleApplyCorrection}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="editor-layout">
      <div className="editor-panel">
        <div className="editor-container">
          <div className="editor-header">
            <div className="editor-stats">
              <span>Words: {wordCount}</span>
              <span>Characters: {charCount}</span>
              {stats && stats.words > 0 && (
                <>
                  <span>Sentences: {stats.sentences}</span>
                  <span>Issues: {corrections ? corrections.length : 0}</span>
                </>
              )}
            </div>
            
            <div className="editor-actions">
              {content.trim() && (
                <>
                  <button 
                    onClick={handleManualGrammarCheck}
                    disabled={grammarLoading}
                    style={{
                      backgroundColor: grammarLoading ? '#9ca3af' : '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.25rem',
                      cursor: grammarLoading ? 'not-allowed' : 'pointer',
                      fontSize: '0.75rem',
                      marginRight: '0.5rem'
                    }}
                  >
                    {grammarLoading ? 'Checking...' : '🔍 Check'}
                  </button>
                  
                  <button 
                    onClick={handleClearText}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      marginRight: '0.5rem'
                    }}
                  >
                    Clear
                  </button>
                </>
              )}
              
              <button 
                onClick={handleManualSave}
                disabled={isSaving || !currentUser}
                style={{
                  backgroundColor: isSaving ? '#9ca3af' : '#6366f1',
                  color: 'white',
                  border: 'none',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                {isSaving ? 'Saving...' : '💾 Save'}
              </button>
              
              {lastSaved && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280',
                  marginLeft: '0.5rem'
                }}>
                  Saved at {formatSaveTime(lastSaved)}
                </span>
              )}
            </div>
          </div>
          
          <div style={{ position: 'relative', flex: 1 }}>
            <textarea
              ref={textareaRef}
              className="editor-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isPublic 
                ? "Start typing your essay here... (Sign up to save your work!)" 
                : "Start writing your essay here... Text is saved automatically and never changed by the grammar checker."
              }
              style={{
                border: saveError ? '2px solid #dc2626' : '1px solid #d1d5db',
                minHeight: '400px',
                resize: 'vertical'
              }}
            />
          </div>
          
          {saveError && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.25rem',
              padding: '0.5rem',
              marginTop: '0.5rem'
            }}>
              <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>
                ⚠️ Save Error: {saveError}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="suggestions-panel">
        <GrammarSuggestions 
          onManualCheck={handleManualGrammarCheck}
          currentContent={content}
          onApplyCorrection={handleApplyCorrection}
        />
      </div>
    </div>
  );
};

export default Editor; 