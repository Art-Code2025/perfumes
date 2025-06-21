import { db, testFirebaseConnection } from './config/firebase.js';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

// Categories Function with Enhanced Error Handling
export const handler = async (event, context) => {
  console.log('📂 Categories API Called:', {
    method: event.httpMethod,
    path: event.path,
    timestamp: new Date().toISOString(),
    forceFallback: event.headers['x-force-fallback'] === 'true'
  });

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Force-Fallback',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
      body: '',
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Force-Fallback',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  try {
    const method = event.httpMethod;
    const path = event.path;
    const pathSegments = path.split('/').filter(Boolean);
    const forceFallback = event.headers['x-force-fallback'] === 'true';
    
    console.log('📂 Categories API - Method:', method, 'Path:', path, 'Segments:', pathSegments, 'Force Fallback:', forceFallback);

    // Check if we should force fallback mode
    if (forceFallback) {
      console.warn('🔄 Force fallback mode enabled, using mock data');
      return handleWithFallback(method, pathSegments, event.body);
    }

    // Test Firebase connection first (only if not forcing fallback)
    if (db) {
      try {
        const connectionTest = await testFirebaseConnection();
        if (!connectionTest) {
          console.warn('⚠️ Firebase connection failed, using fallback data');
          return handleWithFallback(method, pathSegments, event.body);
        }
      } catch (connectionError) {
        console.error('❌ Firebase connection test error:', connectionError);
        console.warn('⚠️ Using fallback due to connection error');
        return handleWithFallback(method, pathSegments, event.body);
      }
    } else {
      console.warn('⚠️ Firebase DB not initialized, using fallback data');
      return handleWithFallback(method, pathSegments, event.body);
    }

    // GET /categories - Get all categories
    if (method === 'GET' && pathSegments[pathSegments.length - 1] === 'categories') {
      console.log('📂 Fetching all categories from Firestore');
      
      try {
        const categoriesCollection = collection(db, 'categories');
        const categoriesQuery = query(categoriesCollection, orderBy('name'));
        const categoriesSnapshot = await getDocs(categoriesQuery);
        
        const categories = [];
        categoriesSnapshot.forEach((doc) => {
          categories.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        console.log(`✅ Found ${categories.length} categories in Firestore`);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(categories),
        };
      } catch (firestoreError) {
        console.error('❌ Firestore error, falling back to mock data:', firestoreError);
        
        // Fallback to mock data if Firestore fails
        const mockCategories = [
          {
            id: 'c1',
            name: 'أوشحة التخرج',
            description: 'أوشحة تخرج أنيقة بألوان وتصاميم متنوعة',
            image: 'categories/graduation-sashes.jpg',
            createdAt: new Date().toISOString()
          },
          {
            id: 'c2',
            name: 'عبايات التخرج',
            description: 'عبايات تخرج رسمية للمراسم الأكاديمية',
            image: 'categories/graduation-gowns.jpg',
            createdAt: new Date().toISOString()
          },
          {
            id: 'c3',
            name: 'الأزياء المدرسية',
            description: 'ملابس مدرسية عالية الجودة ومريحة',
            image: 'categories/school-uniforms.jpg',
            createdAt: new Date().toISOString()
          },
          {
            id: 'c4',
            name: 'كاب التخرج',
            description: 'كاب تخرج أكاديمي بتصاميم مختلفة',
            image: 'categories/graduation-caps.jpg',
            createdAt: new Date().toISOString()
          },
          {
            id: 'c5',
            name: 'إكسسوارات التخرج',
            description: 'إكسسوارات مكملة لإطلالة التخرج المثالية',
            image: 'categories/graduation-accessories.jpg',
            createdAt: new Date().toISOString()
          }
        ];
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(mockCategories),
        };
      }
    }

    // GET /categories/{id} - Get single category
    if (method === 'GET' && pathSegments.length >= 2) {
      const categoryId = pathSegments[pathSegments.length - 1];
      console.log('📂 Fetching category:', categoryId);
      
      try {
        const categoryDoc = doc(db, 'categories', categoryId);
        const categorySnapshot = await getDoc(categoryDoc);
        
        if (!categorySnapshot.exists()) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'التصنيف غير موجود' }),
          };
        }
        
        const category = {
          id: categorySnapshot.id,
          ...categorySnapshot.data()
        };
        
        console.log('✅ Category found:', category.name);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(category),
        };
      } catch (error) {
        console.error('❌ Error fetching category:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'خطأ في جلب التصنيف' }),
        };
      }
    }

    // POST /categories - Create new category
    if (method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      console.log('➕ Creating new category:', body.name);
      
      try {
        const categoryData = {
          ...body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const categoriesCollection = collection(db, 'categories');
        const docRef = await addDoc(categoriesCollection, categoryData);
        
        const newCategory = {
          id: docRef.id,
          ...categoryData
        };
        
        console.log('✅ Category created with ID:', docRef.id);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newCategory),
        };
      } catch (error) {
        console.error('❌ Error creating category:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'خطأ في إنشاء التصنيف: ' + error.message }),
        };
      }
    }

    // PUT /categories/{id} - Update category
    if (method === 'PUT' && pathSegments.length >= 2) {
      const categoryId = pathSegments[pathSegments.length - 1];
      const body = event.body ? JSON.parse(event.body) : {};
      console.log('✏️ Updating category:', categoryId);
      
      try {
        const categoryDoc = doc(db, 'categories', categoryId);
        const updateData = {
          ...body,
          updatedAt: new Date().toISOString()
        };
        
        await updateDoc(categoryDoc, updateData);
        
        // Get updated category
        const updatedSnapshot = await getDoc(categoryDoc);
        const updatedCategory = {
          id: updatedSnapshot.id,
          ...updatedSnapshot.data()
        };
        
        console.log('✅ Category updated:', updatedCategory.name);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(updatedCategory),
        };
      } catch (error) {
        console.error('❌ Error updating category:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'خطأ في تحديث التصنيف: ' + error.message }),
        };
      }
    }

    // DELETE /categories/{id} - Delete category
    if (method === 'DELETE' && pathSegments.length >= 2) {
      const categoryId = pathSegments[pathSegments.length - 1];
      console.log('🗑️ Deleting category:', categoryId);
      
      try {
        const categoryDoc = doc(db, 'categories', categoryId);
        await deleteDoc(categoryDoc);
        
        console.log('✅ Category deleted successfully');
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'تم حذف التصنيف بنجاح' }),
        };
      } catch (error) {
        console.error('❌ Error deleting category:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'خطأ في حذف التصنيف: ' + error.message }),
        };
      }
    }

    // Method not allowed
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };

  } catch (error) {
    console.error('❌ Categories API Error:', error);
    
    // If it's a permission error, try fallback
    if (error.code === 'permission-denied' || error.message.includes('permission') || error.message.includes('PERMISSION_DENIED')) {
      console.warn('🔐 Permission denied, using fallback data');
      return handleWithFallback(event.httpMethod, event.path.split('/').filter(Boolean), event.body);
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'خطأ في الخادم',
        details: error.message 
      }),
    };
  }
};

