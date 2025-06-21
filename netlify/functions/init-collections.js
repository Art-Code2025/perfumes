import { db } from './config/firebase.js';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc,
  setDoc
} from 'firebase/firestore';

export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  try {
    const method = event.httpMethod;
    
    console.log('🔥 Firebase Collections Initializer - Method:', method);

    if (method === 'POST') {
      console.log('🚀 Starting Firebase collections initialization...');
      
      const initResults = {
        collections: [],
        errors: [],
        timestamp: new Date().toISOString()
      };

      // Initialize Carts Collection
      try {
        const cartsRef = collection(db, 'carts');
        const cartsSnapshot = await getDocs(cartsRef);
        
        if (cartsSnapshot.empty) {
          // Add a sample cart item to initialize the collection
          const sampleCart = {
            userId: 'sample_user',
            productId: 'sample_product',
            productName: 'منتج تجريبي',
            productImage: '',
            price: 100,
            quantity: 1,
            selectedOptions: {},
            optionsPricing: {},
            totalPrice: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          await addDoc(cartsRef, sampleCart);
          initResults.collections.push('carts - initialized with sample data');
        } else {
          initResults.collections.push('carts - already exists');
        }
      } catch (error) {
        initResults.errors.push(`carts: ${error.message}`);
      }

      // Initialize Wishlists Collection
      try {
        const wishlistsRef = collection(db, 'wishlists');
        const wishlistsSnapshot = await getDocs(wishlistsRef);
        
        if (wishlistsSnapshot.empty) {
          // Add a sample wishlist item to initialize the collection
          const sampleWishlist = {
            userId: 'sample_user',
            productId: 'sample_product',
            productName: 'منتج تجريبي',
            productImage: '',
            price: 100,
            originalPrice: 120,
            category: 'sample_category',
            isAvailable: true,
            createdAt: new Date().toISOString()
          };
          
          await addDoc(wishlistsRef, sampleWishlist);
          initResults.collections.push('wishlists - initialized with sample data');
        } else {
          initResults.collections.push('wishlists - already exists');
        }
      } catch (error) {
        initResults.errors.push(`wishlists: ${error.message}`);
      }

      // Initialize Reviews Collection
      try {
        const reviewsRef = collection(db, 'reviews');
        const reviewsSnapshot = await getDocs(reviewsRef);
        
        if (reviewsSnapshot.empty) {
          // Add a sample review to initialize the collection
          const sampleReview = {
            userId: 'sample_user',
            productId: 'sample_product',
            customerName: 'عميل تجريبي',
            customerEmail: 'test@example.com',
            rating: 5,
            title: 'منتج ممتاز',
            comment: 'هذا تقييم تجريبي لتهيئة قاعدة البيانات',
            isApproved: true,
            isVerifiedPurchase: false,
            helpfulCount: 0,
            reportCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          await addDoc(reviewsRef, sampleReview);
          initResults.collections.push('reviews - initialized with sample data');
        } else {
          initResults.collections.push('reviews - already exists');
        }
      } catch (error) {
        initResults.errors.push(`reviews: ${error.message}`);
      }

      // Update existing customers with cart/wishlist stats
      try {
        const customersRef = collection(db, 'customers');
        const customersSnapshot = await getDocs(customersRef);
        
        if (!customersSnapshot.empty) {
          let updatedCount = 0;
          
          for (const customerDoc of customersSnapshot.docs) {
            const customerData = customerDoc.data();
            
            // Add missing fields if they don't exist
            if (!customerData.hasOwnProperty('cartItemsCount')) {
              await setDoc(customerDoc.ref, {
                ...customerData,
                cartItemsCount: 0,
                wishlistItemsCount: 0,
                hasCart: false,
                hasWishlist: false,
                updatedAt: new Date().toISOString()
              });
              updatedCount++;
            }
          }
          
          initResults.collections.push(`customers - updated ${updatedCount} records with cart/wishlist fields`);
        }
      } catch (error) {
        initResults.errors.push(`customers update: ${error.message}`);
      }

      console.log('✅ Firebase collections initialization completed');
      console.log('📊 Results:', initResults);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'تم تهيئة مجموعات Firebase بنجاح',
          results: initResults
        }),
      };
    }

    // GET method - just return status
    if (method === 'GET') {
      try {
        // Check collections status
        const collectionsStatus = {};
        
        const collectionsToCheck = ['carts', 'wishlists', 'reviews', 'customers', 'products', 'categories', 'orders', 'coupons'];
        
        for (const collectionName of collectionsToCheck) {
          try {
            const collectionRef = collection(db, collectionName);
            const snapshot = await getDocs(collectionRef);
            collectionsStatus[collectionName] = {
              exists: true,
              count: snapshot.size
            };
          } catch (error) {
            collectionsStatus[collectionName] = {
              exists: false,
              error: error.message
            };
          }
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'حالة مجموعات Firebase',
            collections: collectionsStatus,
            timestamp: new Date().toISOString()
          }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'خطأ في فحص المجموعات: ' + error.message
          }),
        };
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };

  } catch (error) {
    console.error('❌ Collections Init Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: 'خطأ في الخادم: ' + error.message 
      }),
    };
  }
}; 