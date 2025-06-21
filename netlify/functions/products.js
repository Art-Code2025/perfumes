// Simple Products Function with Mock Data
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

    // Mock products data
    const mockProducts = [
      {
        id: 1,
        numericId: 1,
        name: "وشاح تخرج أسود مطرز ذهبي مع كاب",
        description: "وشاح تخرج أنيق باللون الأسود مطرّز بخيوط ذهبية لامعة، مع كاب مطرّز يضفي لمسة فخامة على إطلالة التخرج.",
        price: 99,
        originalPrice: 120,
        stock: 50,
        categoryId: 3,
        productType: "وشاح وكاب",
        mainImage: "/images/sash-1.jpg",
        detailedImages: ["/images/sash-1-detail.jpg"],
        isActive: true,
        dynamicOptions: [
          {
            optionName: "nameOnSash",
            optionType: "text",
            required: true,
            placeholder: "الاسم على الوشاح (ثنائي أو ثلاثي)"
          },
          {
            optionName: "embroideryColor",
            optionType: "select",
            required: true,
            options: [
              { value: "ذهبي", price: 0 },
              { value: "فضي", price: 0 },
              { value: "أبيض", price: 0 }
            ]
          }
        ]
      },
      {
        id: 2,
        numericId: 2,
        name: "عباية تخرج كحلي أنيقة",
        description: "عباية كحلي أنيقة تمنحك حضوراً فخماً في يوم التخرج.",
        price: 149,
        originalPrice: 170,
        stock: 30,
        categoryId: 2,
        productType: "عباية تخرج",
        mainImage: "/images/abaya-1.jpg",
        detailedImages: ["/images/abaya-1-detail.jpg"],
        isActive: true,
        dynamicOptions: [
          {
            optionName: "size",
            optionType: "select",
            required: true,
            options: [
              { value: "48", price: 0 },
              { value: "50", price: 0 },
              { value: "52", price: 0 },
              { value: "54", price: 0 },
              { value: "56", price: 0 }
            ]
          }
        ]
      },
      {
        id: 3,
        numericId: 3,
        name: "مريول مدرسي كحلي",
        description: "مريول كحلي كلاسيكي بتصميم عملي ومريح يناسب اليوم الدراسي.",
        price: 89,
        originalPrice: 110,
        stock: 100,
        categoryId: 5,
        productType: "مريول مدرسي",
        mainImage: "/images/uniform-1.jpg",
        detailedImages: [],
        isActive: true,
        dynamicOptions: [
          {
            optionName: "size",
            optionType: "select",
            required: true,
            options: [
              { value: "34", price: 0 },
              { value: "36", price: 0 },
              { value: "38", price: 0 },
              { value: "40", price: 0 },
              { value: "42", price: 0 }
            ]
          }
        ]
      }
    ];

    // Get all products
    if (method === 'GET' && (pathSegments.length === 2 || pathSegments[pathSegments.length - 1] === 'products')) {
      // Apply filters if provided
      let filteredProducts = [...mockProducts];
      
      if (queryParams.category) {
        filteredProducts = filteredProducts.filter(p => p.categoryId.toString() === queryParams.category);
      }
      
      if (queryParams.search) {
        const searchTerm = queryParams.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm) || 
          p.description.toLowerCase().includes(searchTerm)
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
          data: filteredProducts,
          total: filteredProducts.length
        }),
      };
    }

    // Get single product by ID
    if (method === 'GET' && pathSegments.length === 3) {
      const productId = parseInt(pathSegments[2]);
      const product = mockProducts.find(p => p.id === productId);
      
      if (!product) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'المنتج غير موجود'
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
          data: product
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
          message: 'تم إنشاء المنتج بنجاح (Demo)',
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
          message: 'تم تحديث المنتج بنجاح (Demo)'
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
          message: 'تم حذف المنتج بنجاح (Demo)'
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
    console.error('Products function error:', error);
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