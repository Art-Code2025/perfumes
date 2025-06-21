// Simple Auth Function without Firebase
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
    const body = event.body ? JSON.parse(event.body) : {};

    // Admin login endpoint
    if (method === 'POST' && pathSegments.includes('admin')) {
      const { username, password } = body;

      // Hardcoded admin credentials
      const ADMIN_USERNAME = 'admin';
      const ADMIN_PASSWORD = '123123';

      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = Buffer.from(JSON.stringify({
          uid: 'demo-admin',
          email: 'admin@ghem.com',
          username: username,
          role: 'admin',
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
            message: 'تم تسجيل دخول الإدمن بنجاح',
            token: token,
            user: {
              uid: 'demo-admin',
              email: 'admin@ghem.com',
              username: username,
              role: 'admin',
              displayName: 'المدير'
            }
          }),
        };
      } else {
        return {
          statusCode: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'بيانات الدخول غير صحيحة'
          }),
        };
      }
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
    console.error('Auth function error:', error);
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