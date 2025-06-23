// Seed data for perfume products and categories

export interface Category {
  id?: number;
  name: string;
  description?: string;
}

export interface Product {
  id?: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryName: string;
  rating: number;
  mainImage: string;
  specifications: { name: string; value: string }[];
}

export const seedCategories: Category[] = [
  { id: 1, name: 'عطور العود', description: 'مجموعة فاخرة من عطور العود الشرقي الأصيل.' },
  { id: 2, name: 'عطور المسك', description: 'روائح المسك النقي التي تأسر الحواس.' },
  { id: 3, name: 'عطور الأزهار', description: 'باقة من أرقى العطور الزهرية للنساء.' },
  { id: 4, name: 'عطور الحمضيات', description: 'انتعاش يدوم طويلاً مع عطور الحمضيات المنعشة.' },
  { id: 5, name: 'عطور شرقية', description: 'أصالة الشرق في زجاجة عطر.' },
  { id: 6, name: 'بخور ومعطرات', description: 'أجود أنواع البخور والمعطرات للمنزل.' },
  { id: 7, name: 'عطور رجالية', description: 'عطور مصممة للرجل العصري والأنيق.' },
  { id: 8, name: 'عطور نسائية', description: 'عطور تعكس أنوثتك وجاذبيتك.' },
  { id: 9, name: 'عطور للجنسين', description: 'عطور فريدة تناسب الرجال والنساء.' },
  { id: 10, name: 'مجموعات الهدايا', description: 'مجموعات هدايا فاخرة لمناسباتكم الخاصة.' },
];

