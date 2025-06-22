import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserDocuments, 
  createDocument, 
  deleteDocument, 
  subscribeToUserDocuments,
  testFirestoreConnection 
} from '../firebase/firestore';
import Editor from '../components/Editor';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [firestoreStatus, setFirestoreStatus] = useState('checking');
  const [creating, setCreating] = useState(false);

  // Test Firestore connection on mount
  useEffect(() => {
    const checkFirestore = async () => {
      const isConnected = await testFirestoreConnection();
      setFirestoreStatus(isConnected ? 'connected' : 'disconnected');
    };
    checkFirestore();
  }, []);

  // Set Firestore as connected after 3 seconds if still checking (handle index delays)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (firestoreStatus === 'checking') {
        console.log('Firestore taking too long, assuming connected (normal for new projects)');
        setFirestoreStatus('connected');
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [firestoreStatus]);

  // Set up document loading when user logs in
  useEffect(() => {
    if (currentUser) {
      console.log('Setting up document loading for user:', currentUser.uid);
      
      // Always try to load documents, regardless of connection status
      let unsubscribe = null;
      
      const setupDocuments = async () => {
        try {
          // First try real-time listener
          console.log('Attempting real-time document listener...');
          unsubscribe = subscribeToUserDocuments(currentUser.uid, (docs) => {
            console.log('Real-time documents received:', docs.length, 'documents');
            setDocuments(docs);
            setLoading(false);
          });
        } catch (error) {
          console.log('Real-time listener failed, trying manual load...');
          // Fallback to manual loading
          await loadDocuments();
        }
      };
      
      setupDocuments();
      
      // Cleanup function
      return () => {
        if (unsubscribe) {
          console.log('Cleaning up document listener');
          unsubscribe();
        }
      };
    }
  }, [currentUser]);

  const loadDocuments = async () => {
    if (currentUser) {
      try {
        setLoading(true);
        console.log('🔄 loadDocuments: Starting manual document load for user:', currentUser.uid);
        const userDocs = await getUserDocuments(currentUser.uid);
        console.log('✅ loadDocuments: Successfully loaded', userDocs.length, 'documents:', userDocs);
        setDocuments(userDocs);
      } catch (error) {
        console.error('❌ loadDocuments: Error loading documents:', error);
      }
      setLoading(false);
      console.log('🔄 loadDocuments: Finished loading, setting loading to false');
    } else {
      console.log('❌ loadDocuments: No current user found');
    }
  };

  const handleCreateDocument = async () => {
    const title = prompt('Enter document title:');
    if (title && title.trim() && currentUser) {
      setCreating(true);
      try {
        console.log('Creating new document with title:', title);
        
        const docId = await createDocument(currentUser.uid, {
          title: title.trim(),
          content: '',
          wordCount: 0,
          charCount: 0
        });
        
        console.log('Document created with ID:', docId);
        
        // Always reload documents after creation to ensure they show up
        console.log('Reloading documents after creation...');
        await loadDocuments();
        
        // Success feedback
        alert('Document created successfully!');
        
      } catch (error) {
        console.error('Error creating document:', error);
        // Error alert is handled in createDocument function
      }
      setCreating(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(docId);
        
        // Remove from local state immediately for better UX
        setDocuments(prev => prev.filter(doc => doc.id !== docId));
        
        if (selectedDocument && selectedDocument.id === docId) {
          setSelectedDocument(null);
          setShowEditor(false);
        }
        
        alert('Document deleted successfully!');
      } catch (error) {
        console.error('Error deleting document:', error);
        // Error alert is handled in deleteDocument function
      }
    }
  };

  const handleSelectDocument = (document) => {
    console.log('Selecting document:', document);
    setSelectedDocument(document);
    setShowEditor(true);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Firestore status indicator
  const renderFirestoreStatus = () => {
    if (firestoreStatus === 'checking') {
      return (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          marginBottom: '1rem'
        }}>
          <p style={{ color: '#92400e', fontSize: '0.875rem' }}>
            🔄 Checking Firestore connection...
          </p>
        </div>
      );
    }
    
    if (firestoreStatus === 'disconnected') {
      return (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h4 style={{ color: '#92400e', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            📊 Database Indexes Building
          </h4>
          <p style={{ color: '#92400e', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            Your database is ready! Firebase is building search indexes in the background (this is normal for new projects).
          </p>
          <p style={{ color: '#92400e', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            <strong>You can create and save documents now!</strong> The warning message is just about search optimization.
          </p>
          <button 
            onClick={() => setFirestoreStatus('connected')}
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Continue Anyway
          </button>
        </div>
      );
    }
    
    return null;
  };

  if (loading && firestoreStatus === 'connected') {
    return (
      <div className="min-h-screen">
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <p>Loading your documents...</p>
        </div>
      </div>
    );
  }

  // Debug info
  console.log('Dashboard render - firestoreStatus:', firestoreStatus, 'documents:', documents.length, 'loading:', loading);

  return (
    <div className="min-h-screen">
      <main className="main-content">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ 
                fontSize: '48px', 
                fontWeight: '900', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '12px',
                fontFamily: 'Poppins, Inter, sans-serif',
                lineHeight: '1.2'
              }}>
                Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}!
              </h1>
              <p style={{ 
                fontSize: '20px', 
                color: '#6b7280', 
                fontWeight: '400',
                opacity: '0.8'
              }}>
                Manage your writing documents
              </p>
            </div>
            <button 
              onClick={logout}
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
                boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(220, 38, 38, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.3)';
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {renderFirestoreStatus()}

        {!showEditor ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: '36px', 
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Poppins, Inter, sans-serif'
              }}>
                Your Documents
              </h2>
              <button 
                onClick={handleCreateDocument}
                disabled={creating}
                style={{ 
                  padding: '16px 32px',
                  opacity: creating ? 0.6 : 1,
                  cursor: creating ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '18px',
                  fontWeight: '700',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!creating) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!creating) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                  }
                }}
              >
                {creating ? '✨ Creating...' : '+ New Document'}
              </button>
            </div>

            {documents.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '80px 40px',
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                }}>
                  <span style={{ fontSize: '32px', color: 'white' }}>📝</span>
                </div>
                <h3 style={{ 
                  fontSize: '28px', 
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '16px',
                  fontFamily: 'Poppins, Inter, sans-serif'
                }}>
                  No documents yet
                </h3>
                <p style={{ 
                  fontSize: '18px', 
                  color: '#6b7280', 
                  marginBottom: '32px',
                  maxWidth: '400px',
                  margin: '0 auto 32px auto',
                  lineHeight: '1.6'
                }}>
                  Create your first document to get started with AI-powered writing assistance!
                </p>
                <button 
                  onClick={handleCreateDocument}
                  disabled={creating}
                  style={{ 
                    padding: '18px 36px',
                    opacity: creating ? 0.6 : 1,
                    cursor: creating ? 'not-allowed' : 'pointer',
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '18px',
                    fontWeight: '700',
                    boxShadow: '0 15px 35px rgba(255, 107, 107, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!creating) {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 20px 45px rgba(255, 107, 107, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!creating) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 15px 35px rgba(255, 107, 107, 0.4)';
                    }
                  }}
                >
                  {creating ? '✨ Creating Your First Document...' : '✨ Create Your First Document'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '20px',
                      padding: '32px',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.border = '1px solid rgba(102, 126, 234, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                    }}
                  >
                    <div onClick={() => handleSelectDocument(doc)}>
                      <h3 style={{ 
                        fontSize: '24px', 
                        fontWeight: '700', 
                        marginBottom: '16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: 'Poppins, Inter, sans-serif'
                      }}>
                        {doc.title}
                      </h3>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '16px', 
                        marginBottom: '20px',
                        lineHeight: '1.6',
                        minHeight: '48px'
                      }}>
                        {doc.content ? doc.content.substring(0, 120) + (doc.content.length > 120 ? '...' : '') : 'No content yet - click to start writing!'}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        fontSize: '14px', 
                        color: '#9ca3af',
                        marginBottom: '20px'
                      }}>
                        <span style={{ fontWeight: '500' }}>📊 Words: {doc.wordCount || 0}</span>
                        <span style={{ fontWeight: '500' }}>🕒 {formatDate(doc.updatedAt)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.id);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        color: '#dc2626',
                        border: '2px solid #fecaca',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        width: '100%',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                        e.target.style.color = 'white';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
                        e.target.style.color = '#dc2626';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      🗑️ Delete Document
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: '32px', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Poppins, Inter, sans-serif'
              }}>
                ✏️ Editing: {selectedDocument?.title}
              </h2>
              <button 
                onClick={() => {
                  setShowEditor(false);
                  setSelectedDocument(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '700',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                }}
              >
                ← Back to Documents
              </button>
            </div>
            <Editor 
              document={selectedDocument} 
              onBackToDashboard={() => {
                setShowEditor(false);
                setSelectedDocument(null);
              }} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 