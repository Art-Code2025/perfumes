// Auth Function for Admin Login
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

    // Admin login endpoint
    if (method === 'POST' && pathSegments.includes('admin')) {
      const body = event.body ? JSON.parse(event.body) : {};
      const { username, password } = body;

      console.log('🔐 Admin login attempt:', { username });

      // Check credentials - hardcoded for demo
      const validCredentials = [
        { username: 'admin', password: '123123' },
        { username: 'administrator', password: '123123' },
        { username: 'مدير', password: '123123' }
      ];

      const isValid = validCredentials.some(cred => 
        cred.username === username && cred.password === password
      );

      if (!isValid) {
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

      // Create a simple token (not JWT for simplicity)
      const token = Buffer.from(JSON.stringify({
        username,
        role: 'admin',
        exp: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        loginTime: Date.now()
      })).toString('base64');

      const user = {
        username,
        role: 'admin',
        name: username === 'admin' ? 'المدير العام' : 'مدير النظام',
        permissions: ['all']
      };

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
          user: user
        }),
      };
    }

    // Verify token endpoint
    if (method === 'POST' && pathSegments.includes('verify')) {
      const body = event.body ? JSON.parse(event.body) : {};
      const { token } = body;

      if (!token) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'Token مطلوب'
          }),
        };
      }

      try {
        const decoded = JSON.parse(atob(token));
        
        if (decoded.exp && decoded.exp < Date.now()) {
          return {
            statusCode: 401,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              success: false,
              message: 'انتهت صلاحية الجلسة'
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
            user: {
              username: decoded.username,
              role: decoded.role
            }
          }),
        };
      } catch (error) {
        return {
          statusCode: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'Token غير صالح'
          }),
        };
      }
    }

    // Get current user endpoint
    if (method === 'GET' && pathSegments.includes('me')) {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'Token مطلوب'
          }),
        };
      }

      const token = authHeader.replace('Bearer ', '');

      try {
        const decoded = JSON.parse(atob(token));
        
        if (decoded.exp && decoded.exp < Date.now()) {
          return {
            statusCode: 401,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              success: false,
              message: 'انتهت صلاحية الجلسة'
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
            user: {
              username: decoded.username,
              role: decoded.role,
              name: decoded.username === 'admin' ? 'المدير العام' : 'مدير النظام'
            }
          }),
        };
      } catch (error) {
        return {
          statusCode: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: false,
            message: 'Token غير صالح'
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
        message: 'خطأ في الخادم: ' + error.message
      }),
    };
  }
}; 