import { response, handleError } from './utils/firestore.js';

const CLOUDINARY_CONFIG = {
  cloudName: "dfbup2swi",
  uploadPreset: "perfume"
};

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (file, folder = 'products') => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    formData.append("folder", folder);
    
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    if (!uploadResponse.ok) {
      throw new Error(`HTTP error! status: ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to delete from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    
    const deleteResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/destroy`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await deleteResponse.json();
    return {
      success: data.result === 'ok',
      message: data.result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Parse multipart form data (simple implementation for images)
const parseMultipart = (event) => {
  const boundary = event.headers['content-type']?.split('boundary=')[1];
  if (!boundary) {
    throw new Error('No boundary found in multipart data');
  }

  const body = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
  const parts = body.toString('binary').split(`--${boundary}`);
  
  const files = [];
  const fields = {};

  for (const part of parts) {
    if (part.includes('Content-Disposition: form-data')) {
      const headers = part.split('\r\n\r\n')[0];
      const content = part.split('\r\n\r\n')[1];
      
      if (!content) continue;

      const nameMatch = headers.match(/name="([^"]+)"/);
      const filenameMatch = headers.match(/filename="([^"]+)"/);
      
      if (nameMatch) {
        const fieldName = nameMatch[1];
        
        if (filenameMatch) {
          // This is a file
          const filename = filenameMatch[1];
          const contentType = headers.match(/Content-Type: ([^\r\n]+)/)?.[1] || 'application/octet-stream';
          
          files.push({
            fieldName,
            filename,
            contentType,
            data: Buffer.from(content.slice(0, -2), 'binary') // Remove trailing \r\n
          });
        } else {
          // This is a regular field
          fields[fieldName] = content.trim();
        }
      }
    }
  }

  return { files, fields };
};

export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return response(200, {});
  }

  try {
    const method = event.httpMethod;
    const path = event.path;
    const pathSegments = path.split('/').filter(Boolean);

    // Upload single image
    if (method === 'POST' && pathSegments.length === 2) {
      try {
        // Check content type
        const contentType = event.headers['content-type'] || '';
        
        if (!contentType.includes('multipart/form-data')) {
          return response(400, {
            success: false,
            message: 'Content-Type must be multipart/form-data'
          });
        }

        // Parse multipart data
        const { files, fields } = parseMultipart(event);
        
        if (files.length === 0) {
          return response(400, {
            success: false,
            message: 'لم يتم العثور على ملفات للرفع'
          });
        }

        const file = files[0];
        const folder = fields.folder || 'products';

        // Validate file type
        if (!file.contentType.startsWith('image/')) {
          return response(400, {
            success: false,
            message: 'فقط ملفات الصور مسموحة'
          });
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.data.length > maxSize) {
          return response(400, {
            success: false,
            message: 'حجم الملف كبير جداً (الحد الأقصى 5MB)'
          });
        }

        // Create File object for Cloudinary
        const fileBlob = new Blob([file.data], { type: file.contentType });
        const fileObject = new File([fileBlob], file.filename, { type: file.contentType });

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(fileObject, folder);

        if (uploadResult.success) {
          return response(200, {
            success: true,
            message: 'تم رفع الصورة بنجاح',
            data: {
              url: uploadResult.url,
              publicId: uploadResult.publicId,
              width: uploadResult.width,
              height: uploadResult.height,
              format: uploadResult.format,
              size: uploadResult.bytes
            }
          });
        } else {
          throw new Error(uploadResult.error);
        }

      } catch (error) {
        console.error('Upload error:', error);
        return response(400, {
          success: false,
          message: 'فشل في رفع الصورة: ' + error.message
        });
      }
    }

    // Upload multiple images
    if (method === 'POST' && pathSegments.includes('multiple')) {
      try {
        const contentType = event.headers['content-type'] || '';
        
        if (!contentType.includes('multipart/form-data')) {
          return response(400, {
            success: false,
            message: 'Content-Type must be multipart/form-data'
          });
        }

        const { files, fields } = parseMultipart(event);
        
        if (files.length === 0) {
          return response(400, {
            success: false,
            message: 'لم يتم العثور على ملفات للرفع'
          });
        }

        const folder = fields.folder || 'products';
        const maxFiles = 10;

        if (files.length > maxFiles) {
          return response(400, {
            success: false,
            message: `عدد الملفات كبير جداً (الحد الأقصى ${maxFiles} ملفات)`
          });
        }

        const uploadPromises = files.map(async (file) => {
          // Validate file type
          if (!file.contentType.startsWith('image/')) {
            return {
              success: false,
              filename: file.filename,
              error: 'نوع الملف غير مدعوم'
            };
          }

          // Validate file size
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.data.length > maxSize) {
            return {
              success: false,
              filename: file.filename,
              error: 'حجم الملف كبير جداً'
            };
          }

          try {
            const fileBlob = new Blob([file.data], { type: file.contentType });
            const fileObject = new File([fileBlob], file.filename, { type: file.contentType });
            
            const uploadResult = await uploadToCloudinary(fileObject, folder);
            
            return {
              success: uploadResult.success,
              filename: file.filename,
              url: uploadResult.url,
              publicId: uploadResult.publicId,
              error: uploadResult.error
            };
          } catch (error) {
            return {
              success: false,
              filename: file.filename,
              error: error.message
            };
          }
        });

        const results = await Promise.all(uploadPromises);
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        return response(200, {
          success: failed.length === 0,
          message: `تم رفع ${successful.length} من ${files.length} ملف بنجاح`,
          data: {
            successful: successful.map(r => ({
              url: r.url,
              publicId: r.publicId,
              filename: r.filename
            })),
            failed: failed.map(r => ({
              filename: r.filename,
              error: r.error
            })),
            urls: successful.map(r => r.url)
          }
        });

      } catch (error) {
        return handleError(error);
      }
    }

    // Delete image
    if (method === 'DELETE' && pathSegments.length === 3) {
      const publicId = pathSegments[2];
      
      if (!publicId) {
        return response(400, {
          success: false,
          message: 'معرف الصورة مطلوب'
        });
      }

      try {
        const deleteResult = await deleteFromCloudinary(publicId);
        
        if (deleteResult.success) {
          return response(200, {
            success: true,
            message: 'تم حذف الصورة بنجاح'
          });
        } else {
          throw new Error(deleteResult.error || 'فشل في حذف الصورة');
        }
      } catch (error) {
        return response(400, {
          success: false,
          message: 'فشل في حذف الصورة: ' + error.message
        });
      }
    }

    // Get upload signature (for direct client uploads)
    if (method === 'GET' && pathSegments.includes('signature')) {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folder = event.queryStringParameters?.folder || 'products';
      
      return response(200, {
        success: true,
        data: {
          timestamp,
          cloudName: CLOUDINARY_CONFIG.cloudName,
          uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
          folder,
          apiKey: process.env.CLOUDINARY_API_KEY // If you want to use signed uploads
        }
      });
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