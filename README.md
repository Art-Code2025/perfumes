# متجر مواسم الإلكتروني - GHEM Store

متجر إلكتروني متخصص في أوشحة وعبايات التخرج والمرايل المدرسية.

## التقنيات المستخدمة

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite

### Backend
- Netlify Functions (Serverless)
- Firebase Firestore
- Cloudinary (لرفع الصور)

## الميزات

- 🛍️ عرض المنتجات والتصنيفات
- 🛒 نظام سلة التسوق
- 👤 لوحة تحكم الإدمن
- 📱 تصميم متجاوب
- 🔐 نظام المصادقة
- 📦 إدارة الطلبات
- 💰 نظام الكوبونات

## التشغيل المحلي

### متطلبات التشغيل
- Node.js 18+
- npm

### خطوات التشغيل

1. **تثبيت المكتبات:**
```bash
npm install
cd frontend && npm install
```

2. **إعداد متغيرات البيئة:**
إنشاء ملف `.env` في المجلد الرئيسي:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

3. **تشغيل المشروع:**
```bash
npm run dev
```

## Deploy على Netlify

1. ربط المشروع بـ GitHub
2. ربط GitHub Repository بـ Netlify
3. إعداد Build Settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
   - Functions directory: `netlify/functions`

## بيانات الدخول

### الإدمن
- اسم المستخدم: `admin`
- كلمة المرور: `123123`

## الهيكل

```
├── frontend/          # React Frontend
├── netlify/
│   └── functions/     # Serverless Functions
├── netlify.toml       # إعدادات Netlify
├── package.json       # Dependencies الرئيسية
└── README.md
```

## المساهمة

هذا مشروع خاص بمتجر مواسم الإلكتروني.

## الدعم

للدعم والاستفسارات، يرجى التواصل مع فريق التطوير. 