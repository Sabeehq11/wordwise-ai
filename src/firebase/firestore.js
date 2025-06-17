import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';

// Collection name for user documents
const DOCUMENTS_COLLECTION = 'documents';

// Create a new document
export const createDocument = async (userId, documentData) => {
  try {
    console.log('Creating document for user:', userId, 'with data:', documentData);
    
    const docRef = await addDoc(collection(db, DOCUMENTS_COLLECTION), {
      ...documentData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Document created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating document:', error);
    
    // Check if it's a permissions error
    if (error.code === 'permission-denied') {
      alert('Firestore permissions error. Please enable Firestore Database in your Firebase Console.');
    } else if (error.code === 'unavailable') {
      alert('Firestore database is not available. Please check your Firebase project setup.');
    } else {
      alert(`Error creating document: ${error.message}`);
    }
    
    throw error;
  }
};

// Update an existing document
export const updateDocument = async (documentId, updates) => {
  try {
    console.log('Updating document:', documentId, 'with updates:', updates);
    
    const docRef = doc(db, DOCUMENTS_COLLECTION, documentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    console.log('Document updated successfully');
  } catch (error) {
    console.error('Error updating document:', error);
    
    if (error.code === 'permission-denied') {
      console.warn('Permission denied - document may not belong to current user');
    } else {
      console.error('Update failed:', error.message);
    }
    
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (documentId) => {
  try {
    console.log('Deleting document:', documentId);
    
    const docRef = doc(db, DOCUMENTS_COLLECTION, documentId);
    await deleteDoc(docRef);
    
    console.log('Document deleted successfully');
  } catch (error) {
    console.error('Error deleting document:', error);
    
    if (error.code === 'permission-denied') {
      alert('You can only delete your own documents.');
    } else {
      alert(`Error deleting document: ${error.message}`);
    }
    
    throw error;
  }
};

// Get a single document
export const getDocument = async (documentId) => {
  try {
    console.log('Getting document:', documentId);
    
    const docRef = doc(db, DOCUMENTS_COLLECTION, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() };
      console.log('Document retrieved:', data);
      return data;
    } else {
      throw new Error('Document not found');
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

// Get all documents for a user
export const getUserDocuments = async (userId) => {
  try {
    console.log('📥 Getting documents for user:', userId);
    
    // Use simple query without orderBy to avoid index requirements
    const q = query(
      collection(db, DOCUMENTS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort manually by updatedAt (newest first)
    documents.sort((a, b) => {
      const aTime = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || 0);
      const bTime = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || 0);
      return bTime - aTime;
    });
    
    console.log(`✅ Found ${documents.length} documents for user:`, documents);
    return documents;
  } catch (error) {
    console.error('❌ Error getting user documents:', error);
    
    if (error.code === 'permission-denied') {
      console.error('Permission denied - Firestore rules may not be set correctly');
      alert('Database access denied. Please check Firestore security rules.');
    } else if (error.code === 'failed-precondition') {
      console.error('Firestore index may be missing - using fallback');
      console.log('Database index missing. This is normal for new projects and will resolve automatically.');
    } else {
      console.error('Failed to load documents:', error.message);
    }
    
    return []; // Return empty array instead of throwing
  }
};

// Real-time listener for user documents
export const subscribeToUserDocuments = (userId, callback) => {
  try {
    console.log('Setting up real-time listener for user:', userId);
    
    // Use simple query without orderBy to avoid index requirements
    const q = query(
      collection(db, DOCUMENTS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort manually by updatedAt (newest first)
      documents.sort((a, b) => {
        const aTime = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || 0);
        const bTime = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || 0);
        return bTime - aTime;
      });
      
      console.log(`✅ Real-time update: ${documents.length} documents received`);
      callback(documents);
    }, (error) => {
      console.error('❌ Real-time listener error:', error);
      
      if (error.code === 'failed-precondition' || error.code === 'permission-denied') {
        console.log('🔄 Real-time listener failed, falling back to manual loading');
        // If real-time fails, callback with empty array to trigger manual loading
        callback([]);
      } else {
        console.error('Unexpected real-time listener error:', error.message);
        callback([]);
      }
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('❌ Error setting up real-time listener:', error);
    return () => {}; // Return empty function
  }
};

// Check if Firestore is available
export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    
    // Simple test that doesn't require indexes
    const documentsCollection = collection(db, DOCUMENTS_COLLECTION);
    const testQuery = query(documentsCollection); // No orderBy to avoid index issues
    const querySnapshot = await getDocs(testQuery);
    
    console.log('Firestore connection successful - found', querySnapshot.size, 'documents');
    return true;
  } catch (error) {
    console.error('Firestore connection failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('Firestore permissions denied - check rules or enable test mode');
    } else if (error.code === 'failed-precondition') {
      console.error('Firestore precondition failed - database may not be enabled');
    } else if (error.code === 'unavailable') {
      console.error('Firestore service unavailable');
    }
    
    return false;
  }
}; 