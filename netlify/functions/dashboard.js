import { 
  getAllDocuments, 
  queryDocuments,
  response, 
  handleError 
} from './utils/firestore.js';

export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return response(200, {});
  }

  try {
    const method = event.httpMethod;
    const path = event.path;
    const pathSegments = path.split('/').filter(Boolean);
    const queryParams = event.queryStringParameters || {};

    // Get main dashboard statistics
    if (method === 'GET' && pathSegments.length === 2) {
      try {
        // Get all data in parallel for better performance
        const [productsResult, categoriesResult, ordersResult, couponsResult] = await Promise.all([
          getAllDocuments('products'),
          getAllDocuments('categories'),
          getAllDocuments('orders'),
          getAllDocuments('coupons')
        ]);

        const products = productsResult.success ? productsResult.data : [];
        const categories = categoriesResult.success ? categoriesResult.data : [];
        const orders = ordersResult.success ? ordersResult.data : [];
        const coupons = couponsResult.success ? couponsResult.data : [];

        // Calculate product statistics
        const activeProducts = products.filter(p => p.isActive);
        const lowStockProducts = activeProducts.filter(p => (p.stock || 0) <= 5);
        const outOfStockProducts = activeProducts.filter(p => (p.stock || 0) === 0);
        const totalProductValue = activeProducts.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

        // Calculate category statistics
        const activeCategories = categories.filter(c => c.isActive);
        const categoriesWithCounts = await Promise.all(
          activeCategories.map(async (category) => {
            const productCount = products.filter(
              p => p.categoryId === category.numericId && p.isActive
            ).length;
            return { ...category, productCount };
          })
        );

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
                orderNumber: o.orderNumber,
                customerName: o.customerInfo?.name,
                total: o.total,
                status: o.status,
                createdAt: o.createdAt
              }))
          }
        };

        return response(200, {
          success: true,
          data: dashboardStats,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        return handleError(error);
      }
    }

    // Get detailed analytics
    if (method === 'GET' && pathSegments.includes('analytics')) {
      try {
        const { period = '30' } = queryParams; // days
        const days = parseInt(period);
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const [ordersResult, productsResult] = await Promise.all([
          getAllDocuments('orders'),
          getAllDocuments('products')
        ]);

        const orders = ordersResult.success ? ordersResult.data : [];
        const products = productsResult.success ? productsResult.data : [];

        // Filter orders by date range
        const periodOrders = orders.filter(o => 
          new Date(o.createdAt) >= startDate && o.status !== 'ملغي'
        );

        // Daily analytics
        const dailyStats = [];
        for (let i = days - 1; i >= 0; i--) {
          const dayStart = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);

          const dayOrders = periodOrders.filter(o => {
            const orderDate = new Date(o.createdAt);
            return orderDate >= dayStart && orderDate <= dayEnd;
          });

          const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

          dailyStats.push({
            date: dayStart.toISOString().split('T')[0],
            orders: dayOrders.length,
            revenue: Math.round(dayRevenue),
            averageOrder: dayOrders.length > 0 ? Math.round(dayRevenue / dayOrders.length) : 0
          });
        }

        // Customer analytics
        const customerStats = {};
        periodOrders.forEach(order => {
          const phone = order.customerInfo?.phone;
          if (phone) {
            if (!customerStats[phone]) {
              customerStats[phone] = {
                phone: phone,
                name: order.customerInfo?.name,
                orders: 0,
                totalSpent: 0
              };
            }
            customerStats[phone].orders++;
            customerStats[phone].totalSpent += order.total || 0;
          }
        });

        const topCustomers = Object.values(customerStats)
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 10);

        const analytics = {
          period: `${days} days`,
          summary: {
            totalOrders: periodOrders.length,
            totalRevenue: Math.round(periodOrders.reduce((sum, o) => sum + (o.total || 0), 0)),
            averageOrder: periodOrders.length > 0 ? 
              Math.round(periodOrders.reduce((sum, o) => sum + (o.total || 0), 0) / periodOrders.length) : 0,
            uniqueCustomers: Object.keys(customerStats).length
          },
          dailyStats: dailyStats,
          topCustomers: topCustomers
        };

        return response(200, {
          success: true,
          data: analytics
        });

      } catch (error) {
        return handleError(error);
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