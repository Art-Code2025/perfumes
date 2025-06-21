// Dashboard Function with Mock Data instead of Firestore
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

    // Mock data for dashboard statistics
    const mockProducts = [
      {
        id: 1,
        numericId: 1,
        name: "وشاح تخرج أسود مطرز ذهبي مع كاب",
        price: 99,
        stock: 50,
        categoryId: 3,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        numericId: 2,
        name: "عباية تخرج كحلي أنيقة",
        price: 149,
        stock: 30,
        categoryId: 2,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        numericId: 3,
        name: "مريول مدرسي كحلي",
        price: 89,
        stock: 100,
        categoryId: 5,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    const mockCategories = [
      {
        id: 1,
        numericId: 1,
        name: "أوشحة التخرج",
        description: "أوشحة التخرج المطرزة",
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        numericId: 2,
        name: "عبايات التخرج",
        description: "عبايات التخرج الأنيقة",
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    const mockOrders = [
      {
        id: 1,
        customerName: "أحمد محمد",
        total: 198,
        status: "مُستلم",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        items: [
          {
            productId: 1,
            productName: "وشاح تخرج أسود مطرز ذهبي مع كاب",
            quantity: 2,
            totalPrice: 198
          }
        ]
      },
      {
        id: 2,
        customerName: "فاطمة علي",
        total: 149,
        status: "قيد التنفيذ",
        createdAt: new Date().toISOString(), // Today
        items: [
          {
            productId: 2,
            productName: "عباية تخرج كحلي أنيقة",
            quantity: 1,
            totalPrice: 149
          }
        ]
      }
    ];

    const mockCoupons = [
      {
        id: 1,
        code: "GRAD2024",
        value: 10,
        type: "percentage",
        isActive: true,
        currentUses: 5,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      }
    ];

    // Get main dashboard statistics
    if (method === 'GET' && pathSegments.length === 2) {
      const products = mockProducts;
      const categories = mockCategories;
      const orders = mockOrders;
      const coupons = mockCoupons;

      // Calculate product statistics
      const activeProducts = products.filter(p => p.isActive);
      const lowStockProducts = activeProducts.filter(p => (p.stock || 0) <= 10);
      const outOfStockProducts = activeProducts.filter(p => (p.stock || 0) === 0);
      const totalProductValue = activeProducts.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

      // Calculate category statistics
      const activeCategories = categories.filter(c => c.isActive);
      const categoriesWithCounts = activeCategories.map(category => {
        const productCount = products.filter(
          p => p.categoryId === category.numericId && p.isActive
        ).length;
        return { ...category, productCount };
      });

      // Calculate order statistics
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const todayOrders = orders.filter(o => new Date(o.createdAt) >= startOfToday);
      const weekOrders = orders.filter(o => new Date(o.createdAt) >= startOfWeek);
      const monthOrders = orders.filter(o => new Date(o.createdAt) >= startOfMonth);

      const completedOrders = orders.filter(o => o.status !== 'ملغي');
      const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const todayRevenue = todayOrders
        .filter(o => o.status !== 'ملغي')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      const ordersByStatus = {
        pending: orders.filter(o => o.status === 'معلق').length,
        processing: orders.filter(o => o.status === 'قيد التنفيذ').length,
        shipped: orders.filter(o => o.status === 'مُرسل').length,
        delivered: orders.filter(o => o.status === 'مُستلم').length,
        cancelled: orders.filter(o => o.status === 'ملغي').length
      };

      // Calculate coupon statistics
      const activeCoupons = coupons.filter(c => c.isActive);
      const expiredCoupons = activeCoupons.filter(c => 
        c.endDate && new Date(c.endDate) < today
      );
      const usedCoupons = activeCoupons.filter(c => (c.currentUses || 0) > 0);

      // Calculate monthly revenue chart data
      const monthlyRevenue = [];
      for (let i = 11; i >= 0; i--) {
        const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
        
        const monthOrders = orders.filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate >= monthStart && orderDate <= monthEnd && o.status !== 'ملغي';
        });
        
        const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        
        monthlyRevenue.push({
          month: monthStart.toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' }),
          revenue: Math.round(monthRevenue),
          orders: monthOrders.length
        });
      }

      // Top selling products (based on order items)
      const productSales = {};
      orders.forEach(order => {
        if (order.status !== 'ملغي' && order.items) {
          order.items.forEach(item => {
            if (!productSales[item.productId]) {
              productSales[item.productId] = {
                productId: item.productId,
                productName: item.productName,
                totalQuantity: 0,
                totalRevenue: 0
              };
            }
            productSales[item.productId].totalQuantity += item.quantity || 0;
            productSales[item.productId].totalRevenue += item.totalPrice || 0;
          });
        }
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5);

      const dashboardStats = {
        // Product Statistics
        products: {
          total: products.length,
          active: activeProducts.length,
          lowStock: lowStockProducts.length,
          outOfStock: outOfStockProducts.length,
          totalValue: Math.round(totalProductValue)
        },

        // Category Statistics
        categories: {
          total: categories.length,
          active: activeCategories.length,
          withProducts: categoriesWithCounts.filter(c => c.productCount > 0).length,
          list: categoriesWithCounts.slice(0, 10)
        },

        // Order Statistics
        orders: {
          total: orders.length,
          today: todayOrders.length,
          thisWeek: weekOrders.length,
          thisMonth: monthOrders.length,
          byStatus: ordersByStatus
        },

        // Revenue Statistics
        revenue: {
          total: Math.round(totalRevenue),
          today: Math.round(todayRevenue),
          averageOrder: completedOrders.length > 0 ? 
            Math.round(totalRevenue / completedOrders.length) : 0,
          monthlyChart: monthlyRevenue
        },

        // Coupon Statistics
        coupons: {
          total: coupons.length,
          active: activeCoupons.length,
          expired: expiredCoupons.length,
          used: usedCoupons.length,
          totalUsage: activeCoupons.reduce((sum, c) => sum + (c.currentUses || 0), 0)
        },

        // Additional insights
        insights: {
          topProducts: topProducts,
          lowStockProducts: lowStockProducts.slice(0, 5).map(p => ({
            id: p.id,
            name: p.name,
            stock: p.stock || 0,
            price: p.price
          })),
          recentOrders: orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(o => ({
              id: o.id,
              orderNumber: o.id,
              customerName: o.customerName,
              total: o.total,
              status: o.status,
              createdAt: o.createdAt
            }))
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
          data: dashboardStats,
          timestamp: new Date().toISOString()
        })
      };
    }

    // Handle analytics endpoint
    if (method === 'GET' && pathSegments.length === 3 && pathSegments[2] === 'analytics') {
      const analyticsData = {
        period: queryParams.period || '30',
        sales: {
          total: 2500,
          growth: 15.5,
          trend: 'up'
        },
        orders: {
          total: 45,
          growth: 8.2,
          trend: 'up'
        },
        customers: {
          total: 120,
          growth: 12.1,
          trend: 'up'
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
          data: analyticsData
        })
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
      })
    };

  } catch (error) {
    console.error('Dashboard function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        message: 'خطأ في الخادم: ' + error.message
      })
    };
  }
}; 