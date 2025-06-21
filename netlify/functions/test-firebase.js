import { db } from './config/firebase.js';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
      body: '',
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  try {
    console.log('🧪 Testing Firebase connection...');
    
    // Test 1: Check if Firebase is initialized
    if (!db) {
      throw new Error('Firebase database not initialized');
    }
    console.log('✅ Firebase DB instance exists');
    
    // Test 2: Try to read from a collection
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log('✅ Successfully connected to Firestore');
    console.log(`📄 Test collection has ${snapshot.size} documents`);
    
    // Test 3: Try to write to the collection
    const testDoc = await addDoc(testCollection, {
      message: 'Firebase test successful',
      timestamp: new Date().toISOString(),
      testId: Math.random().toString(36).substr(2, 9)
    });
    console.log('✅ Successfully wrote to Firestore:', testDoc.id);
    
    // Test 4: Check products collection
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    console.log(`📦 Products collection has ${productsSnapshot.size} documents`);
    
    const results = {
      status: 'success',
      message: 'Firebase is working correctly',
      tests: {
        initialization: 'passed',
        read_access: 'passed',
        write_access: 'passed',
        collections: {
          test: snapshot.size,
          products: productsSnapshot.size
        }
      },
      timestamp: new Date().toISOString(),
      testDocId: testDoc.id
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
    };
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    
    const errorResult = {
      status: 'error',
      message: 'Firebase test failed',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(errorResult),
    };
  }
}; 