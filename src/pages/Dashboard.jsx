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
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                Welcome back, {currentUser?.displayName || currentUser?.email}!
              </h1>
              <p style={{ color: '#6b7280' }}>Manage your writing documents</p>
            </div>
            <button 
              onClick={logout}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>



        {!showEditor ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Your Documents</h2>
              <button 
                onClick={handleCreateDocument}
                disabled={creating}
                className="form-button"
                style={{ 
                  width: 'auto', 
                  padding: '0.5rem 1rem',
                  opacity: creating ? 0.6 : 1,
                  cursor: creating ? 'not-allowed' : 'pointer',
                  backgroundColor: '#3b82f6', // Force blue color
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.375rem'
                }}
              >
                {creating ? 'Creating...' : '+ New Document'}
              </button>
            </div>

            {documents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '1rem' }}>
                  No documents yet. Create your first document to get started!
                </p>
                <button 
                  onClick={handleCreateDocument}
                  disabled={creating}
                  className="form-button"
                  style={{ 
                    width: 'auto', 
                    padding: '0.75rem 1.5rem',
                    opacity: creating ? 0.6 : 1,
                    cursor: creating ? 'not-allowed' : 'pointer',
                    backgroundColor: '#3b82f6', // Force blue color
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.375rem'
                  }}
                >
                  {creating ? 'Creating...' : 'Create Your First Document'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div onClick={() => handleSelectDocument(doc)}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
                        {doc.title}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        {doc.content ? doc.content.substring(0, 100) + (doc.content.length > 100 ? '...' : '') : 'No content yet'}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
                        <span>Words: {doc.wordCount || 0}</span>
                        <span>Updated: {formatDate(doc.updatedAt)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.id);
                      }}
                      style={{
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        marginTop: '1rem',
                        width: '100%'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                Editing: {selectedDocument?.title}
              </h2>
              <button 
                onClick={() => {
                  setShowEditor(false);
                  setSelectedDocument(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
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