// تحويل النص العربي والإنجليزي إلى slug احترافي
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // استبدال المسافات بشرطات
    .replace(/\s+/g, '-')
    // إزالة الأحرف الخاصة
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\-]/g, '')
    // إزالة الشرطات المتعددة
    .replace(/-+/g, '-')
    // إزالة الشرطات من البداية والنهاية
    .replace(/^-+|-+$/g, '');
};

// إنشاء رابط احترافي للمنتج (معتمد على الاسم فقط)
export const createProductSlug = (name: string): string => {
  return slugify(name) || 'product';
};

// إنشاء رابط احترافي للفئة (معتمد على الاسم فقط)
export const createCategorySlug = (name: string): string => {
  return slugify(name) || 'category';
};

// استخراج ID من slug (لم يعد مطلوبًا بنفس الطريقة، لكن سنبقيه للطوارئ)
export const extractIdFromSlug = (slug: string): string => {
  const match = slug.match(/-([a-zA-Z0-9]+)$/);
  return match ? match[1] : slug; // Return the whole slug if no ID found
};

// التحقق من صحة slug (الآن أي نص صالح)
export const isValidSlug = (slug: string): boolean => {
  return typeof slug === 'string' && slug.length > 0;
};
