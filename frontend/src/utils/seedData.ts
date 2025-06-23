// Seed data for perfume products and categories

export interface Category {
  name: string;
  description: string;
  image: string;
}

export interface Product {
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryName: string;
  rating: number;
  mainImage: string;
  specifications?: { name: string; value: string }[];
}

export const perfumeCategories: Category[] = [
  {
    name: "عطور رجالية فاخرة",
    description: "مجموعة متميزة من العطور الرجالية الفاخرة بنفحات قوية وثابتة",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop"
  },
  {
    name: "عطور نسائية راقية", 
    description: "عطور نسائية أنيقة بروائح زهرية وفاكهية ساحرة",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop"
  },
  {
    name: "عطور مشتركة",
    description: "عطور للجنسين بتركيبات متوازنة ومناسبة للجميع",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop"
  },
  {
    name: "عطور شرقية",
    description: "عطور بنفحات شرقية أصيلة من العود والمسك والعنبر",
    image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop"
  },
  {
    name: "عطور صيفية",
    description: "عطور منعشة مناسبة للأجواء الحارة والصيف",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
  },
  {
    name: "عطور شتوية",
    description: "عطور دافئة وثقيلة مناسبة للطقس البارد",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop"
  },
  {
    name: "عطور مناسبات",
    description: "عطور خاصة للمناسبات والسهرات والأفراح",
    image: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=400&h=400&fit=crop"
  },
  {
    name: "عطور يومية",
    description: "عطور خفيفة مناسبة للاستخدام اليومي والعمل",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop"
  }
];

