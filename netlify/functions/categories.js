// Simple Categories Function with Mock Data
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

    // Mock categories data
    const mockCategories = [
      {
        id: 1,
        numericId: 1,
        name: "أوشحة وكابات تخرج",
        description: "أوشحة وكابات تخرج مطرزة بأجود الخامات",
        image: "/images/category-sashes.jpg",
        isActive: true,
        productCount: 15
      },
      {
        id: 2,
        numericId: 2,
        name: "عبايات تخرج",
        description: "عبايات تخرج أنيقة بتصاميم عصرية",
        image: "/images/category-abayas.jpg",
        isActive: true,
        productCount: 8
      },
      {
        id: 3,
        numericId: 3,
        name: "أوشحة وكابات",
        description: "أوشحة وكابات متنوعة للمناسبات",
        image: "/images/category-accessories.jpg",
        isActive: true,
        productCount: 12
      },
      {
        id: 4,
        numericId: 4,
        name: "إكسسوارات تخرج",
        description: "إكسسوارات متنوعة لإطلالة التخرج المثالية",
        image: "/images/category-graduation-accessories.jpg",
        isActive: true,
        productCount: 6
      },
      {
        id: 5,
        numericId: 5,
        name: "مرايل مدرسية",
        description: "مرايل مدرسية بخامات عالية الجودة",
        image: "/images/category-uniforms.jpg",
        isActive: true,
        productCount: 20
      }
    ];

    // Get all categories
    if (method === 'GET' && (pathSegments.length === 2 || pathSegments[pathSegments.length - 1] === 'categories')) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          data: mockCategories.filter(cat => cat.isActive),
          total: mockCategories.filter(cat => cat.isActive).length
        }),
      };
    }

    // Get single category by ID
    if (method === 'GET' && pathSegments.length === 3) {
      const categoryId = parseInt(pathSegments[2]);
      const category = mockCategories.find(c => c.id === categoryId);
      
      if (!category) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'التصنيف غير موجود'
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
          data: category
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
          message: 'تم إنشاء التصنيف بنجاح (Demo)',
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
          message: 'تم تحديث التصنيف بنجاح (Demo)'
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
          message: 'تم حذف التصنيف بنجاح (Demo)'
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
    console.error('Categories function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        message: 'خطأ في الخادم'
      }),
    };
  }
}; 