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

  try {
    const method = event.httpMethod;
    const path = event.path;
    const pathSegments = path.split('/').filter(Boolean);
    const queryParams = event.queryStringParameters || {};

    // Mock categories data
    const mockCategories = [
      {
        id: 1,
        numericId: 1,
        name: "أوشحة التخرج",
        description: "أوشحة التخرج المطرزة بأفضل الخامات والتطريز الذهبي",
        image: "/images/category-sashes.jpg",
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        numericId: 2,
        name: "عبايات التخرج",
        description: "عبايات التخرج الأنيقة والكلاسيكية",
        image: "/images/category-abayas.jpg",
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        numericId: 3,
        name: "كابات التخرج",
        description: "كابات التخرج المطرزة باسم الطالب",
        image: "/images/category-caps.jpg",
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        numericId: 4,
        name: "إكسسوارات التخرج",
        description: "إكسسوارات وهدايا التخرج المميزة",
        image: "/images/category-accessories.jpg",
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        numericId: 5,
        name: "الملابس المدرسية",
        description: "المرايل والملابس المدرسية",
        image: "/images/category-uniforms.jpg",
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    // Get all categories
    if (method === 'GET' && (pathSegments.length === 2 || pathSegments[pathSegments.length - 1] === 'categories')) {
      // Apply filters if provided
      let filteredCategories = [...mockCategories];
      
      if (queryParams.active) {
        filteredCategories = filteredCategories.filter(c => c.isActive);
      }
      
      if (queryParams.search) {
        const searchTerm = queryParams.search.toLowerCase();
        filteredCategories = filteredCategories.filter(c => 
          c.name.toLowerCase().includes(searchTerm) || 
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
          data: filteredCategories,
          total: filteredCategories.length
        }),
      };
    }

    // Get single category by ID
    if (method === 'GET' && pathSegments.length === 3) {
      const categoryId = parseInt(pathSegments[2]);
      const category = mockCategories.find(c => c.id === categoryId || c.numericId === categoryId);
      
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
        message: 'خطأ في الخادم: ' + error.message
      }),
    };
  }
}; 