export const perfumeProducts: Product[] = [
  // عطور رجالية فاخرة
  {
    name: "Tom Ford Oud Wood",
    brand: "Tom Ford",
    description: "عطر رجالي فاخر بنفحات العود الطبيعي والصندل الكريمي مع لمسة من الورد البلغاري",
    price: 850,
    originalPrice: 1200,
    stock: 15,
    categoryName: "عطور رجالية فاخرة",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "نوع العطر", value: "Eau de Parfum" },
      { name: "النفحات العلوية", value: "العود، الصندل" },
      { name: "النفحات الوسطى", value: "الورد البلغاري، الباليساندر" },
      { name: "النفحات السفلى", value: "الفانيليا، المسك الأبيض" }
    ]
  },
  {
    name: "Creed Aventus",
    brand: "Creed",
    description: "عطر رجالي أسطوري بنفحات الأناناس والتفاح الأسود مع البتولا المدخنة",
    price: 920,
    originalPrice: 1100,
    stock: 12,
    categoryName: "عطور رجالية فاخرة",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop",
    specifications: [
      { name: "الحجم", value: "120 مل" },
      { name: "نوع العطر", value: "Eau de Parfum" },
      { name: "النفحات العلوية", value: "الأناناس، التفاح الأسود" },
      { name: "النفحات الوسطى", value: "البتولا، الياسمين" },
      { name: "النفحات السفلى", value: "المسك، العنبر الرمادي" }
    ]
  },
  {
    name: "Maison Francis Kurkdjian Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    description: "عطر رجالي معاصر بنفحات الزعفران والياسمين مع خشب الأرز",
    price: 780,
    stock: 20,
    categoryName: "عطور رجالية فاخرة",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop",
    specifications: [
      { name: "الحجم", value: "70 مل" },
      { name: "نوع العطر", value: "Eau de Parfum" },
      { name: "النفحات العلوية", value: "الزعفران، الياسمين" },
      { name: "النفحات الوسطى", value: "Amberwood، Ambergris" },
      { name: "النفحات السفلى", value: "Cedar، Fir Resin" }
    ]
  },
  {
    name: "Bleu de Chanel",
    brand: "Chanel",
    description: "عطر رجالي عصري بنفحات الجريب فروت والنعناع مع خشب الصندل",
    price: 650,
    originalPrice: 750,
    stock: 25,
    categoryName: "عطور رجالية فاخرة",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop"
  },
  {
    name: "Dior Sauvage",
    brand: "Dior",
    description: "عطر رجالي جريء بنفحات البرغموت والفلفل مع العنبر الرمادي",
    price: 580,
    stock: 30,
    categoryName: "عطور رجالية فاخرة",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=400&h=400&fit=crop"
  },

  // عطور نسائية راقية
  {
    name: "Chanel No. 5",
    brand: "Chanel",
    description: "العطر النسائي الأيقوني بنفحات الياسمين والورد مع الفانيليا",
    price: 720,
    originalPrice: 850,
    stock: 18,
    categoryName: "عطور نسائية راقية",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "نوع العطر", value: "Eau de Parfum" },
      { name: "النفحات العلوية", value: "Aldehydes، البرغموت" },
      { name: "النفحات الوسطى", value: "الياسمين، الورد" },
      { name: "النفحات السفلى", value: "الفانيليا، المسك" }
    ]
  },
  {
    name: "Viktor & Rolf Flowerbomb",
    brand: "Viktor & Rolf",
    description: "عطر نسائي زهري فاخر بنفحات الفريزيا والياسمين مع الباتشولي",
    price: 680,
    stock: 22,
    categoryName: "عطور نسائية راقية",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
  },
  {
    name: "Lancôme La Vie Est Belle",
    brand: "Lancôme",
    description: "عطر نسائي حلو بنفحات الكشمش الأسود والياسمين مع الفانيليا",
    price: 590,
    originalPrice: 680,
    stock: 28,
    categoryName: "عطور نسائية راقية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop"
  },
  {
    name: "Yves Saint Laurent Black Opium",
    brand: "Yves Saint Laurent",
    description: "عطر نسائي جريء بنفحات القهوة والفانيليا مع الياسمين الأبيض",
    price: 620,
    stock: 24,
    categoryName: "عطور نسائية راقية",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop"
  },
  {
    name: "Miss Dior",
    brand: "Dior",
    description: "عطر نسائي رومانسي بنفحات الورد الدمشقي والفلفل الوردي",
    price: 650,
    originalPrice: 750,
    stock: 20,
    categoryName: "عطور نسائية راقية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop"
  },

  // عطور مشتركة
  {
    name: "Le Labo Santal 33",
    brand: "Le Labo",
    description: "عطر مشترك عصري بنفحات خشب الصندل والهيل مع الورق",
    price: 750,
    stock: 16,
    categoryName: "عطور مشتركة",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=400&h=400&fit=crop"
  },
  {
    name: "Byredo Gypsy Water",
    brand: "Byredo",
    description: "عطر مشترك بوهيمي بنفحات الجونيبر والفانيليا مع خشب الصندل",
    price: 680,
    originalPrice: 780,
    stock: 14,
    categoryName: "عطور مشتركة",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop"
  },
  {
    name: "Hermès Terre d'Hermès",
    brand: "Hermès",
    description: "عطر مشترك ترابي بنفحات البرتقال والفلفل مع الفيتيفر",
    price: 620,
    stock: 18,
    categoryName: "عطور مشتركة",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
  },
  {
    name: "Diptyque Philosykos",
    brand: "Diptyque",
    description: "عطر مشترك أخضر بنفحات أوراق التين والحليب مع الخشب",
    price: 580,
    stock: 22,
    categoryName: "عطور مشتركة",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop"
  },
  {
    name: "Maison Margiela REPLICA Beach Walk",
    brand: "Maison Margiela",
    description: "عطر مشترك صيفي بنفحات جوز الهند والياسمين مع المسك",
    price: 540,
    originalPrice: 620,
    stock: 26,
    categoryName: "عطور مشتركة",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop"
  },

  // عطور شرقية
  {
    name: "Amouage Jubilation XXV",
    brand: "Amouage",
    description: "عطر شرقي فاخر بنفحات اللبان والورد مع العود والعنبر",
    price: 950,
    stock: 10,
    categoryName: "عطور شرقية",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop"
  },
  {
    name: "Nasomatto Black Afgano",
    brand: "Nasomatto",
    description: "عطر شرقي قوي بنفحات الحشيش والعود مع المسك الأخضر",
    price: 820,
    originalPrice: 950,
    stock: 8,
    categoryName: "عطور شرقية",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=400&h=400&fit=crop"
  },
  {
    name: "Montale Black Aoud",
    brand: "Montale",
    description: "عطر شرقي عميق بنفحات العود الأسود والورد مع الباتشولي",
    price: 480,
    stock: 15,
    categoryName: "عطور شرقية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop"
  },
  {
    name: "Ajmal Dahn Al Oudh Moattaq",
    brand: "Ajmal",
    description: "عطر شرقي تقليدي بنفحات العود الكمبودي والورد الطائفي",
    price: 380,
    originalPrice: 450,
    stock: 20,
    categoryName: "عطور شرقية",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
  },
  {
    name: "Arabian Oud Kalemat",
    brand: "Arabian Oud",
    description: "عطر شرقي راقي بنفحات الزعفران والعود مع ماء الورد",
    price: 420,
    stock: 18,
    categoryName: "عطور شرقية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop"
  },

  // عطور صيفية
  {
    name: "Acqua di Parma Colonia",
    brand: "Acqua di Parma",
    description: "عطر صيفي منعش بنفحات الليمون والبرغموت مع اللافندر",
    price: 520,
    stock: 25,
    categoryName: "عطور صيفية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop"
  },
  {
    name: "Dolce & Gabbana Light Blue",
    brand: "Dolce & Gabbana",
    description: "عطر صيفي خفيف بنفحات التفاح والياسمين مع المسك الأبيض",
    price: 450,
    originalPrice: 520,
    stock: 30,
    categoryName: "عطور صيفية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop"
  },
  {
    name: "Versace Eros",
    brand: "Versace",
    description: "عطر صيفي جذاب بنفحات النعناع والتفاح الأخضر مع الفانيليا",
    price: 480,
    stock: 28,
    categoryName: "عطور صيفية",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop"
  },
  {
    name: "Calvin Klein CK One",
    brand: "Calvin Klein",
    description: "عطر صيفي كلاسيكي بنفحات الليمون والياسمين مع المسك",
    price: 320,
    stock: 35,
    categoryName: "عطور صيفية",
    rating: 3,
    mainImage: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=400&h=400&fit=crop"
  },
  {
    name: "Issey Miyake L'Eau d'Issey",
    brand: "Issey Miyake",
    description: "عطر صيفي مائي بنفحات اللوتس والفريزيا مع خشب الأرز",
    price: 420,
    originalPrice: 480,
    stock: 24,
    categoryName: "عطور صيفية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop"
  },

  // عطور شتوية
  {
    name: "Thierry Mugler Angel",
    brand: "Thierry Mugler",
    description: "عطر شتوي قوي بنفحات الباتشولي والفانيليا مع الشوكولاتة",
    price: 580,
    stock: 20,
    categoryName: "عطور شتوية",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
  },
  {
    name: "Yves Saint Laurent Opium",
    brand: "Yves Saint Laurent",
    description: "عطر شتوي كلاسيكي بنفحات القرفة والقرنفل مع العنبر",
    price: 620,
    originalPrice: 720,
    stock: 16,
    categoryName: "عطور شتوية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop"
  },
  {
    name: "Guerlain Shalimar",
    brand: "Guerlain",
    description: "عطر شتوي تراثي بنفحات البرغموت والياسمين مع الفانيليا",
    price: 680,
    stock: 14,
    categoryName: "عطور شتوية",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop"
  },
  {
    name: "Serge Lutens Chergui",
    brand: "Serge Lutens",
    description: "عطر شتوي دافئ بنفحات القش والعسل مع التبغ",
    price: 750,
    stock: 12,
    categoryName: "عطور شتوية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop"
  },
  {
    name: "Estée Lauder Private Collection",
    brand: "Estée Lauder",
    description: "عطر شتوي أنيق بنفحات الياسمين والورد مع خشب الصندل",
    price: 520,
    originalPrice: 600,
    stock: 18,
    categoryName: "عطور شتوية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=400&h=400&fit=crop"
  },

  // عطور مناسبات
  {
    name: "Clive Christian No. 1",
    brand: "Clive Christian",
    description: "عطر مناسبات فاخر بنفحات الياسمين والورد مع خشب الصندل",
    price: 1200,
    stock: 5,
    categoryName: "عطور مناسبات",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop"
  },
  {
    name: "Roja Parfums Scandal",
    brand: "Roja Parfums",
    description: "عطر مناسبات راقي بنفحات الورد والياسمين مع العنبر",
    price: 980,
    originalPrice: 1150,
    stock: 8,
    categoryName: "عطور مناسبات",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
  },
  {
    name: "Kilian Love Don't Be Shy",
    brand: "Kilian",
    description: "عطر مناسبات حلو بنفحات الخوخ والورد مع المسك الأبيض",
    price: 850,
    stock: 10,
    categoryName: "عطور مناسبات",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop"
  },
  {
    name: "Baccarat Rouge 540 Extrait",
    brand: "Maison Francis Kurkdjian",
    description: "عطر مناسبات استثنائي بنفحات الزعفران والياسمين المكثف",
    price: 920,
    stock: 7,
    categoryName: "عطور مناسبات",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop"
  },
  {
    name: "Parfums de Marly Layton",
    brand: "Parfums de Marly",
    description: "عطر مناسبات ملكي بنفحات التفاح والياسمين مع الفانيليا",
    price: 780,
    originalPrice: 880,
    stock: 12,
    categoryName: "عطور مناسبات",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop"
  },

  // عطور يومية
  {
    name: "Chanel Allure Homme Sport",
    brand: "Chanel",
    description: "عطر يومي رياضي بنفحات البرتقال والفلفل الأسود مع خشب الأرز",
    price: 520,
    stock: 30,
    categoryName: "عطور يومية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=400&h=400&fit=crop"
  },
  {
    name: "Prada Luna Rossa",
    brand: "Prada",
    description: "عطر يومي عصري بنفحات اللافندر والنعناع مع العنبر الرمادي",
    price: 480,
    originalPrice: 550,
    stock: 25,
    categoryName: "عطور يومية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop"
  },
  {
    name: "Giorgio Armani Acqua di Gio",
    brand: "Giorgio Armani",
    description: "عطر يومي مائي بنفحات البرغموت والياسمين مع المسك الأبيض",
    price: 450,
    stock: 35,
    categoryName: "عطور يومية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
  },
  {
    name: "Hugo Boss Bottled",
    brand: "Hugo Boss",
    description: "عطر يومي كلاسيكي بنفحات التفاح والقرفة مع خشب الصندل",
    price: 380,
    stock: 40,
    categoryName: "عطور يومية",
    rating: 3,
    mainImage: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop"
  },
  {
    name: "Ralph Lauren Polo Blue",
    brand: "Ralph Lauren",
    description: "عطر يومي منعش بنفحات الخيار والباسيل مع المسك",
    price: 420,
    originalPrice: 480,
    stock: 28,
    categoryName: "عطور يومية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop"
  },
  {
    name: "Davidoff Cool Water",
    brand: "Davidoff",
    description: "عطر يومي اقتصادي بنفحات النعناع والياسمين مع المسك",
    price: 280,
    stock: 45,
    categoryName: "عطور يومية",
    rating: 3,
    mainImage: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop"
  },

  // عطور إضافية متنوعة
  {
    name: "Penhaligon's Portraits The Tragedy of Lord George",
    brand: "Penhaligon's",
    description: "عطر بريطاني فاخر بنفحات الشاي الأسود والتونكا مع الجين",
    price: 680,
    stock: 15,
    categoryName: "عطور رجالية فاخرة",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=400&h=400&fit=crop"
  },
  {
    name: "Escentric Molecules Molecule 01",
    brand: "Escentric Molecules",
    description: "عطر مشترك فريد بنفحة واحدة من Iso E Super المركب",
    price: 420,
    originalPrice: 480,
    stock: 20,
    categoryName: "عطور مشتركة",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop"
  },
  {
    name: "Memo Irish Leather",
    brand: "Memo",
    description: "عطر جلدي فاخر بنفحات الجلد والفلفل الوردي مع العنبر",
    price: 750,
    stock: 12,
    categoryName: "عطور مناسبات",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
  },
  {
    name: "Atelier Cologne Orange Sanguine",
    brand: "Atelier Cologne",
    description: "عطر حمضي منعش بنفحات البرتقال الأحمر والجاسمين",
    price: 380,
    stock: 25,
    categoryName: "عطور صيفية",
    rating: 4,
    mainImage: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop"
  },
  {
    name: "Frederic Malle Portrait of a Lady",
    brand: "Frederic Malle",
    description: "عطر نسائي راقي بنفحات الورد التركي والباتشولي مع البخور",
    price: 820,
    originalPrice: 950,
    stock: 10,
    categoryName: "عطور نسائية راقية",
    rating: 5,
    mainImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop"
  }
];

export default { perfumeCategories, perfumeProducts }; 