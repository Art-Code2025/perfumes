# مواسم - متجر مستلزمات التخرج والمدرسة

## 🎓 حول المشروع
مواسم هو متجر إلكتروني متخصص في بيع مستلزمات التخرج والمدرسة، مع نظام إدارة متكامل للمنتجات والطلبات والعملاء.

## ✨ المميزات
- 🛍️ **متجر إلكتروني كامل** مع سلة شراء وخاصية المفضلة
- 📱 **تصميم متجاوب** يعمل على جميع الأجهزة
- 🎯 **باللغة العربية** بدعم كامل للنصوص والاتجاه
- 🛡️ **لوحة تحكم الأدمن** لإدارة المتجر
- 📊 **إحصائيات مفصلة** للمبيعات والعملاء
- 💳 **نظام كوبونات الخصم** المتقدم
- 🔐 **نظام مصادقة آمن** للمستخدمين

## 🛠️ التقنيات المستخدمة

### Frontend:
- **React** مع TypeScript
- **Tailwind CSS** للتنسيق
- **Lucide React** للأيقونات
- **React Router** للتنقل

### Backend:
- **Netlify Functions** (Serverless)
- **Firebase Firestore** لقاعدة البيانات
- **Node.js** للخادم

## 🚀 التثبيت والتشغيل

### 1. استنساخ المشروع
```bash
git clone [repository-url]
cd mawasiem-store
```

### 2. تثبيت الحزم
```bash
# تثبيت حزم المشروع الرئيسي
npm install

# تثبيت حزم الفرونت إند
cd frontend
npm install
cd ..
```

### 3. إعداد Firebase
اتبع التعليمات في ملف [FIREBASE_SETUP.md](FIREBASE_SETUP.md) لإعداد قاعدة البيانات.

### 4. تشغيل المشروع محلياً
```bash
# تشغيل الفرونت إند
npm run dev

# أو تشغيل كامل مع Netlify Functions
npm run start
```

### 5. بناء المشروع للإنتاج
```bash
npm run build
```

## 🔧 الإعداد والتكوين

### متغيرات البيئة
أنشئ ملف `.env` في مجلد `frontend` وأضف:
```
VITE_API_BASE_URL=https://your-netlify-url.netlify.app/.netlify/functions
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
```

### بيانات الدخول الافتراضية
- **لوحة تحكم الأدمن**: `/admin`
  - اسم المستخدم: `admin`
  - كلمة المرور: `123123`

## 📁 هيكل المشروع
```
├── frontend/                  # تطبيق React
│   ├── src/
│   │   ├── components/       # مكونات React
│   │   ├── config/          # إعدادات Firebase
│   │   ├── utils/           # أدوات مساعدة
│   │   └── ...
│   └── ...
├── netlify/
│   └── functions/           # وظائف Netlify Serverless
│       ├── products.js      # إدارة المنتجات
│       ├── orders.js        # إدارة الطلبات
│       ├── customers.js     # إدارة العملاء
│       ├── categories.js    # إدارة التصنيفات
│       ├── coupons.js       # إدارة الكوبونات
│       ├── dashboard.js     # إحصائيات الداشبورد
│       ├── auth.js          # المصادقة
│       └── config/
│           └── firebase.js  # إعدادات Firebase
├── init-firebase.js         # سكريبت تهيئة البيانات
├── FIREBASE_SETUP.md        # دليل إعداد Firebase
└── README.md               # هذا الملف
```

## 🎯 API Endpoints

### Products API
- `GET /products` - جلب جميع المنتجات
- `GET /products/{id}` - جلب منتج واحد
- `POST /products` - إضافة منتج جديد
- `PUT /products/{id}` - تحديث منتج
- `DELETE /products/{id}` - حذف منتج

### Orders API
- `GET /orders` - جلب جميع الطلبات
- `GET /orders/{id}` - جلب طلب واحد
- `POST /orders` - إنشاء طلب جديد
- `PUT /orders/{id}` - تحديث حالة الطلب
- `DELETE /orders/{id}` - حذف طلب

### Categories API
- `GET /categories` - جلب جميع التصنيفات
- `POST /categories` - إضافة تصنيف جديد
- `PUT /categories/{id}` - تحديث تصنيف
- `DELETE /categories/{id}` - حذف تصنيف

### Customers API
- `GET /customers` - جلب جميع العملاء
- `POST /customers` - إضافة عميل جديد
- `PUT /customers/{id}` - تحديث بيانات عميل
- `DELETE /customers/{id}` - حذف عميل

### Coupons API
- `GET /coupons` - جلب جميع الكوبونات
- `POST /coupons` - إنشاء كوبون جديد
- `PUT /coupons/{id}` - تحديث كوبون
- `DELETE /coupons/{id}` - حذف كوبون

### Dashboard API
- `GET /dashboard` - جلب إحصائيات الداشبورد

### Auth API
- `POST /auth/admin` - مصادقة الأدمن

## 📊 لوحة التحكم

### الميزات المتاحة:
- **📊 الداشبورد الرئيسي**: إحصائيات شاملة للمتجر
- **📦 إدارة المنتجات**: إضافة وتعديل وحذف المنتجات
- **📂 إدارة التصنيفات**: تنظيم المنتجات في تصنيفات
- **📋 إدارة الطلبات**: متابعة الطلبات وتحديث حالاتها
- **👥 إدارة العملاء**: قاعدة بيانات العملاء
- **🎫 إدارة الكوبونات**: إنشاء وإدارة رموز الخصم

### الوصول للوحة التحكم:
1. اذهب إلى `/admin`
2. استخدم بيانات الدخول الافتراضية
3. استمتع بإدارة متجرك!

## 🔄 التحديث من Mock Data إلى Firebase

**المشكلة السابقة**: كانت جميع التعديلات تضيع عند إعادة تحميل الصفحة لأن النظام كان يستخدم بيانات وهمية.

**الحل الجديد**: 
- ✅ جميع الـ Netlify Functions تدعم الآن Firebase Firestore
- ✅ جميع التعديلات تُحفظ بشكل دائم
- ✅ النظام يعود للبيانات الوهمية تلقائياً في حال فشل Firebase
- ✅ دعم كامل لجميع عمليات CRUD (إنشاء، قراءة، تحديث، حذف)

## 🚀 الرفع على Netlify

### 1. ربط المشروع بـ Git Repository
### 2. ربط Repository بـ Netlify
### 3. تحديث إعدادات Build:
- **Build Command**: `npm run build`
- **Publish Directory**: `frontend/dist`
- **Functions Directory**: `netlify/functions`

### 4. إضافة متغيرات البيئة في Netlify
### 5. إعداد Firebase حسب الدليل المرفق

## 🐛 استكشاف الأخطاء

### إذا لم تعمل Firebase:
- تحقق من إعدادات Firebase في الملفات
- تأكد من صحة Firestore Rules
- راجع logs في Netlify Functions

### إذا لم تظهر التعديلات:
- تأكد من إعداد Firebase بشكل صحيح
- تحقق من عمل API endpoints
- النظام سيعمل بالبيانات الوهمية حتى لو لم يكن Firebase معداً

## 📝 الترخيص
هذا المشروع مرخص تحت رخصة MIT - انظر ملف LICENSE للتفاصيل.

## 🤝 المساهمة
نرحب بجميع المساهمات! يرجى إنشاء Pull Request أو فتح Issue لأي اقتراحات.

---

**مطور بواسطة**: فريق مواسم  
**الإصدار**: 2.0.0  
**آخر تحديث**: ديسمبر 2024 