// Customers Function with Mock Data
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

    // Mock customers data
    const mockCustomers = [
      {
        id: 1,
        numericId: 1,
        email: "ahmed@example.com",
        firstName: "أحمد",
        lastName: "محمد علي",
        fullName: "أحمد محمد علي",
        name: "أحمد محمد علي",
        phone: "0551234567",
        city: "الرياض",
        totalOrders: 3,
        totalSpent: 450,
        lastOrderDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        status: "active",
        cartItemsCount: 2,
        wishlistItemsCount: 5,
        hasCart: true,
        hasWishlist: true
      },
      {
        id: 2,
        numericId: 2,
        email: "fatima@example.com",
        firstName: "فاطمة",
        lastName: "علي أحمد",
        fullName: "فاطمة علي أحمد",
        name: "فاطمة علي أحمد",
        phone: "0559876543",
        city: "جدة",
        totalOrders: 1,
        totalSpent: 149,
        lastOrderDate: new Date().toISOString(), // Today
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        status: "active",
        cartItemsCount: 0,
        wishlistItemsCount: 3,
        hasCart: false,
        hasWishlist: true
      },
      {
        id: 3,
        numericId: 3,
        email: "mohammed@example.com",
        firstName: "محمد",
        lastName: "سعد",
        fullName: "محمد سعد",
        name: "محمد سعد",
        phone: "0556667777",
        city: "الدمام",
        totalOrders: 1,
        totalSpent: 267,
        lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        lastLogin: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
        status: "active",
        cartItemsCount: 1,
        wishlistItemsCount: 0,
        hasCart: true,
        hasWishlist: false
      },
      {
        id: 4,
        numericId: 4,
        email: "sara@example.com",
        firstName: "سارة",
        lastName: "محمد",
        fullName: "سارة محمد",
        name: "سارة محمد",
        phone: "0554445555",
        city: "الرياض",
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null,
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        status: "inactive",
        cartItemsCount: 3,
        wishlistItemsCount: 8,
        hasCart: true,
        hasWishlist: true
      }
    ];

    // Get all customers
    if (method === 'GET' && (pathSegments.length === 2 || pathSegments[pathSegments.length - 1] === 'customers')) {
      // Apply filters if provided
      let filteredCustomers = [...mockCustomers];
      
      if (queryParams.status && queryParams.status !== 'all') {
        filteredCustomers = filteredCustomers.filter(c => c.status === queryParams.status);
      }
      
      if (queryParams.search) {
        const searchTerm = queryParams.search.toLowerCase();
        filteredCustomers = filteredCustomers.filter(c => 
          c.name.toLowerCase().includes(searchTerm) || 
          c.email.toLowerCase().includes(searchTerm) ||
          c.phone.includes(searchTerm)
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
          data: filteredCustomers,
          total: filteredCustomers.length
        }),
      };
    }

    // Get single customer by ID
    if (method === 'GET' && pathSegments.length === 3) {
      const customerId = parseInt(pathSegments[2]);
      const customer = mockCustomers.find(c => c.id === customerId || c.numericId === customerId);
      
      if (!customer) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'العميل غير موجود'
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
          data: customer
        }),
      };
    }

    // Login endpoint
    if (method === 'POST' && pathSegments.includes('login')) {
      const body = event.body ? JSON.parse(event.body) : {};
      const { email, password } = body;

      if (!email || !password) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'البريد الإلكتروني وكلمة المرور مطلوبان'
          }),
        };
      }

      // Find customer by email
      const customer = mockCustomers.find(c => c.email.toLowerCase() === email.toLowerCase());

      if (!customer) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'البريد الإلكتروني غير مسجل'
          }),
        };
      }

      // For demo purposes, accept any password for existing customers
      // In real implementation, you would verify the hashed password

      const token = Buffer.from(JSON.stringify({
        uid: customer.id,
        email: customer.email,
        name: customer.name,
        role: 'customer',
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      })).toString('base64');

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'تم تسجيل الدخول بنجاح',
          token: token,
          user: {
            uid: customer.id,
            email: customer.email,
            name: customer.name,
            phone: customer.phone,
            role: 'customer'
          }
        }),
      };
    }

    // Register endpoint
    if (method === 'POST' && pathSegments.includes('register')) {
      const body = event.body ? JSON.parse(event.body) : {};
      const { email, password, name, phone } = body;

      if (!email || !password || !name) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'البريد الإلكتروني وكلمة المرور والاسم مطلوبان'
          }),
        };
      }

      // Check if email already exists
      const existingCustomer = mockCustomers.find(c => c.email.toLowerCase() === email.toLowerCase());
      
      if (existingCustomer) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'البريد الإلكتروني مسجل بالفعل'
          }),
        };
      }

      const newCustomer = {
        id: Date.now(),
        email,
        name,
        phone: phone || '',
        role: 'customer'
      };

      const token = Buffer.from(JSON.stringify({
        uid: newCustomer.id,
        email: newCustomer.email,
        name: newCustomer.name,
        role: 'customer',
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      })).toString('base64');

      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'تم التسجيل بنجاح',
          token: token,
          user: newCustomer
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
          message: 'تم إنشاء العميل بنجاح (Demo)',
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
          message: 'تم تحديث العميل بنجاح (Demo)'
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
          message: 'تم حذف العميل بنجاح (Demo)'
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
    console.error('Customers function error:', error);
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