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

const COLLECTION_NAME = 'coupons';

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

    // Get all coupons
    if (method === 'GET' && pathSegments.length === 2) {
      const { active, sortBy, sortOrder } = queryParams;
      let conditions = [];
      
      // Add active filter if specified
      if (active !== undefined) {
        conditions.push({ field: 'isActive', operator: '==', value: active === 'true' });
      }
      
      let orderBy = null;
      if (sortBy) {
        orderBy = { field: sortBy, direction: sortOrder || 'desc' };
      } else {
        // Default sorting by creation date (newest first)
        orderBy = { field: 'createdAt', direction: 'desc' };
      }
      
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

    // Get single coupon by ID
    if (method === 'GET' && pathSegments.length === 3) {
      const couponId = pathSegments[2];
      const result = await getDocumentById(COLLECTION_NAME, couponId);
      
      if (result.success) {
        return response(200, result);
      } else {
        return response(404, result);
      }
    }

    // Validate coupon by code
    if (method === 'POST' && pathSegments.includes('validate')) {
      const { code, orderValue } = body;
      
      if (!code) {
        return response(400, {
          success: false,
          message: 'كود الكوبون مطلوب'
        });
      }
      
      // Find coupon by code
      const conditions = [
        { field: 'code', operator: '==', value: code.toUpperCase().trim() }
      ];
      
      const result = await queryDocuments(COLLECTION_NAME, conditions);
      
      if (!result.success || result.data.length === 0) {
        return response(404, {
          success: false,
          message: 'كود الكوبون غير صحيح'
        });
      }
      
      const coupon = result.data[0];
      const now = new Date();
      
      // Check if coupon is active
      if (!coupon.isActive) {
        return response(400, {
          success: false,
          message: 'الكوبون غير مفعل'
        });
      }
      
      // Check start date
      if (coupon.startDate && now < new Date(coupon.startDate)) {
        return response(400, {
          success: false,
          message: 'الكوبون لم يبدأ بعد'
        });
      }
      
      // Check end date
      if (coupon.endDate && now > new Date(coupon.endDate)) {
        return response(400, {
          success: false,
          message: 'انتهت صلاحية الكوبون'
        });
      }
      
      // Check usage limit
      if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
        return response(400, {
          success: false,
          message: 'تم استخدام الكوبون الحد الأقصى من المرات'
        });
      }
      
      // Check minimum order value
      const orderVal = parseFloat(orderValue) || 0;
      if (orderVal < (coupon.minOrderValue || 0)) {
        return response(400, {
          success: false,
          message: `الحد الأدنى للطلب ${coupon.minOrderValue} ريال`
        });
      }
      
      // Calculate discount
      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = (orderVal * coupon.value) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = Math.min(coupon.value, orderVal);
      }
      
      return response(200, {
        success: true,
        message: 'الكوبون صالح',
        data: {
          coupon: {
            id: coupon.id,
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            description: coupon.description
          },
          discount: Math.round(discount * 100) / 100,
          finalTotal: Math.round((orderVal - discount) * 100) / 100
        }
      });
    }

    // Apply coupon (increment usage)
    if (method === 'POST' && pathSegments.includes('apply')) {
      const { code } = body;
      
      if (!code) {
        return response(400, {
          success: false,
          message: 'كود الكوبون مطلوب'
        });
      }
      
      // Find coupon by code
      const conditions = [
        { field: 'code', operator: '==', value: code.toUpperCase().trim() }
      ];
      
      const result = await queryDocuments(COLLECTION_NAME, conditions);
      
      if (!result.success || result.data.length === 0) {
        return response(404, {
          success: false,
          message: 'كود الكوبون غير صحيح'
        });
      }
      
      const coupon = result.data[0];
      
      // Increment usage count
      const newUsageCount = (coupon.currentUses || 0) + 1;
      const updateResult = await updateDocument(COLLECTION_NAME, coupon.id, {
        currentUses: newUsageCount,
        lastUsed: new Date()
      });
      
      if (updateResult.success) {
        return response(200, {
          success: true,
          message: 'تم تطبيق الكوبون بنجاح'
        });
      } else {
        throw new Error('فشل في تطبيق الكوبون');
      }
    }

    // Create new coupon
    if (method === 'POST' && pathSegments.length === 2) {
      const {
        code,
        type,
        value,
        maxDiscount,
        minOrderValue,
        maxUses,
        startDate,
        endDate,
        description
      } = body;

      // Validation
      if (!code || code.trim() === '') {
        return response(400, {
          success: false,
          message: 'كود الكوبون مطلوب'
        });
      }

      if (!type || !['percentage', 'fixed'].includes(type)) {
        return response(400, {
          success: false,
          message: 'نوع الخصم غير صحيح'
        });
      }

      if (!value || value <= 0) {
        return response(400, {
          success: false,
          message: 'قيمة الخصم يجب أن تكون أكبر من صفر'
        });
      }

      if (!endDate) {
        return response(400, {
          success: false,
          message: 'تاريخ انتهاء الكوبون مطلوب'
        });
      }

      // Check if coupon code already exists
      const existingCoupons = await queryDocuments(COLLECTION_NAME, [
        { field: 'code', operator: '==', value: code.toUpperCase().trim() }
      ]);
      
      if (existingCoupons.success && existingCoupons.data.length > 0) {
        return response(400, {
          success: false,
          message: 'كود الكوبون موجود بالفعل'
        });
      }

      // Get next numeric ID
      const numericId = await getNextId(COLLECTION_NAME);

      const couponData = {
        numericId,
        code: code.toUpperCase().trim(),
        type,
        value: parseFloat(value),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : 0,
        maxUses: maxUses ? parseInt(maxUses) : null,
        currentUses: 0,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: new Date(endDate),
        isActive: true,
        description: description || ''
      };

      const result = await addDocument(COLLECTION_NAME, couponData);
      
      if (result.success) {
        return response(201, {
          success: true,
          message: 'تم إضافة الكوبون بنجاح',
          data: { id: result.id, ...result.data }
        });
      } else {
        throw new Error('فشل في إضافة الكوبون');
      }
    }

    // Update coupon
    if (method === 'PUT' && pathSegments.length === 3) {
      const couponId = pathSegments[2];
      const updateData = { ...body };
      
      // Validation
      if (updateData.code && updateData.code.trim() === '') {
        return response(400, {
          success: false,
          message: 'كود الكوبون لا يمكن أن يكون فارغاً'
        });
      }

      if (updateData.type && !['percentage', 'fixed'].includes(updateData.type)) {
        return response(400, {
          success: false,
          message: 'نوع الخصم غير صحيح'
        });
      }

      if (updateData.value && updateData.value <= 0) {
        return response(400, {
          success: false,
          message: 'قيمة الخصم يجب أن تكون أكبر من صفر'
        });
      }

      // Check if code is being updated and already exists
      if (updateData.code) {
        const existingCoupons = await queryDocuments(COLLECTION_NAME, [
          { field: 'code', operator: '==', value: updateData.code.toUpperCase().trim() }
        ]);
        
        if (existingCoupons.success && existingCoupons.data.length > 0) {
          const existingCoupon = existingCoupons.data[0];
          if (existingCoupon.id !== couponId) {
            return response(400, {
              success: false,
              message: 'كود الكوبون موجود بالفعل'
            });
          }
        }
        
        updateData.code = updateData.code.toUpperCase().trim();
      }

      // Convert numeric fields
      if (updateData.value) updateData.value = parseFloat(updateData.value);
      if (updateData.maxDiscount) updateData.maxDiscount = parseFloat(updateData.maxDiscount);
      if (updateData.minOrderValue) updateData.minOrderValue = parseFloat(updateData.minOrderValue);
      if (updateData.maxUses) updateData.maxUses = parseInt(updateData.maxUses);
      if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
      if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

      const result = await updateDocument(COLLECTION_NAME, couponId, updateData);
      
      if (result.success) {
        return response(200, {
          success: true,
          message: 'تم تحديث الكوبون بنجاح'
        });
      } else {
        throw new Error('فشل في تحديث الكوبون');
      }
    }

    // Delete coupon
    if (method === 'DELETE' && pathSegments.length === 3) {
      const couponId = pathSegments[2];
      
      // Soft delete by setting isActive to false
      const result = await updateDocument(COLLECTION_NAME, couponId, { isActive: false });
      
      if (result.success) {
        return response(200, {
          success: true,
          message: 'تم حذف الكوبون بنجاح'
        });
      } else {
        throw new Error('فشل في حذف الكوبون');
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