export const seedProducts: Product[] = [
  // Category: عطور العود
  {
    id: 101,
    name: 'عود كمبودي ملكي',
    brand: 'مواسم',
    description: 'خلاصة العود الكمبودي النادر، لرائحة تدوم طويلاً.',
    price: 850,
    originalPrice: 950,
    stock: 25,
    categoryName: 'عطور العود',
    rating: 4.9,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: 'تولة (12 مل)' }],
  },
  {
    id: 102,
    name: 'دهن عود تراد',
    brand: 'مواسم',
    description: 'دهن عود تراد الفاخر، يتميز برائحته القوية والعميقة.',
    price: 700,
    stock: 30,
    categoryName: 'عطور العود',
    rating: 4.8,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: 'نصف تولة (6 مل)' }],
  },
  {
    id: 103,
    name: 'عود هندي آسام',
    brand: 'مواسم',
    description: 'رائحة العود الهندي الكلاسيكية، رمز الفخامة.',
    price: 900,
    stock: 20,
    categoryName: 'عطور العود',
    rating: 4.9,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: 'ربع تولة (3 مل)' }],
  },
  {
    id: 104,
    name: 'خلطة العود الخاصة',
    brand: 'مواسم',
    description: 'مزيج فريد من أجود أنواع العود مع لمسة من الزعفران.',
    price: 650,
    originalPrice: 750,
    stock: 40,
    categoryName: 'عطور العود',
    rating: 4.7,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: '50 مل' }],
  },
  {
    id: 105,
    name: 'عود موروكي محسن',
    brand: 'مواسم',
    description: 'عود موروكي محسن بجودة عالية ورائحة ثابتة.',
    price: 450,
    stock: 50,
    categoryName: 'عطور العود',
    rating: 4.6,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الوزن', value: 'أوقية (28 جرام)' }],
  },
  {
    id: 106,
    name: 'عود فيتنامي طبيعي',
    brand: 'مواسم',
    description: 'رائحة سويتية خفيفة من قلب غابات فيتنام.',
    price: 1200,
    stock: 15,
    categoryName: 'عطور العود',
    rating: 5.0,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الوزن', value: 'أوقية (28 جرام)' }],
  },
  {
    id: 107,
    name: 'دهن عود براشين',
    brand: 'مواسم',
    description: 'دهن عود براشين الأصلي، رائحة سويتية بخورية.',
    price: 750,
    stock: 25,
    categoryName: 'عطور العود',
    rating: 4.8,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: 'نصف تولة (6 مل)' }],
  },
  {
    id: 108,
    name: 'عود كلمنتان مالينو',
    brand: 'مواسم',
    description: 'عود كلمنتان فاخر من منطقة مالينو، رائحة غنية وثبات عالي.',
    price: 1100,
    originalPrice: 1250,
    stock: 18,
    categoryName: 'عطور العود',
    rating: 4.9,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الوزن', value: 'أوقية (28 جرام)' }],
  },
  {
    id: 109,
    name: 'دهن عود سيوفي',
    brand: 'مواسم',
    description: 'دهن عود سيوفي معتق، رائحة كلاسيكية أصيلة.',
    price: 950,
    stock: 22,
    categoryName: 'عطور العود',
    rating: 4.7,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: 'ربع تولة (3 مل)' }],
  },
  {
    id: 110,
    name: 'عود أرياني سوبر',
    brand: 'مواسم',
    description: 'كسرات عود أرياني درجة سوبر، مثالية للمناسبات.',
    price: 1300,
    stock: 12,
    categoryName: 'عطور العود',
    rating: 5.0,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الوزن', value: 'أوقية (28 جرام)' }],
  },

  // Category: عطور المسك
  {
    id: 201,
    name: 'مسك الطهارة الأبيض',
    brand: 'مواسم',
    description: 'مسك أبيض نقي برائحة النظافة والانتعاش.',
    price: 150,
    stock: 100,
    categoryName: 'عطور المسك',
    rating: 4.9,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: 'تولة (12 مل)' }],
  },
  {
    id: 202,
    name: 'مسك الرمان',
    brand: 'مواسم',
    description: 'مزيج رائع من المسك الصافي ونكهة الرمان الحلوة.',
    price: 180,
    originalPrice: 220,
    stock: 80,
    categoryName: 'عطور المسك',
    rating: 4.8,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: '50 مل' }],
  },
  {
    id: 203,
    name: 'مسك الفانيلا',
    brand: 'مواسم',
    description: 'دفء الفانيلا مع نعومة المسك لرائحة جذابة.',
    price: 170,
    stock: 70,
    categoryName: 'عطور المسك',
    rating: 4.7,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: '50 مل' }],
  },
  {
    id: 204,
    name: 'مسك البودر',
    brand: 'مواسم',
    description: 'رائحة البودر الكلاسيكية مع لمسة من المسك الفاخر.',
    price: 160,
    stock: 90,
    categoryName: 'عطور المسك',
    rating: 4.8,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: 'تولة (12 مل)' }],
  },
  {
    id: 205,
    name: 'مسك متسلق',
    brand: 'مواسم',
    description: 'مسك برائحة الأزهار البيضاء، منعش ويدوم طويلاً.',
    price: 190,
    stock: 60,
    categoryName: 'عطور المسك',
    rating: 4.9,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: '50 مل' }],
  },
  {
    id: 206,
    name: 'المسك الأسود',
    brand: 'مواسم',
    description: 'رائحة المسك الأسود القوية والغامضة.',
    price: 250,
    stock: 40,
    categoryName: 'عطور المسك',
    rating: 4.6,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: 'ربع تولة (3 مل)' }],
  },
  {
    id: 207,
    name: 'مسك العروس',
    brand: 'مواسم',
    description: 'خلطة خاصة من المسك والزهور البيضاء، مثالي للعروس.',
    price: 220,
    originalPrice: 250,
    stock: 50,
    categoryName: 'عطور المسك',
    rating: 4.9,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: 'تولة (12 مل)' }],
  },
  {
    id: 208,
    name: 'مسك الكرز',
    brand: 'مواسم',
    description: 'حلاوة الكرز مع نقاء المسك، لرائحة مبهجة.',
    price: 180,
    stock: 75,
    categoryName: 'عطور المسك',
    rating: 4.8,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: '50 مل' }],
  },
  {
    id: 209,
    name: 'مسك التوت',
    brand: 'مواسم',
    description: 'انتعاش التوت البري ممزوج بنعومة المسك الأبيض.',
    price: 185,
    stock: 85,
    categoryName: 'عطور المسك',
    rating: 4.8,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: '50 مل' }],
  },
  {
    id: 210,
    name: 'مسك الخوخ',
    brand: 'مواسم',
    description: 'رائحة الخوخ الصيفية مع قاعدة من المسك الناعم.',
    price: 175,
    stock: 65,
    categoryName: 'عطور المسك',
    rating: 4.7,
    mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg',
    specifications: [{ name: 'الحجم', value: '50 مل' }],
  },

  // Category: عطور الأزهار
  {
    id: 301, name: 'عطر الياسمين', brand: 'مواسم', description: 'رائحة الياسمين النقي، عطر الأنوثة والرقة.', price: 320, stock: 60, categoryName: 'عطور الأزهار', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 302, name: 'عطر الورد الطائفي', brand: 'مواسم', description: 'قطرات من الندى على بتلات الورد الطائفي.', price: 450, stock: 40, categoryName: 'عطور الأزهار', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '50 مل' }]
  },
  {
    id: 303, name: 'عطر زهرة البرتقال', brand: 'مواسم', description: 'انتعاش زهرة البرتقال في يوم ربيعي مشمس.', price: 280, stock: 70, categoryName: 'عطور الأزهار', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '75 مل' }]
  },
  {
    id: 304, name: 'عطر الليلك', brand: 'مواسم', description: 'رائحة الليلك الهادئة التي تأخذك إلى عالم آخر.', price: 300, stock: 55, categoryName: 'عطور الأزهار', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 305, name: 'عطر الفاوانيا', brand: 'مواسم', description: 'عطر الفاوانيا الوردي، رمز الجمال والرومانسية.', price: 350, originalPrice: 400, stock: 50, categoryName: 'عطور الأزهار', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '90 مل' }]
  },
  {
    id: 306, name: 'عطر الجاردينيا', brand: 'مواسم', description: 'رائحة الجاردينيا البيضاء الكريمية، عطر فاخر.', price: 380, stock: 45, categoryName: 'عطور الأزهار', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '80 مل' }]
  },
  {
    id: 307, name: 'عطر مسك الروم', brand: 'مواسم', description: 'عطر مسك الروم الجذاب والمثير.', price: 420, stock: 35, categoryName: 'عطور الأزهار', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '75 مل' }]
  },
  {
    id: 308, name: 'عطر زنبق الوادي', brand: 'مواسم', description: 'رائحة زنبق الوادي المنعشة والنقية.', price: 290, stock: 65, categoryName: 'عطور الأزهار', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 309, name: 'عطر السوسن', brand: 'مواسم', description: 'رائحة السوسن البودرية الأنيقة.', price: 400, stock: 50, categoryName: 'عطور الأزهار', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '60 مل' }]
  },
  {
    id: 310, name: 'باقة الزهور البيضاء', brand: 'مواسم', description: 'مزيج من الياسمين والجاردينيا وزهرة البرتقال.', price: 360, stock: 55, categoryName: 'عطور الأزهار', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '85 مل' }]
  },

  // Category: عطور الحمضيات
  {
    id: 401, name: 'عطر الليمون والنعناع', brand: 'مواسم', description: 'انتعاش لا يقاوم من الليمون والنعناع.', price: 250, stock: 80, categoryName: 'عطور الحمضيات', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '120 مل' }]
  },
  {
    id: 402, name: 'عطر البرغموت', brand: 'مواسم', description: 'رائحة البرغموت الإيطالي المنعشة.', price: 270, stock: 70, categoryName: 'عطور الحمضيات', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 403, name: 'عطر الجريب فروت', brand: 'مواسم', description: 'عطر حيوي ومشرق برائحة الجريب فروت.', price: 260, stock: 75, categoryName: 'عطور الحمضيات', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '90 مل' }]
  },
  {
    id: 404, name: 'عطر نسيم البحر', brand: 'مواسم', description: 'مزيج من الحمضيات والروائح البحرية المنعشة.', price: 290, originalPrice: 320, stock: 65, categoryName: 'عطور الحمضيات', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 405, name: 'عطر الماندرين', brand: 'مواسم', description: 'رائحة الماندرين الحلوة والمشرقة.', price: 255, stock: 85, categoryName: 'عطور الحمضيات', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '80 مل' }]
  },
  {
    id: 406, name: 'عطر الشاي الأخضر', brand: 'مواسم', description: 'مزيج من الحمضيات والشاي الأخضر المهدئ.', price: 280, stock: 70, categoryName: 'عطور الحمضيات', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 407, name: 'عطر الفيتيفر والحمضيات', brand: 'مواسم', description: 'مزيج خشبي منعش من الفيتيفر والحمضيات.', price: 310, stock: 60, categoryName: 'عطور الحمضيات', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '90 مل' }]
  },
  {
    id: 408, name: 'عطر زنجبيل وليمون', brand: 'مواسم', description: 'رائحة حارة ومنعشة من الزنجبيل والليمون.', price: 275, stock: 65, categoryName: 'عطور الحمضيات', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '75 مل' }]
  },
  {
    id: 409, name: 'عطر يوزو', brand: 'مواسم', description: 'رائحة اليوزو الياباني الفريدة والمنعشة.', price: 300, stock: 55, categoryName: 'عطور الحمضيات', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 410, name: 'كوكتيل الحمضيات', brand: 'مواسم', description: 'مزيج من الليمون والبرتقال والجريب فروت.', price: 290, stock: 70, categoryName: 'عطور الحمضيات', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },

  // Category: عطور شرقية
  {
    id: 501, name: 'عطر العنبر', brand: 'مواسم', description: 'دفء العنبر مع لمسة من التوابل الشرقية.', price: 400, stock: 50, categoryName: 'عطور شرقية', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 502, name: 'عطر الزعفران والعود', brand: 'مواسم', description: 'مزيج ملكي من الزعفران والعود الفاخر.', price: 550, originalPrice: 600, stock: 35, categoryName: 'عطور شرقية', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '80 مل' }]
  },
  {
    id: 503, name: 'عطر الصندل', brand: 'مواسم', description: 'رائحة خشب الصندل الدافئة والكريمية.', price: 350, stock: 60, categoryName: 'عطور شرقية', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '90 مل' }]
  },
  {
    id: 504, name: 'عطر الباتشولي', brand: 'مواسم', description: 'رائحة الباتشولي الترابية والغامضة.', price: 320, stock: 55, categoryName: 'عطور شرقية', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 505, name: 'عطر لبان عماني', brand: 'مواسم', description: 'رائحة اللبان العماني الأصيلة والمقدسة.', price: 450, stock: 40, categoryName: 'عطور شرقية', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '50 مل' }]
  },
  {
    id: 506, name: 'عطر التوابل العربية', brand: 'مواسم', description: 'مزيج من القرفة والهيل والقرنفل.', price: 380, stock: 45, categoryName: 'عطور شرقية', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '75 مل' }]
  },
  {
    id: 507, name: 'عطر الجلد الفاخر', brand: 'مواسم', description: 'رائحة الجلد الفاخر مع لمسة من الدخان.', price: 480, stock: 30, categoryName: 'عطور شرقية', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '80 مل' }]
  },
  {
    id: 508, name: 'ألف ليلة وليلة', brand: 'مواسم', description: 'عطر ساحر يأخذك في رحلة إلى قصص الشرق.', price: 500, stock: 35, categoryName: 'عطور شرقية', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 509, name: 'عطر المر', brand: 'مواسم', description: 'رائحة المر الصمغية الدافئة والبلسمية.', price: 360, stock: 50, categoryName: 'عطور شرقية', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '60 مل' }]
  },
  {
    id: 510, name: 'خلطة شرقية خاصة', brand: 'مواسم', description: 'مزيج سري من المكونات الشرقية الفاخرة.', price: 600, stock: 25, categoryName: 'عطور شرقية', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '75 مل' }]
  },

  // Category: بخور ومعطرات
  {
    id: 601, name: 'بخور معمول ملكي', brand: 'مواسم', description: 'معمول فاخر برائحة العود والعنبر.', price: 200, stock: 100, categoryName: 'بخور ومعطرات', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الوزن', value: '150 جرام' }]
  },
  {
    id: 602, name: 'بخور دوسري', brand: 'مواسم', description: 'بخور دوسري أصيل على أصوله.', price: 250, stock: 80, categoryName: 'بخور ومعطرات', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الوزن', value: '200 جرام' }]
  },
  {
    id: 603, name: 'معطر مفارش برائحة اللافندر', brand: 'مواسم', description: 'معطر مفارش يساعد على الاسترخاء والنوم.', price: 80, stock: 150, categoryName: 'بخور ومعطرات', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '500 مل' }]
  },
  {
    id: 604, name: 'معطر جو برائحة العود', brand: 'مواسم', description: 'معطر جو يملأ المكان برائحة العود الفاخرة.', price: 120, stock: 120, categoryName: 'بخور ومعطرات', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '480 مل' }]
  },
  {
    id: 605, name: 'مبثوث خاص', brand: 'مواسم', description: 'مبثوث فاخر من دقة العود والزيوت العطرية.', price: 180, originalPrice: 220, stock: 90, categoryName: 'بخور ومعطرات', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الوزن', value: '100 جرام' }]
  },
  {
    id: 606, name: 'رقائق العود الفيتنامي', brand: 'مواسم', description: 'رقائق عود طبيعية للاستخدام اليومي.', price: 300, stock: 70, categoryName: 'بخور ومعطرات', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الوزن', value: 'أوقية (28 جرام)' }]
  },
  {
    id: 607, name: 'معطر سيارة برائحة المسك', brand: 'مواسم', description: 'معطر سيارة فواح برائحة المسك النقي.', price: 50, stock: 200, categoryName: 'بخور ومعطرات', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '10 مل' }]
  },
  {
    id: 608, name: 'بخور هرمي', brand: 'مواسم', description: 'بخور على شكل هرم، سهل الاستخدام وسريع الانتشار.', price: 150, stock: 110, categoryName: 'بخور ومعطرات', rating: 4.6, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'العدد', value: '20 قطعة' }]
  },
  {
    id: 609, name: 'فحم سريع الاشتعال', brand: 'مواسم', description: 'فحم عالي الجودة للبخور، يدوم طويلاً.', price: 25, stock: 300, categoryName: 'بخور ومعطرات', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'العدد', value: '80 قرص' }]
  },
  {
    id: 610, name: 'مبخرة كهربائية', brand: 'مواسم', description: 'مبخرة كهربائية آمنة وأنيقة.', price: 130, stock: 90, categoryName: 'بخور ومعطرات', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'اللون', value: 'ذهبي' }]
  },

  // Category: عطور رجالية
  {
    id: 701, name: 'بلو دي مواسم', brand: 'مواسم', description: 'عطر رجالي منعش يجمع بين الحمضيات والأخشاب.', price: 380, stock: 70, categoryName: 'عطور رجالية', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 702, name: 'سوفاج مواسم', brand: 'مواسم', description: 'عطر رجالي جريء برائحة البرغموت والفلفل.', price: 420, originalPrice: 480, stock: 60, categoryName: 'عطور رجالية', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 703, name: 'أكوا دي مواسم', brand: 'مواسم', description: 'عطر رجالي مستوحى من نسيم البحر الأبيض المتوسط.', price: 350, stock: 80, categoryName: 'عطور رجالية', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '125 مل' }]
  },
  {
    id: 704, name: 'ليجند مواسم', brand: 'مواسم', description: 'عطر رجالي أنيق برائحة التفاح والخزامى.', price: 320, stock: 90, categoryName: 'عطور رجالية', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 705, name: 'إنفيكتوس مواسم', brand: 'مواسم', description: 'عطر النصر للرجل الرياضي.', price: 390, stock: 65, categoryName: 'عطور رجالية', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 706, name: 'ذا ون مواسم', brand: 'مواسم', description: 'عطر رجالي كلاسيكي برائحة التبغ والعنبر.', price: 450, stock: 55, categoryName: 'عطور رجالية', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '90 مل' }]
  },
  {
    id: 707, name: 'مواسم إيروس', brand: 'مواسم', description: 'عطر الحب والعاطفة للرجل الجذاب.', price: 410, stock: 60, categoryName: 'عطور رجالية', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 708, name: 'مواسم سبايس بومب', brand: 'مواسم', description: 'انفجار من التوابل للرجل الجريء.', price: 480, stock: 50, categoryName: 'عطور رجالية', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '90 مل' }]
  },
  {
    id: 709, name: 'مواسم أفينتوس', brand: 'مواسم', description: 'عطر القادة والناجحين.', price: 600, originalPrice: 700, stock: 40, categoryName: 'عطور رجالية', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 710, name: 'مواسم وود', brand: 'مواسم', description: 'عطر خشبي دافئ للرجل الهادئ.', price: 360, stock: 75, categoryName: 'عطور رجالية', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },

  // Category: عطور نسائية
  {
    id: 801, name: 'لا في بيل مواسم', brand: 'مواسم', description: 'عطر "الحياة جميلة" للمرأة المتفائلة.', price: 450, stock: 60, categoryName: 'عطور نسائية', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '75 مل' }]
  },
  {
    id: 802, name: 'بلاك أوبيوم مواسم', brand: 'مواسم', description: 'عطر المرأة الغامضة والجذابة.', price: 480, stock: 50, categoryName: 'عطور نسائية', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '90 مل' }]
  },
  {
    id: 803, name: 'سي مواسم', brand: 'مواسم', description: 'عطر المرأة القوية والمستقلة.', price: 430, stock: 65, categoryName: 'عطور نسائية', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 804, name: 'كوكو مدموزيل مواسم', brand: 'مواسم', description: 'عطر الأناقة الفرنسية للمرأة العصرية.', price: 550, originalPrice: 600, stock: 45, categoryName: 'عطور نسائية', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 805, name: 'برايت كريستال مواسم', brand: 'مواسم', description: 'عطر زهري فاكهي للمرأة الرومانسية.', price: 380, stock: 70, categoryName: 'عطور نسائية', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '90 مل' }]
  },
  {
    id: 806, name: 'جود جيرل مواسم', brand: 'مواسم', description: 'عطر المرأة الجريئة التي تجمع بين النور والظلام.', price: 490, stock: 55, categoryName: 'عطور نسائية', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '80 مل' }]
  },
  {
    id: 807, name: 'ألين مواسم', brand: 'مواسم', description: 'عطر غامض وساحر برائحة الياسمين والعنبر.', price: 520, stock: 50, categoryName: 'عطور نسائية', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '90 مل' }]
  },
  {
    id: 808, name: 'أيدول مواسم', brand: 'مواسم', description: 'عطر المستقبل للمرأة القائدة.', price: 460, stock: 60, categoryName: 'عطور نسائية', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '75 مل' }]
  },
  {
    id: 809, name: 'ليبر مواسم', brand: 'مواسم', description: 'عطر الحرية للمرأة التي لا تخشى كسر القواعد.', price: 500, stock: 55, categoryName: 'عطور نسائية', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '90 مل' }]
  },
  {
    id: 810, name: 'ميس مواسم', brand: 'مواسم', description: 'باقة من الزهور للمرأة الشابة والمحبة للحياة.', price: 400, stock: 75, categoryName: 'عطور نسائية', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },

  // Category: عطور للجنسين
  {
    id: 901, name: 'بلاك أفغانو مواسم', brand: 'مواسم', description: 'عطر للجنسين قوي وغامض برائحة القنب والعود.', price: 700, stock: 30, categoryName: 'عطور للجنسين', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '30 مل' }]
  },
  {
    id: 902, name: 'باكارات روج 540 مواسم', brand: 'مواسم', description: 'عطر للجنسين ساحر برائحة الزعفران والياسمين.', price: 1200, stock: 20, categoryName: 'عطور للجنسين', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '70 مل' }]
  },
  {
    id: 903, name: 'توسكان ليذر مواسم', brand: 'مواسم', description: 'عطر للجنسين برائحة الجلد والتوت والزعفران.', price: 800, stock: 25, categoryName: 'عطور للجنسين', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '50 مل' }]
  },
  {
    id: 904, name: 'عود وود مواسم', brand: 'مواسم', description: 'مزيج فاخر من العود وخشب الورد للرجال والنساء.', price: 950, stock: 30, categoryName: 'عطور للجنسين', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '50 مل' }]
  },
  {
    id: 905, name: ' سانتال 33 مواسم', brand: 'مواسم', description: 'عطر للجنسين برائحة خشب الصندل والهيل.', price: 850, stock: 35, categoryName: 'عطور للجنسين', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 906, name: 'جيبسي ووتر مواسم', brand: 'مواسم', description: 'عطر للجنسين منعش برائحة البرغموت وأخشاب الصنوبر.', price: 750, stock: 40, categoryName: 'عطور للجنسين', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 907, name: 'ميتاليك مواسم', brand: 'مواسم', description: 'عطر للجنسين فريد برائحة الألدهيدات والفانيلا.', price: 900, stock: 28, categoryName: 'عطور للجنسين', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 908, name: 'روز 31 مواسم', brand: 'مواسم', description: 'عطر للجنسين يجمع بين الورد والتوابل والأخشاب.', price: 880, stock: 32, categoryName: 'عطور للجنسين', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 909, name: 'موليكيول 01 مواسم', brand: 'مواسم', description: 'عطر غامض يتفاعل مع كيمياء الجسم.', price: 650, stock: 50, categoryName: 'عطور للجنسين', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },
  {
    id: 910, name: 'أمبريال فالي مواسم', brand: 'مواسم', description: 'عطر للجنسين فاخر برائحة العنبر والعود والجلود.', price: 1100, stock: 22, categoryName: 'عطور للجنسين', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '100 مل' }]
  },

  // Category: مجموعات الهدايا
  {
    id: 1001, name: 'مجموعة العود الملكية', brand: 'مواسم', description: 'دهن عود كمبودي، بخور معمول، ومبخرة فاخرة.', price: 1200, stock: 20, categoryName: 'مجموعات الهدايا', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'المحتويات', value: '3 قطع' }]
  },
  {
    id: 1002, name: 'مجموعة المسك المتكاملة', brand: 'مواسم', description: 'مسك الطهارة، مسك الرمان، ومسك البودر.', price: 450, originalPrice: 500, stock: 30, categoryName: 'مجموعات الهدايا', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'المحتويات', value: '3 قطع' }]
  },
  {
    id: 1003, name: 'هدية لها', brand: 'مواسم', description: 'عطر لا في بيل، لوشن جسم، وشمعة عطرية.', price: 650, stock: 25, categoryName: 'مجموعات الهدايا', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'المحتويات', value: '3 قطع' }]
  },
  {
    id: 1004, name: 'هدية له', brand: 'مواسم', description: 'عطر بلو دي مواسم، زيت لحية، وبلسم بعد الحلاقة.', price: 600, stock: 28, categoryName: 'مجموعات الهدايا', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'المحتويات', value: '3 قطع' }]
  },
  {
    id: 1005, name: 'مجموعة تعطير المنزل', brand: 'مواسم', description: 'بخور، معطر مفارش، ومعطر جو.', price: 350, stock: 40, categoryName: 'مجموعات الهدايا', rating: 4.7, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'المحتويات', value: '3 قطع' }]
  },
  {
    id: 1006, name: 'صندوق كنوز الشرق', brand: 'مواسم', description: 'مجموعة مختارة من العطور الشرقية والعود.', price: 900, stock: 15, categoryName: 'مجموعات الهدايا', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'المحتويات', value: '4 قطع' }]
  },
  {
    id: 1007, name: 'مجموعة الانتعاش اليومي', brand: 'مواسم', description: 'عطر حمضيات، جل استحمام، ولوشن جسم.', price: 400, stock: 35, categoryName: 'مجموعات الهدايا', rating: 4.8, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'المحتويات', value: '3 قطع' }]
  },
  {
    id: 1008, name: 'باقة ورد وعطر', brand: 'مواسم', description: 'عطر الورد الطائفي مع باقة ورد طبيعي مجفف.', price: 550, stock: 22, categoryName: 'مجموعات الهدايا', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'المحتويات', value: 'قطعتان' }]
  },
  {
    id: 1009, name: 'مجموعة تجريبية', brand: 'مواسم', description: 'عينات من 5 عطور من الأكثر مبيعاً.', price: 250, stock: 50, categoryName: 'مجموعات الهدايا', rating: 4.9, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'الحجم', value: '5 × 2 مل' }]
  },
  {
    id: 1010, name: 'هدية العيد', brand: 'مواسم', description: 'مجموعة فاخرة خاصة بمناسبة العيد.', price: 750, originalPrice: 850, stock: 30, categoryName: 'مجموعات الهدايا', rating: 5.0, mainImage: 'https://cdn.salla.sa/ajTYd/yQk3nZ2qPE91S96Ykfej2bT19wS2YVz3nFjXf23d.jpg', specifications: [{ name: 'المحتويات', value: '4 قطع' }]
  },
];

export default { seedCategories, seedProducts }; 