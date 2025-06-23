// سكريبت تشغيل إضافة بيانات العطور
import { addPerfumeDataToDashboard } from './perfumeDataScript';

// دالة لتشغيل السكريپت
export const runPerfumeDataScript = async () => {
  try {
    console.log('🚀 بدء تشغيل سكريپت إضافة بيانات العطور...');
    
    const result = await addPerfumeDataToDashboard();
    
    if (result.success) {
      console.log('✅ نجح السكريپت:', result.message);
      alert('✅ ' + result.message);
    } else {
      console.error('❌ فشل السكريپت:', result.message);
      alert('❌ ' + result.message);
    }
    
    return result;
  } catch (error) {
    console.error('❌ خطأ في تشغيل السكريپت:', error);
    alert('❌ حدث خطأ في تشغيل السكريپت');
    return { success: false, message: 'خطأ في التشغيل' };
  }
};

// تشغيل السكريپت تلقائياً عند استيراد الملف في وضع التطوير
if (typeof window !== 'undefined') {
  // إضافة السكريپت للنافذة العامة للوصول إليه من console
  (window as any).runPerfumeScript = runPerfumeDataScript;
  console.log('💡 يمكنك تشغيل السكريپت بكتابة: runPerfumeScript() في console');
} 