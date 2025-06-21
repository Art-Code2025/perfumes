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
  orderBy 
} from 'firebase/firestore';

// Categories Function with Mock Data
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
    
    console.log('📂 Categories API - Method:', method, 'Path:', path);

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