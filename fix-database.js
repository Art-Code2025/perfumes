import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAr-8KXPyqsqcwiDSiIbyn6alhFcQCN4gU",
  authDomain: "perfum-ac.firebaseapp.com",
  projectId: "perfum-ac",
  storageBucket: "perfum-ac.firebasestorage.app",
  messagingSenderId: "429622096271",
  appId: "1:429622096271:web:88876e9ae849344a5d1bfa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixDatabase() {
  console.log('🔧 Fixing database...');
  
  try {
    // Get all products
    const productsCollection = collection(db, 'products');
    const snapshot = await getDocs(productsCollection);
    
    console.log(`Found ${snapshot.size} products in database`);
    
    // Delete all existing products
    const deletePromises = [];
    snapshot.forEach((doc) => {
      console.log('Deleting product:', doc.id, doc.data().name);
      deletePromises.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(deletePromises);
    console.log('✅ All old products deleted');
    
    // Add sample products
    const sampleProducts = [
      {
        name: "عطر الورد الفاخر",
        description: "عطر فاخر برائحة الورد الطبيعي",
        price: 150,
        originalPrice: 200,
        stock: 50,
        categoryId: "perfumes",
        productType: "عطر",
        mainImage: "https://via.placeholder.com/400x400?text=عطر+الورد",
        specifications: [
          { name: "الحجم", value: "100 مل" },
          { name: "النوع", value: "عطر نسائي" }
        ],
        dynamicOptions: [
          {
            optionName: "size",
            optionType: "select",
            required: true,
            options: [
              { value: "50ml" },
              { value: "100ml" },
              { value: "200ml" }
            ]
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: "عطر العود الملكي",
        description: "عطر العود الأصلي من أجود الأنواع",
        price: 300,
        originalPrice: 350,
        stock: 30,
        categoryId: "perfumes",
        productType: "عطر",
        mainImage: "https://via.placeholder.com/400x400?text=عطر+العود",
        specifications: [
          { name: "الحجم", value: "50 مل" },
          { name: "النوع", value: "عطر رجالي" }
        ],
        dynamicOptions: [
          {
            optionName: "size",
            optionType: "select",
            required: true,
            options: [
              { value: "30ml" },
              { value: "50ml" },
              { value: "100ml" }
            ]
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: "مجموعة العطور المميزة",
        description: "مجموعة من أفضل العطور في علبة أنيقة",
        price: 500,
        originalPrice: 600,
        stock: 20,
        categoryId: "sets",
        productType: "مجموعة",
        mainImage: "https://via.placeholder.com/400x400?text=مجموعة+العطور",
        specifications: [
          { name: "عدد القطع", value: "3 قطع" },
          { name: "النوع", value: "مجموعة مختلطة" }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Add new products
    const addPromises = sampleProducts.map(product => 
      addDoc(productsCollection, product)
    );
    
    const results = await Promise.all(addPromises);
    
    console.log('✅ Added new products:');
    results.forEach((docRef, index) => {
      console.log(`- ${sampleProducts[index].name} (ID: ${docRef.id})`);
    });
    
    console.log('🎉 Database fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
  }
}

fixDatabase().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
}); 