// Fallback function when Firebase is not available or has permission issues
const handleWithFallback = (method, pathSegments, body) => {
  console.log('🔄 Using fallback data for method:', method);
  console.log('🔍 Path segments:', pathSegments);
  console.log('📋 Body:', body);
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Force-Fallback',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  const mockCategories = [
    {
      id: 'c1',
      name: 'أوشحة التخرج',
      description: 'أوشحة تخرج أنيقة بألوان وتصاميم متنوعة',
      image: 'categories/graduation-sashes.jpg',
      createdAt: new Date().toISOString()
    },
    {
      id: 'c2',
      name: 'عبايات التخرج',
      description: 'عبايات تخرج رسمية للمراسم الأكاديمية',
      image: 'categories/graduation-gowns.jpg',
      createdAt: new Date().toISOString()
    },
    {
      id: 'c3',
      name: 'الأزياء المدرسية',
      description: 'ملابس مدرسية عالية الجودة ومريحة',
      image: 'categories/school-uniforms.jpg',
      createdAt: new Date().toISOString()
    },
    {
      id: 'c4',
      name: 'كاب التخرج',
      description: 'كاب تخرج أكاديمي بتصاميم مختلفة',
      image: 'categories/graduation-caps.jpg',
      createdAt: new Date().toISOString()
    },
    {
      id: 'c5',
      name: 'إكسسوارات التخرج',
      description: 'إكسسوارات مكملة لإطلالة التخرج المثالية',
      image: 'categories/graduation-accessories.jpg',
      createdAt: new Date().toISOString()
    }
  ];

  // GET all categories
  if (method === 'GET' && (pathSegments[pathSegments.length - 1] === 'categories' || pathSegments.includes('categories') || pathSegments.length === 1)) {
    console.log('📂 Returning fallback categories list - matched condition');
    console.log('📊 Mock categories count:', mockCategories.length);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockCategories),
    };
  }

  // GET single category
  if (method === 'GET' && pathSegments.length >= 2) {
    const categoryId = pathSegments[pathSegments.length - 1];
    const category = mockCategories.find(c => c.id === categoryId);
    
    if (!category) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'التصنيف غير موجود' }),
      };
    }
    
    console.log('📂 Returning fallback category:', category.name);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(category),
    };
  }

  // POST - Create category (simulate success)
  if (method === 'POST') {
    const bodyData = body ? JSON.parse(body) : {};
    const newCategory = {
      id: 'c' + Date.now(),
      ...bodyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('📂 Simulating category creation:', newCategory.name);
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(newCategory),
    };
  }

  // PUT - Update category (simulate success)
  if (method === 'PUT' && pathSegments.length >= 2) {
    const categoryId = pathSegments[pathSegments.length - 1];
    const bodyData = body ? JSON.parse(body) : {};
    const updatedCategory = {
      id: categoryId,
      ...bodyData,
      updatedAt: new Date().toISOString()
    };
    
    console.log('📂 Simulating category update:', updatedCategory.name);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedCategory),
    };
  }

  // DELETE - Delete category (simulate success)
  if (method === 'DELETE' && pathSegments.length >= 2) {
    const categoryId = pathSegments[pathSegments.length - 1];
    console.log('📂 Simulating category deletion:', categoryId);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'تم حذف التصنيف بنجاح (محاكاة)' }),
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
}; 