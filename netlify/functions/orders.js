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

const COLLECTION_NAME = 'orders';

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

    // Get all orders
    if (method === 'GET' && pathSegments.length === 2) {
      const { status, sortBy, sortOrder, limit: queryLimit, phone, email } = queryParams;
      let conditions = [];
      
      // Add status filter
      if (status && status !== 'all') {
        conditions.push({ field: 'status', operator: '==', value: status });
      }
      
      // Add phone filter
      if (phone) {
        conditions.push({ field: 'customerInfo.phone', operator: '==', value: phone });
      }
      
      // Add email filter
      if (email) {
        conditions.push({ field: 'customerInfo.email', operator: '==', value: email });
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
        return response(200, {
          success: true,
          data: result.data,
          total: result.data.length
        });
      } else {
        throw new Error(result.message);
      }
    }

    // Get single order by ID
    if (method === 'GET' && pathSegments.length === 3) {
      const orderId = pathSegments[2];
      const result = await getDocumentById(COLLECTION_NAME, orderId);
      
      if (result.success) {
        return response(200, result);
      } else {
        return response(404, result);
      }
    }

    // Create new order
    if (method === 'POST' && pathSegments.length === 2) {
      const {
        customerInfo,
        items,
        subtotal,
        shippingCost,
        discount,
        total,
        paymentMethod,
        notes
      } = body;

      // Validation
      if (!customerInfo || !customerInfo.name || !customerInfo.phone) {
        return response(400, {
          success: false,
          message: 'معلومات العميل (الاسم والهاتف) مطلوبة'
        });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return response(400, {
          success: false,
          message: 'يجب أن يحتوي الطلب على منتج واحد على الأقل'
        });
      }

      if (!total || total <= 0) {
        return response(400, {
          success: false,
          message: 'إجمالي الطلب غير صحيح'
        });
      }

      // Validate items
      for (const item of items) {
        if (!item.productId || !item.productName || !item.quantity || !item.price) {
          return response(400, {
            success: false,
            message: 'بيانات المنتجات غير مكتملة'
          });
        }
      }

      // Get next numeric ID (starting from 1000)
      const numericId = await getNextId(COLLECTION_NAME);
      const orderNumber = numericId < 1000 ? 1000 : numericId;

      const orderData = {
        numericId: orderNumber,
        orderNumber: `ORD-${orderNumber}`,
        customerInfo: {
          name: customerInfo.name.trim(),
          phone: customerInfo.phone.trim(),
          email: customerInfo.email || '',
          address: customerInfo.address || {}
        },
        items: items.map(item => ({
          productId: parseInt(item.productId),
          productName: item.productName,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
          selectedOptions: item.selectedOptions || [],
          totalPrice: parseFloat(item.totalPrice || (item.quantity * item.price))
        })),
        subtotal: parseFloat(subtotal),
        shippingCost: parseFloat(shippingCost) || 0,
        discount: {
          couponCode: discount?.couponCode || '',
          discountAmount: parseFloat(discount?.discountAmount) || 0
        },
        total: parseFloat(total),
        status: 'معلق',
        paymentMethod: paymentMethod || 'دفع عند الاستلام',
        notes: notes || ''
      };

      const result = await addDocument(COLLECTION_NAME, orderData);
      
      if (result.success) {
        // TODO: Send confirmation email/SMS to customer
        // TODO: Update product stock if needed
        
        return response(201, {
          success: true,
          message: 'تم إنشاء الطلب بنجاح',
          data: { id: result.id, ...result.data },
          orderNumber: orderData.orderNumber
        });
      } else {
        throw new Error('فشل في إنشاء الطلب');
      }
    }

    // Update order (mainly for status updates)
    if (method === 'PUT' && pathSegments.length === 3) {
      const orderId = pathSegments[2];
      const updateData = { ...body };
      
      // Validate status if being updated
      const validStatuses = ['معلق', 'قيد التنفيذ', 'مُرسل', 'مُستلم', 'ملغي'];
      if (updateData.status && !validStatuses.includes(updateData.status)) {
        return response(400, {
          success: false,
          message: 'حالة الطلب غير صحيحة'
        });
      }

      // Convert numeric fields if present
      if (updateData.total) updateData.total = parseFloat(updateData.total);
      if (updateData.subtotal) updateData.subtotal = parseFloat(updateData.subtotal);
      if (updateData.shippingCost) updateData.shippingCost = parseFloat(updateData.shippingCost);

      const result = await updateDocument(COLLECTION_NAME, orderId, updateData);
      
      if (result.success) {
        // TODO: Send status update notification to customer
        
        return response(200, {
          success: true,
          message: 'تم تحديث الطلب بنجاح'
        });
      } else {
        throw new Error('فشل في تحديث الطلب');
      }
    }

    // Delete order (soft delete)
    if (method === 'DELETE' && pathSegments.length === 3) {
      const orderId = pathSegments[2];
      
      // Update status to cancelled instead of actual deletion
      const result = await updateDocument(COLLECTION_NAME, orderId, { 
        status: 'ملغي',
        cancelledAt: new Date()
      });
      
      if (result.success) {
        return response(200, {
          success: true,
          message: 'تم إلغاء الطلب بنجاح'
        });
      } else {
        throw new Error('فشل في إلغاء الطلب');
      }
    }

    // Get order statistics
    if (method === 'GET' && pathSegments.includes('stats')) {
      try {
        const allOrders = await getAllDocuments(COLLECTION_NAME);
        
        if (allOrders.success) {
          const orders = allOrders.data;
          
          const stats = {
            total: orders.length,
            pending: orders.filter(order => order.status === 'معلق').length,
            processing: orders.filter(order => order.status === 'قيد التنفيذ').length,
            shipped: orders.filter(order => order.status === 'مُرسل').length,
            delivered: orders.filter(order => order.status === 'مُستلم').length,
            cancelled: orders.filter(order => order.status === 'ملغي').length,
            totalRevenue: orders
              .filter(order => order.status !== 'ملغي')
              .reduce((sum, order) => sum + (order.total || 0), 0),
            averageOrderValue: 0
          };
          
          const completedOrders = orders.filter(order => order.status !== 'ملغي');
          if (completedOrders.length > 0) {
            stats.averageOrderValue = stats.totalRevenue / completedOrders.length;
          }
          
          return response(200, {
            success: true,
            data: stats
          });
        } else {
          throw new Error(allOrders.message);
        }
      } catch (error) {
        return handleError(error);
      }
    }

    // Get orders by customer phone
    if (method === 'GET' && pathSegments.includes('customer')) {
      const customerPhone = pathSegments[pathSegments.length - 1];
      
      if (!customerPhone) {
        return response(400, {
          success: false,
          message: 'رقم الهاتف مطلوب'
        });
      }
      
      const conditions = [
        { field: 'customerInfo.phone', operator: '==', value: customerPhone }
      ];
      const orderBy = { field: 'createdAt', direction: 'desc' };
      
      const result = await queryDocuments(COLLECTION_NAME, conditions, orderBy);
      
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