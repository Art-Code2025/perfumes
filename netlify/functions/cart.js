import { db } from './config/firebase.js';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  runTransaction 
} from 'firebase/firestore';

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
    const method = event.httpMethod;
    const path = event.path;
    const pathSegments = path.split('/').filter(Boolean);
    
    console.log('🛒 Cart API - Method:', method, 'Path:', path);

    // GET /cart/user/{userId} - Get user's cart
    if (method === 'GET' && pathSegments.includes('user')) {
      const userId = pathSegments[pathSegments.indexOf('user') + 1];
      console.log('🛒 Fetching cart for user:', userId);
      
      try {
        const cartCollection = collection(db, 'carts');
        const cartQuery = query(cartCollection, where('userId', '==', userId));
        const cartSnapshot = await getDocs(cartQuery);
        
        const cartItems = [];
        cartSnapshot.forEach((doc) => {
          cartItems.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        console.log(`✅ Found ${cartItems.length} cart items for user ${userId}`);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(cartItems),
        };
      } catch (firestoreError) {
        console.error('❌ Firestore error, returning empty cart:', firestoreError);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify([]),
        };
      }
    }

    // POST /cart - Add item to cart
    if (method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      console.log('➕ Adding item to cart:', body);
      
      try {
        const cartData = {
          userId: body.userId,
          productId: body.productId,
          productName: body.productName,
          productImage: body.productImage,
          price: body.price,
          quantity: body.quantity || 1,
          selectedOptions: body.selectedOptions || {},
          optionsPricing: body.optionsPricing || {},
          totalPrice: (body.price || 0) * (body.quantity || 1),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Check if item already exists in cart
        const cartCollection = collection(db, 'carts');
        const existingQuery = query(
          cartCollection, 
          where('userId', '==', body.userId),
          where('productId', '==', body.productId)
        );
        const existingSnapshot = await getDocs(existingQuery);
        
        if (!existingSnapshot.empty) {
          // Update existing item
          const existingDoc = existingSnapshot.docs[0];
          const existingData = existingDoc.data();
          const newQuantity = existingData.quantity + (body.quantity || 1);
          
          await updateDoc(doc(db, 'carts', existingDoc.id), {
            quantity: newQuantity,
            totalPrice: (body.price || 0) * newQuantity,
            updatedAt: new Date().toISOString()
          });
          
          console.log('✅ Updated existing cart item');
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              id: existingDoc.id,
              ...existingData,
              quantity: newQuantity,
              totalPrice: (body.price || 0) * newQuantity
            }),
          };
        } else {
          // Add new item
          const docRef = await addDoc(cartCollection, cartData);
          
          const newCartItem = {
            id: docRef.id,
            ...cartData
          };
          
          console.log('✅ Cart item added with ID:', docRef.id);
          
          return {
            statusCode: 201,
            headers,
            body: JSON.stringify(newCartItem),
          };
        }
      } catch (error) {
        console.error('❌ Error adding to cart:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'خطأ في إضافة المنتج للعربة: ' + error.message }),
        };
      }
    }

    // PUT /cart/{id} - Update cart item
    if (method === 'PUT' && pathSegments.length >= 2) {
      const cartItemId = pathSegments[pathSegments.length - 1];
      const body = event.body ? JSON.parse(event.body) : {};
      console.log('🔄 Updating cart item:', cartItemId);
      
      try {
        const cartDoc = doc(db, 'carts', cartItemId);
        const updateData = {
          ...body,
          updatedAt: new Date().toISOString()
        };
        
        // Calculate total price if quantity or price changed
        if (body.quantity && body.price) {
          updateData.totalPrice = body.quantity * body.price;
        }
        
        await updateDoc(cartDoc, updateData);
        
        const updatedDoc = await getDoc(cartDoc);
        const updatedItem = {
          id: updatedDoc.id,
          ...updatedDoc.data()
        };
        
        console.log('✅ Cart item updated');
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(updatedItem),
        };
      } catch (error) {
        console.error('❌ Error updating cart item:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'خطأ في تحديث المنتج: ' + error.message }),
        };
      }
    }

    // DELETE /cart/{id} - Remove item from cart
    if (method === 'DELETE' && pathSegments.length >= 2) {
      const cartItemId = pathSegments[pathSegments.length - 1];
      console.log('🗑️ Removing cart item:', cartItemId);
      
      try {
        await deleteDoc(doc(db, 'carts', cartItemId));
        
        console.log('✅ Cart item removed');
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'تم حذف المنتج من العربة بنجاح' }),
        };
      } catch (error) {
        console.error('❌ Error removing cart item:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'خطأ في حذف المنتج: ' + error.message }),
        };
      }
    }

    // DELETE /cart/user/{userId}/clear - Clear user's cart
    if (method === 'DELETE' && pathSegments.includes('clear')) {
      const userId = pathSegments[pathSegments.indexOf('user') + 1];
      console.log('🗑️ Clearing cart for user:', userId);
      
      try {
        const cartCollection = collection(db, 'carts');
        const cartQuery = query(cartCollection, where('userId', '==', userId));
        const cartSnapshot = await getDocs(cartQuery);
        
        const batch = [];
        cartSnapshot.forEach((doc) => {
          batch.push(deleteDoc(doc.ref));
        });
        
        await Promise.all(batch);
        
        console.log(`✅ Cleared ${cartSnapshot.size} items from cart`);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'تم مسح العربة بنجاح' }),
        };
      } catch (error) {
        console.error('❌ Error clearing cart:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'خطأ في مسح العربة: ' + error.message }),
        };
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'المسار غير موجود' }),
    };

  } catch (error) {
    console.error('❌ Cart API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'خطأ في الخادم: ' + error.message }),
    };
  }
}; 