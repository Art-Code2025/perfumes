import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from './config/firebase.js';
import { 
  getAllDocuments, 
  getDocumentById, 
  addDocument, 
  updateDocument, 
  deleteDocument,
  queryDocuments,
  getNextId,
  response, 
  handleError 
} from './utils/firestore.js';

const COLLECTION_NAME = 'customers';

export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return response(200, {});
  }

  try {
    const method = event.httpMethod;
    const path = event.path;
    const pathSegments = path.split('/').filter(Boolean);
    const body = event.body ? JSON.parse(event.body) : {};
    const queryParams = event.queryStringParameters || {};

    // Get all customers
    if (method === 'GET' && pathSegments.length === 2) {
      const { status, sortBy, sortOrder, limit: queryLimit, email, phone } = queryParams;
      let conditions = [];
      
      // Add status filter
      if (status && status !== 'all') {
        conditions.push({ field: 'status', operator: '==', value: status });
      }
      
      // Add email filter
      if (email) {
        conditions.push({ field: 'email', operator: '==', value: email.toLowerCase() });
      }
      
      // Add phone filter
      if (phone) {
        conditions.push({ field: 'phone', operator: '==', value: phone });
      }
      
      let orderBy = null;
      if (sortBy) {
        orderBy = { field: sortBy, direction: sortOrder || 'desc' };
      } else {
        // Default sorting by creation date (newest first)
        orderBy = { field: 'createdAt', direction: 'desc' };
      }
      
      const limitCount = queryLimit ? parseInt(queryLimit) : null;
      
      const result = await queryDocuments(COLLECTION_NAME, conditions, orderBy, limitCount);
      
      if (result.success) {
        // Remove sensitive data from response
        const sanitizedData = result.data.map(customer => {
          const { password, ...safeCustomer } = customer;
          return safeCustomer;
        });
        
        return response(200, {
          success: true,
          data: sanitizedData,
          total: sanitizedData.length
        });
      } else {
        throw new Error(result.message);
      }
    }

    // Get single customer by ID
    if (method === 'GET' && pathSegments.length === 3) {
      const customerId = pathSegments[2];
      
      const result = await getDocumentById(COLLECTION_NAME, customerId);
      
      if (result.success) {
        // Remove sensitive data
        const { password, ...safeCustomer } = result.data;
        return response(200, {
          success: true,
          data: safeCustomer
        });
      } else {
        return response(404, {
          success: false,
          message: 'العميل غير موجود'
        });
      }
    }

    // Login
    if (method === 'POST' && pathSegments.includes('login')) {
      const { email, password } = body;

      // Validation
      if (!email || !password) {
        return response(400, {
          success: false,
          message: 'البريد الإلكتروني وكلمة المرور مطلوبان'
        });
      }

      try {
        // Try Firebase Auth first
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Check if customer exists in Firestore
        const conditions = [{ field: 'email', operator: '==', value: email.toLowerCase() }];
        const customerResult = await queryDocuments(COLLECTION_NAME, conditions);
        
        let customerData;
        
        if (customerResult.success && customerResult.data.length > 0) {
          // Customer exists in Firestore
          customerData = customerResult.data[0];
          
          // Update last login
          await updateDocument(COLLECTION_NAME, customerData.id, {
            lastLogin: new Date(),
            firebaseUid: firebaseUser.uid
          });
        } else {
          // Create customer record in Firestore
          const newCustomerData = {
            numericId: await getNextId(COLLECTION_NAME),
            firebaseUid: firebaseUser.uid,
            email: email.toLowerCase(),
            firstName: firebaseUser.displayName?.split(' ')[0] || '',
            lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
            name: firebaseUser.displayName || email.split('@')[0],
            phone: firebaseUser.phoneNumber || '',
            status: 'active',
            emailVerified: firebaseUser.emailVerified,
            photoURL: firebaseUser.photoURL,
            lastLogin: new Date(),
            registrationMethod: 'firebase'
          };

          const createResult = await addDocument(COLLECTION_NAME, newCustomerData);
          if (createResult.success) {
            customerData = { id: createResult.id, ...createResult.data };
          }
        }

        // Get ID token
        const idToken = await firebaseUser.getIdToken();

        return response(200, {
          success: true,
          message: 'تم تسجيل الدخول بنجاح',
          user: {
            id: customerData?.numericId || customerData?.id,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: customerData?.firstName || '',
            lastName: customerData?.lastName || '',
            name: customerData?.name || firebaseUser.displayName,
            phone: customerData?.phone || firebaseUser.phoneNumber,
            emailVerified: firebaseUser.emailVerified,
            photoURL: firebaseUser.photoURL,
            token: idToken,
            status: customerData?.status || 'active'
          }
        });
      } catch (error) {
        // If Firebase Auth fails, try traditional login
        console.log('Firebase Auth failed, trying traditional login:', error.message);
        
        // Check if customer exists in Firestore with traditional password
        const conditions = [{ field: 'email', operator: '==', value: email.toLowerCase() }];
        const customerResult = await queryDocuments(COLLECTION_NAME, conditions);
        
        if (!customerResult.success || customerResult.data.length === 0) {
          return response(404, {
            success: false,
            message: 'البريد الإلكتروني غير مسجل'
          });
        }
        
        const customer = customerResult.data[0];
        
        // For traditional accounts, we'll use a simple comparison
        // In production, you should use proper password hashing
        if (customer.password !== password) {
          return response(401, {
            success: false,
            message: 'كلمة المرور غير صحيحة'
          });
        }
        
        // Update last login
        await updateDocument(COLLECTION_NAME, customer.id, {
          lastLogin: new Date()
        });
        
        // Remove password from response
        const { password: _, ...safeCustomer } = customer;
        
        return response(200, {
          success: true,
          message: 'تم تسجيل الدخول بنجاح',
          user: {
            id: customer.numericId || customer.id,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
            name: customer.name,
            phone: customer.phone,
            status: customer.status || 'active',
            registrationMethod: 'traditional'
          }
        });
      }
    }

    // Register
    if (method === 'POST' && pathSegments.includes('register')) {
      const { email, password, firstName, lastName, phone, useFirebase = true } = body;

      // Validation
      if (!email || !password || !firstName || !lastName || !phone) {
        return response(400, {
          success: false,
          message: 'جميع الحقول مطلوبة'
        });
      }

      if (password.length < 6) {
        return response(400, {
          success: false,
          message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
        });
      }

      // Check if customer already exists
      const conditions = [{ field: 'email', operator: '==', value: email.toLowerCase() }];
      const existingCustomer = await queryDocuments(COLLECTION_NAME, conditions);
      
      if (existingCustomer.success && existingCustomer.data.length > 0) {
        return response(409, {
          success: false,
          message: 'البريد الإلكتروني مسجل بالفعل'
        });
      }

      try {
        let customerData;
        
        if (useFirebase) {
          // Create Firebase user
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;

          // Update Firebase profile
          await updateProfile(firebaseUser, {
            displayName: `${firstName} ${lastName}`
          });

          // Create customer record in Firestore
          customerData = {
            numericId: await getNextId(COLLECTION_NAME),
            firebaseUid: firebaseUser.uid,
            email: email.toLowerCase(),
            firstName,
            lastName,
            name: `${firstName} ${lastName}`,
            phone,
            status: 'active',
            emailVerified: firebaseUser.emailVerified,
            registrationMethod: 'firebase'
          };
        } else {
          // Traditional registration
          customerData = {
            numericId: await getNextId(COLLECTION_NAME),
            email: email.toLowerCase(),
            password, // In production, hash this password
            firstName,
            lastName,
            name: `${firstName} ${lastName}`,
            phone,
            status: 'active',
            emailVerified: false,
            registrationMethod: 'traditional'
          };
        }

        const result = await addDocument(COLLECTION_NAME, customerData);
        
        if (result.success) {
          // Remove password from response
          const { password: _, ...safeCustomer } = result.data;
          
          return response(201, {
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            user: {
              id: result.data.numericId,
              email: result.data.email,
              firstName: result.data.firstName,
              lastName: result.data.lastName,
              name: result.data.name,
              phone: result.data.phone,
              status: result.data.status,
              emailVerified: result.data.emailVerified,
              registrationMethod: result.data.registrationMethod
            }
          });
        } else {
          throw new Error('فشل في إنشاء الحساب');
        }
      } catch (error) {
        let errorMessage = 'خطأ في إنشاء الحساب';
        
        if (error.code) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
              break;
            case 'auth/invalid-email':
              errorMessage = 'البريد الإلكتروني غير صحيح';
              break;
            case 'auth/weak-password':
              errorMessage = 'كلمة المرور ضعيفة';
              break;
            default:
              errorMessage = error.message;
          }
        }

        return response(400, {
          success: false,
          message: errorMessage,
          code: error.code
        });
      }
    }

    // Update customer
    if (method === 'PUT' && pathSegments.length === 3) {
      const customerId = pathSegments[2];
      const updateData = { ...body };
      
      // Remove sensitive fields from update
      delete updateData.password;
      delete updateData.firebaseUid;
      
      // Add updated timestamp
      updateData.updatedAt = new Date();
      
      const result = await updateDocument(COLLECTION_NAME, customerId, updateData);
      
      if (result.success) {
        return response(200, {
          success: true,
          message: 'تم تحديث بيانات العميل بنجاح',
          data: result.data
        });
      } else {
        return response(404, {
          success: false,
          message: 'العميل غير موجود'
        });
      }
    }

    // Delete customer
    if (method === 'DELETE' && pathSegments.length === 3) {
      const customerId = pathSegments[2];
      
      const result = await deleteDocument(COLLECTION_NAME, customerId);
      
      if (result.success) {
        return response(200, {
          success: true,
          message: 'تم حذف العميل بنجاح'
        });
      } else {
        return response(404, {
          success: false,
          message: 'العميل غير موجود'
        });
      }
    }

    // Reset password
    if (method === 'POST' && pathSegments.includes('reset-password')) {
      const { email } = body;

      if (!email) {
        return response(400, {
          success: false,
          message: 'البريد الإلكتروني مطلوب'
        });
      }

      try {
        await sendPasswordResetEmail(auth, email);
        return response(200, {
          success: true,
          message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
        });
      } catch (error) {
        let errorMessage = 'خطأ في إرسال رابط إعادة التعيين';
        
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'المستخدم غير موجود';
            break;
          case 'auth/invalid-email':
            errorMessage = 'البريد الإلكتروني غير صحيح';
            break;
          default:
            errorMessage = error.message;
        }

        return response(400, {
          success: false,
          message: errorMessage,
          code: error.code
        });
      }
    }

    // Logout
    if (method === 'POST' && pathSegments.includes('logout')) {
      try {
        await signOut(auth);
        return response(200, {
          success: true,
          message: 'تم تسجيل الخروج بنجاح'
        });
      } catch (error) {
        return response(400, {
          success: false,
          message: 'خطأ في تسجيل الخروج'
        });
      }
    }

    // Get customer orders
    if (method === 'GET' && pathSegments.includes('orders')) {
      const customerId = pathSegments[pathSegments.indexOf('orders') - 1];
      
      // Query orders for this customer
      const conditions = [
        { field: 'customerInfo.id', operator: '==', value: parseInt(customerId) }
      ];
      const orderBy = { field: 'createdAt', direction: 'desc' };
      
      const result = await queryDocuments('orders', conditions, orderBy);
      
      if (result.success) {
        return response(200, {
          success: true,
          data: result.data,
          total: result.data.length
        });
      } else {
        throw new Error(result.message);
      }
    }

    // Method not allowed
    return response(405, {
      success: false,
      message: 'الطريقة غير مدعومة'
    });

  } catch (error) {
    return handleError(error);
  }
}; 