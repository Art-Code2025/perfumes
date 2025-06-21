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
  limit 
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
    
    console.log('🛍️ Products API - Method:', method, 'Path:', path);

    // GET /products - Get all products
    if (method === 'GET' && pathSegments[pathSegments.length - 1] === 'products') {
      console.log('📦 Fetching all products from Firestore');
      
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
        const products = [];
        productsSnapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        console.log(`✅ Found ${products.length} products in Firestore`);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(products),
        };
      } catch (firestoreError) {
        console.error('❌ Firestore error, falling back to mock data:', firestoreError);
        
        // Fallback to mock data if Firestore fails
        const mockProducts = [
          {
            id: 'p1',
            name: 'وشاح التخرج الكلاسيكي',
            description: 'وشاح تخرج عالي الجودة مصنوع من الساتان الفاخر',
            price: 85.00,
            originalPrice: 120.00,
            stock: 25,
            categoryId: 'c1',
            productType: 'graduation',
            mainImage: 'graduation-sash-1.jpg',
            detailedImages: ['graduation-sash-1.jpg', 'graduation-sash-2.jpg'],
            specifications: [
              { name: 'المادة', value: 'ساتان فاخر' },
              { name: 'الطول', value: '150 سم' },
              { name: 'العرض', value: '12 سم' }
            ],
            dynamicOptions: [
              {
                name: 'nameOnSash',
                label: 'الاسم على الوشاح',
                type: 'text',
                required: true,
                placeholder: 'أدخل الاسم المطلوب'
              },
              {
                name: 'embroideryColor',
                label: 'لون التطريز',
                type: 'select',
                required: true,
                options: ['ذهبي', 'فضي', 'أسود', 'أبيض']
              }
            ],
            createdAt: new Date().toISOString()
          },
          {
            id: 'p2',
            name: 'عباءة التخرج الأكاديمية',
            description: 'عباءة تخرج رسمية للمراسم الأكاديمية',
            price: 180.00,
            originalPrice: 250.00,
            stock: 15,
            categoryId: 'c2',
            productType: 'graduation',
            mainImage: 'graduation-gown-1.jpg',
            detailedImages: ['graduation-gown-1.jpg', 'graduation-gown-2.jpg'],
            specifications: [
              { name: 'المادة', value: 'بوليستر عالي الجودة' },
              { name: 'النوع', value: 'عباءة أكاديمية' }
            ],
            dynamicOptions: [
              {
                name: 'size',
                label: 'المقاس',
                type: 'select',
                required: true,
                options: ['صغير', 'متوسط', 'كبير', 'كبير جداً']
              },
              {
                name: 'capColor',
                label: 'لون الكاب',
                type: 'select',
                required: false,
                options: ['أسود', 'أزرق داكن', 'أحمر', 'أخضر']
              }
            ],
            createdAt: new Date().toISOString()
          },
          {
            id: 'p3',
            name: 'زي مدرسي موحد',
            description: 'زي مدرسي عالي الجودة للطلاب',
            price: 120.00,
            stock: 30,
            categoryId: 'c3',
            productType: 'school',
            mainImage: 'school-uniform-1.jpg',
            detailedImages: ['school-uniform-1.jpg', 'school-uniform-2.jpg'],
            specifications: [
              { name: 'المادة', value: 'قطن مخلوط' },
              { name: 'النوع', value: 'زي مدرسي' }
            ],
            dynamicOptions: [
              {
                name: 'size',
                label: 'المقاس',
                type: 'select',
                required: true,
                options: ['XS', 'S', 'M', 'L', 'XL']
              },
              {
                name: 'color',
                label: 'اللون',
                type: 'select',
                required: true,
                options: ['أزرق', 'رمادي', 'كحلي', 'أبيض']
              }
            ],
            createdAt: new Date().toISOString()
          }
        ];
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(mockProducts),
        };
      }
    }

    // GET /products/{id} - Get single product
    if (method === 'GET' && pathSegments.length >= 2) {
      const productId = pathSegments[pathSegments.length - 1];
      console.log('📦 Fetching product:', productId);
      
      try {
        const productDoc = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productDoc);
        
        if (!productSnapshot.exists()) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'المنتج غير موجود' }),
          };
        }
        
        const product = {
          id: productSnapshot.id,
          ...productSnapshot.data()
        };
        
        console.log('✅ Product found:', product.name);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(product),
        };
      } catch (error) {
        console.error('❌ Error fetching product:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'خطأ في جلب المنتج' }),
        };
      }
    }

    // POST /products - Create new product
    if (method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      console.log('➕ Creating new product:', body.name);
      
      try {
        const productData = {
          ...body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const productsCollection = collection(db, 'products');
        const docRef = await addDoc(productsCollection, productData);
        
        const newProduct = {
          id: docRef.id,
          ...productData
        };
        
        console.log('✅ Product created with ID:', docRef.id);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newProduct),
        };
      } catch (error) {
        console.error('❌ Error creating product:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'خطأ في إنشاء المنتج: ' + error.message }),
        };
      }
    }

    // PUT /products/{id} - Update product
    if (method === 'PUT' && pathSegments.length >= 2) {
      const productId = pathSegments[pathSegments.length - 1];
      const body = event.body ? JSON.parse(event.body) : {};
      console.log('✏️ Updating product:', productId);
      
      try {
        const productDoc = doc(db, 'products', productId);
        const updateData = {
          ...body,
          updatedAt: new Date().toISOString()
        };
        
        await updateDoc(productDoc, updateData);
        
        // Get updated product
        const updatedSnapshot = await getDoc(productDoc);
        const updatedProduct = {
          id: updatedSnapshot.id,
          ...updatedSnapshot.data()
        };
        
        console.log('✅ Product updated:', updatedProduct.name);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(updatedProduct),
        };
      } catch (error) {
        console.error('❌ Error updating product:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'خطأ في تحديث المنتج: ' + error.message }),
        };
      }
    }

    // DELETE /products/{id} - Delete product
    if (method === 'DELETE' && pathSegments.length >= 2) {
      const productId = pathSegments[pathSegments.length - 1];
      console.log('🗑️ Deleting product:', productId);
      
      try {
        const productDoc = doc(db, 'products', productId);
        await deleteDoc(productDoc);
        
        console.log('✅ Product deleted successfully');
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'تم حذف المنتج بنجاح' }),
        };
      } catch (error) {
        console.error('❌ Error deleting product:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'خطأ في حذف المنتج: ' + error.message }),
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
    console.error('❌ Products API Error:', error);
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