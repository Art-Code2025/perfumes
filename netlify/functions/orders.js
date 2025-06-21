// Orders Function with Mock Data
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

    // Mock orders data
    const mockOrders = [
      {
        id: 1,
        orderNumber: "ORD-001",
        customerName: "أحمد محمد علي",
        customerPhone: "0551234567",
        customerEmail: "ahmed@example.com",
        address: "الرياض، حي النرجس",
        city: "الرياض",
        status: "مُستلم",
        paymentMethod: "كاش عند الاستلام",
        paymentStatus: "مدفوع",
        total: 198,
        subtotal: 198,
        deliveryFee: 0,
        couponDiscount: 0,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        notes: "طلب عادي",
        items: [
          {
            productId: 1,
            productName: "وشاح تخرج أسود مطرز ذهبي مع كاب",
            price: 99,
            quantity: 2,
            totalPrice: 198,
            selectedOptions: {
              nameOnSash: "أحمد محمد",
              embroideryColor: "ذهبي"
            },
            productImage: "/images/sash-1.jpg"
          }
        ]
      },
      {
        id: 2,
        orderNumber: "ORD-002",
        customerName: "فاطمة علي أحمد",
        customerPhone: "0559876543",
        customerEmail: "fatima@example.com",
        address: "جدة، حي الحمراء",
        city: "جدة",
        status: "قيد التنفيذ",
        paymentMethod: "كاش عند الاستلام",
        paymentStatus: "معلق",
        total: 149,
        subtotal: 149,
        deliveryFee: 0,
        couponDiscount: 0,
        createdAt: new Date().toISOString(), // Today
        notes: "عاجل - التخرج غداً",
        items: [
          {
            productId: 2,
            productName: "عباية تخرج كحلي أنيقة",
            price: 149,
            quantity: 1,
            totalPrice: 149,
            selectedOptions: {
              size: "50"
            },
            productImage: "/images/abaya-1.jpg"
          }
        ]
      },
      {
        id: 3,
        orderNumber: "ORD-003",
        customerName: "محمد سعد",
        customerPhone: "0556667777",
        customerEmail: "mohammed@example.com",
        address: "الدمام، حي الفيصلية",
        city: "الدمام",
        status: "معلق",
        paymentMethod: "تحويل بنكي",
        paymentStatus: "معلق",
        total: 267,
        subtotal: 267,
        deliveryFee: 0,
        couponDiscount: 0,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
        notes: "",
        items: [
          {
            productId: 1,
            productName: "وشاح تخرج أسود مطرز ذهبي مع كاب",
            price: 99,
            quantity: 1,
            totalPrice: 99,
            selectedOptions: {
              nameOnSash: "محمد سعد",
              embroideryColor: "فضي"
            }
          },
          {
            productId: 3,
            productName: "مريول مدرسي كحلي",
            price: 89,
            quantity: 2,
            totalPrice: 178,
            selectedOptions: {
              size: "38"
            }
          }
        ]
      }
    ];

    // Get all orders
    if (method === 'GET' && (pathSegments.length === 2 || pathSegments[pathSegments.length - 1] === 'orders')) {
      // Apply filters if provided
      let filteredOrders = [...mockOrders];
      
      if (queryParams.status && queryParams.status !== 'all') {
        filteredOrders = filteredOrders.filter(o => o.status === queryParams.status);
      }
      
      if (queryParams.search) {
        const searchTerm = queryParams.search.toLowerCase();
        filteredOrders = filteredOrders.filter(o => 
          o.customerName.toLowerCase().includes(searchTerm) || 
          o.customerPhone.includes(searchTerm) ||
          o.orderNumber.toLowerCase().includes(searchTerm)
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
          data: filteredOrders,
          total: filteredOrders.length
        }),
      };
    }

    // Get single order by ID
    if (method === 'GET' && pathSegments.length === 3) {
      const orderId = parseInt(pathSegments[2]);
      const order = mockOrders.find(o => o.id === orderId);
      
      if (!order) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'الطلب غير موجود'
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
          data: order
        }),
      };
    }

    // Get orders stats
    if (method === 'GET' && pathSegments.includes('stats')) {
      const totalOrders = mockOrders.length;
      const completedOrders = mockOrders.filter(o => o.status === 'مُستلم');
      const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
      
      const stats = {
        totalOrders,
        completedOrders: completedOrders.length,
        totalRevenue,
        averageOrder: completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0,
        statusBreakdown: {
          pending: mockOrders.filter(o => o.status === 'معلق').length,
          processing: mockOrders.filter(o => o.status === 'قيد التنفيذ').length,
          shipped: mockOrders.filter(o => o.status === 'مُرسل').length,
          delivered: mockOrders.filter(o => o.status === 'مُستلم').length,
          cancelled: mockOrders.filter(o => o.status === 'ملغي').length
        }
      };

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          data: stats
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
          message: 'تم إنشاء الطلب بنجاح (Demo)',
          data: { id: Date.now(), orderNumber: `ORD-${Date.now()}` }
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
          message: 'تم تحديث الطلب بنجاح (Demo)'
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
          message: 'تم حذف/إلغاء الطلب بنجاح (Demo)'
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
    console.error('Orders function error:', error);
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