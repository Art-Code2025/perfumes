import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dfbup2swi',
  api_key: process.env.CLOUDINARY_API_KEY || '916154321177141',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'PZXZo4_HKqc-P0A4jONOIjnfzCc'
});

export const handler = async (event, context) => {
  console.log('🔄 Upload function called:', {
    method: event.httpMethod,
    contentType: event.headers['content-type'],
    timestamp: new Date().toISOString()
  });

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  try {
    // Parse form data from the request
    const contentType = event.headers['content-type'] || '';
    
    if (!contentType.includes('multipart/form-data')) {
      console.error('❌ Invalid content type:', contentType);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid content type. Expected multipart/form-data'
        })
      };
    }

    // For now, since parsing multipart data is complex in serverless,
    // we'll expect the frontend to send base64 data instead
    // This is a temporary solution until we implement proper multipart parsing
    
    console.log('⚠️ Upload function: Multipart parsing not implemented yet');
    console.log('💡 Frontend should use base64 encoding for images');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Upload function ready - use base64 encoding in frontend',
        data: {
          url: 'data:image/png;base64,placeholder', // Placeholder response
          note: 'Please implement base64 image handling in frontend'
        }
      })
    };
    
  } catch (error) {
    console.error('❌ Upload function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Server error: ' + error.message
      })
    };
  }
}; 