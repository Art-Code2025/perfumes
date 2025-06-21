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

// إنشاء رابط احترافي للمنتج
export const createProductSlug = (id: number, name: string): string => {
  const slug = slugify(name);
  return slug ? `${slug}-${id}` : `product-${id}`;
};

// إنشاء رابط احترافي للفئة
export const createCategorySlug = (id: number, name: string): string => {
  const slug = slugify(name);
  return slug ? `${slug}-${id}` : `category-${id}`;
};

// استخراج ID من slug
export const extractIdFromSlug = (slug: string): number => {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
};

// التحقق من صحة slug
export const isValidSlug = (slug: string): boolean => {
  return /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\-]+-\d+$/.test(slug);
}; 