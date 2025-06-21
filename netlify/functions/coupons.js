// Coupons Function with Mock Data
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

  try {
    const method = event.httpMethod;
    const path = event.path;
    const pathSegments = path.split('/').filter(Boolean);
    const queryParams = event.queryStringParameters || {};

    // Mock coupons data
    const mockCoupons = [
      {
        id: 1,
        numericId: 1,
        code: "GRAD2024",
        type: "percentage",
        value: 10,
        description: "خصم 10% على جميع منتجات التخرج",
        minOrderValue: 100,
        maxDiscount: 50,
        maxUses: 100,
        currentUses: 15,
        isActive: true,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        numericId: 2,
        code: "WELCOME20",
        type: "percentage",
        value: 20,
        description: "خصم 20% للعملاء الجدد",
        minOrderValue: 200,
        maxDiscount: 100,
        maxUses: 50,
        currentUses: 8,
        isActive: true,
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        numericId: 3,
        code: "FIXED50",
        type: "fixed",
        value: 50,
        description: "خصم 50 ريال ثابت",
        minOrderValue: 300,
        maxDiscount: 50,
        maxUses: 25,
        currentUses: 3,
        isActive: true,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        numericId: 4,
        code: "EXPIRED10",
        type: "percentage",
        value: 10,
        description: "كوبون منتهي الصلاحية",
        minOrderValue: 100,
        maxDiscount: 30,
        maxUses: 20,
        currentUses: 20, // Used all available uses
        isActive: false,
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
        endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago (expired)
        createdAt: new Date().toISOString()
      }
    ];

    // Get all coupons
    if (method === 'GET' && (pathSegments.length === 2 || pathSegments[pathSegments.length - 1] === 'coupons')) {
      // Apply filters if provided
      let filteredCoupons = [...mockCoupons];
      
      if (queryParams.active === 'true') {
        filteredCoupons = filteredCoupons.filter(c => c.isActive && new Date(c.endDate) > new Date());
      }
      
      if (queryParams.search) {
        const searchTerm = queryParams.search.toLowerCase();
        filteredCoupons = filteredCoupons.filter(c => 
          c.code.toLowerCase().includes(searchTerm) || 
          c.description.toLowerCase().includes(searchTerm)
        );
      }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          data: filteredCoupons,
          total: filteredCoupons.length
        }),
      };
    }

    // Get single coupon by ID
    if (method === 'GET' && pathSegments.length === 3) {
      const couponId = parseInt(pathSegments[2]);
      const coupon = mockCoupons.find(c => c.id === couponId || c.numericId === couponId);
      
      if (!coupon) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'الكوبون غير موجود'
          }),
        };
      }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          data: coupon
        }),
      };
    }

    // Validate coupon
    if (method === 'POST' && pathSegments.includes('validate')) {
      const body = event.body ? JSON.parse(event.body) : {};
      const { code, orderValue } = body;

      if (!code) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'كود الكوبون مطلوب'
          }),
        };
      }

      const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());

      if (!coupon) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'كود الكوبون غير صحيح'
          }),
        };
      }

      // Check if active
      if (!coupon.isActive) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'هذا الكوبون غير نشط'
          }),
        };
      }

      // Check if expired
      if (new Date(coupon.endDate) < new Date()) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'انتهت صلاحية هذا الكوبون'
          }),
        };
      }

      // Check usage limit
      if (coupon.currentUses >= coupon.maxUses) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'تم استنفاد عدد مرات استخدام هذا الكوبون'
          }),
        };
      }

      // Check minimum order value
      if (orderValue && orderValue < coupon.minOrderValue) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: `الحد الأدنى للطلب هو ${coupon.minOrderValue} ريال`
          }),
        };
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = (orderValue * coupon.value) / 100;
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else if (coupon.type === 'fixed') {
        discountAmount = coupon.value;
      }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'الكوبون صالح للاستخدام',
          data: {
            ...coupon,
            discountAmount: Math.round(discountAmount * 100) / 100
          }
        }),
      };
    }

    // Apply coupon (increment usage)
    if (method === 'POST' && pathSegments.includes('apply')) {
      const body = event.body ? JSON.parse(event.body) : {};
      const { code } = body;

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'تم تطبيق الكوبون بنجاح (Demo)'
        }),
      };
    }

    // For other operations (POST, PUT, DELETE), return success for demo
    if (method === 'POST') {
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'تم إنشاء الكوبون بنجاح (Demo)',
          data: { id: Date.now() }
        }),
      };
    }

    if (method === 'PUT') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'تم تحديث الكوبون بنجاح (Demo)'
        }),
      };
    }

    if (method === 'DELETE') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'تم حذف الكوبون بنجاح (Demo)'
        }),
      };
    }

    // Method not allowed
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed'
      }),
    };

  } catch (error) {
    console.error('Coupons function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        message: 'خطأ في الخادم: ' + error.message
      }),
    };
  }
}; 