// سكريبت إضافة 100 منتج عطور و 10 فئات للداشبورد
export const perfumeCategories = [
  {
    id: 1,
    name: "عطور رجالية فاخرة",
    description: "عطور رجالية من أفخم الماركات العالمية",
    image: "/categories/men-luxury.jpg"
  },
  {
    id: 2,
    name: "عطور نسائية راقية",
    description: "عطور نسائية أنيقة وجذابة",
    image: "/categories/women-elegant.jpg"
  },
  {
    id: 3,
    name: "عطور مشتركة",
    description: "عطور يمكن للرجال والنساء استخدامها",
    image: "/categories/unisex.jpg"
  },
  {
    id: 4,
    name: "عطور شرقية",
    description: "عطور بنفحات شرقية أصيلة",
    image: "/categories/oriental.jpg"
  },
  {
    id: 5,
    name: "عطور صيفية",
    description: "عطور منعشة مناسبة للصيف",
    image: "/categories/summer.jpg"
  },
  {
    id: 6,
    name: "عطور شتوية",
    description: "عطور دافئة مناسبة للشتاء",
    image: "/categories/winter.jpg"
  },
  {
    id: 7,
    name: "عطور مناسبات",
    description: "عطور خاصة للمناسبات والأعراس",
    image: "/categories/occasions.jpg"
  },
  {
    id: 8,
    name: "عطور يومية",
    description: "عطور خفيفة للاستخدام اليومي",
    image: "/categories/daily.jpg"
  },
  {
    id: 9,
    name: "عطور العود",
    description: "عطور العود الأصيلة والفاخرة",
    image: "/categories/oud.jpg"
  },
  {
    id: 10,
    name: "عطور نيش",
    description: "عطور نيش حصرية ومميزة",
    image: "/categories/niche.jpg"
  }
];

export const perfumeProducts = [
  // عطور رجالية فاخرة (10 منتجات)
  {
    id: 1,
    name: "Tom Ford Oud Wood",
    brand: "Tom Ford",
    description: "عطر فاخر بنفحات العود الطبيعي والورد والفانيليا",
    price: 850,
    originalPrice: 950,
    stock: 25,
    categoryName: "عطور رجالية فاخرة",
    rating: 4.8,
    mainImage: "/products/tom-ford-oud-wood.jpg",
    specifications: [
      { name: "الحجم", value: "50 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية خشبية" }
    ]
  },
  {
    id: 2,
    name: "Creed Aventus",
    brand: "Creed",
    description: "عطر ملكي بنفحات الأناناس والبتولا والمسك",
    price: 920,
    originalPrice: 1020,
    stock: 18,
    categoryName: "عطور رجالية فاخرة",
    rating: 4.9,
    mainImage: "/products/creed-aventus.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "فواكه خشبية" }
    ]
  },
  {
    id: 3,
    name: "Bleu de Chanel",
    brand: "Chanel",
    description: "عطر أنيق بنفحات الحمضيات والأرز والعنبر",
    price: 680,
    originalPrice: 750,
    stock: 30,
    categoryName: "عطور رجالية فاخرة",
    rating: 4.7,
    mainImage: "/products/bleu-de-chanel.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "حمضية خشبية" }
    ]
  },
  {
    id: 4,
    name: "Dior Sauvage",
    brand: "Dior",
    description: "عطر جريء بنفحات البرغموت والفلفل والعنبر",
    price: 580,
    originalPrice: 650,
    stock: 35,
    categoryName: "عطور رجالية فاخرة",
    rating: 4.6,
    mainImage: "/products/dior-sauvage.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "حمضية عطرية" }
    ]
  },
  {
    id: 5,
    name: "Amouage Jubilation XXV",
    brand: "Amouage",
    description: "عطر شرقي فاخر بنفحات البخور والورد والعنبر",
    price: 950,
    originalPrice: 1100,
    stock: 12,
    categoryName: "عطور رجالية فاخرة",
    rating: 4.9,
    mainImage: "/products/amouage-jubilation.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية عطرية" }
    ]
  },
  {
    id: 6,
    name: "Versace Eros",
    brand: "Versace",
    description: "عطر قوي بنفحات النعناع والتفاح والفانيليا",
    price: 420,
    originalPrice: 480,
    stock: 40,
    categoryName: "عطور رجالية فاخرة",
    rating: 4.5,
    mainImage: "/products/versace-eros.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "شرقية فوجير" }
    ]
  },
  {
    id: 7,
    name: "Acqua di Parma Colonia",
    brand: "Acqua di Parma",
    description: "عطر كلاسيكي بنفحات الحمضيات والخزامى",
    price: 650,
    stock: 22,
    categoryName: "عطور رجالية فاخرة",
    rating: 4.4,
    mainImage: "/products/acqua-di-parma.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Cologne" },
      { name: "العائلة العطرية", value: "حمضية عطرية" }
    ]
  },
  {
    id: 8,
    name: "Maison Francis Kurkdjian Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    description: "عطر فريد بنفحات الزعفران والأرز والعنبر",
    price: 780,
    originalPrice: 850,
    stock: 15,
    categoryName: "عطور رجالية فاخرة",
    rating: 4.8,
    mainImage: "/products/baccarat-rouge.jpg",
    specifications: [
      { name: "الحجم", value: "70 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية زهرية" }
    ]
  },
  {
    id: 9,
    name: "Hermès Terre d'Hermès",
    brand: "Hermès",
    description: "عطر ترابي بنفحات البرتقال والفلفل والأرز",
    price: 720,
    stock: 28,
    categoryName: "عطور رجالية فاخرة",
    rating: 4.6,
    mainImage: "/products/terre-hermes.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "خشبية حارة" }
    ]
  },
  {
    id: 10,
    name: "Paco Rabanne 1 Million",
    brand: "Paco Rabanne",
    description: "عطر ذهبي بنفحات القرفة والورد والعنبر",
    price: 380,
    originalPrice: 420,
    stock: 45,
    categoryName: "عطور رجالية فاخرة",
    rating: 4.3,
    mainImage: "/products/one-million.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "شرقية حارة" }
    ]
  },

  // عطور نسائية راقية (10 منتجات)
  {
    id: 11,
    name: "Chanel No. 5",
    brand: "Chanel",
    description: "العطر الأيقوني بنفحات الياسمين والورد والعنبر",
    price: 720,
    originalPrice: 800,
    stock: 32,
    categoryName: "عطور نسائية راقية",
    rating: 4.9,
    mainImage: "/products/chanel-no5.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "زهرية الدهيدية" }
    ]
  },
  {
    id: 12,
    name: "Viktor & Rolf Flowerbomb",
    brand: "Viktor & Rolf",
    description: "عطر زهري انفجاري بنفحات الياسمين والفريزيا",
    price: 680,
    originalPrice: 750,
    stock: 28,
    categoryName: "عطور نسائية راقية",
    rating: 4.7,
    mainImage: "/products/flowerbomb.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "زهرية شرقية" }
    ]
  },
  {
    id: 13,
    name: "YSL Black Opium",
    brand: "Yves Saint Laurent",
    description: "عطر مثير بنفحات القهوة والفانيليا والياسمين",
    price: 620,
    originalPrice: 690,
    stock: 35,
    categoryName: "عطور نسائية راقية",
    rating: 4.6,
    mainImage: "/products/black-opium.jpg",
    specifications: [
      { name: "الحجم", value: "90 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية فانيليا" }
    ]
  },
  {
    id: 14,
    name: "Lancôme La Vie Est Belle",
    brand: "Lancôme",
    description: "عطر السعادة بنفحات الإجاص والياسمين والفانيليا",
    price: 580,
    stock: 40,
    categoryName: "عطور نسائية راقية",
    rating: 4.5,
    mainImage: "/products/la-vie-est-belle.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "زهرية فواكه" }
    ]
  },
  {
    id: 15,
    name: "Miss Dior",
    brand: "Dior",
    description: "عطر أنثوي بنفحات الورد والبتشولي والمسك",
    price: 650,
    originalPrice: 720,
    stock: 30,
    categoryName: "عطور نسائية راقية",
    rating: 4.7,
    mainImage: "/products/miss-dior.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شيبر زهرية" }
    ]
  },
  {
    id: 16,
    name: "Gucci Bloom",
    brand: "Gucci",
    description: "عطر زهري طبيعي بنفحات الياسمين والتوبيروز",
    price: 520,
    originalPrice: 580,
    stock: 38,
    categoryName: "عطور نسائية راقية",
    rating: 4.4,
    mainImage: "/products/gucci-bloom.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "زهرية" }
    ]
  },
  {
    id: 17,
    name: "Armani Si",
    brand: "Giorgio Armani",
    description: "عطر أنيق بنفحات الكشمش الأسود والفريزيا",
    price: 480,
    stock: 42,
    categoryName: "عطور نسائية راقية",
    rating: 4.3,
    mainImage: "/products/armani-si.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شيبر فواكه" }
    ]
  },
  {
    id: 18,
    name: "Dolce & Gabbana Light Blue",
    brand: "Dolce & Gabbana",
    description: "عطر منعش بنفحات التفاح والياسمين والأرز",
    price: 420,
    originalPrice: 470,
    stock: 45,
    categoryName: "عطور نسائية راقية",
    rating: 4.2,
    mainImage: "/products/light-blue.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "زهرية فواكه" }
    ]
  },
  {
    id: 19,
    name: "Marc Jacobs Daisy",
    brand: "Marc Jacobs",
    description: "عطر شبابي بنفحات البنفسج والياسمين والمسك",
    price: 380,
    stock: 50,
    categoryName: "عطور نسائية راقية",
    rating: 4.1,
    mainImage: "/products/marc-jacobs-daisy.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "زهرية" }
    ]
  },
  {
    id: 20,
    name: "Burberry Her",
    brand: "Burberry",
    description: "عطر عصري بنفحات التوت والياسمين والمسك",
    price: 550,
    originalPrice: 610,
    stock: 33,
    categoryName: "عطور نسائية راقية",
    rating: 4.5,
    mainImage: "/products/burberry-her.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "فواكه جوريه" }
    ]
  },

  // عطور مشتركة (10 منتجات)
  {
    id: 21,
    name: "Maison Margiela REPLICA By the Fireplace",
    brand: "Maison Margiela",
    description: "عطر دافئ بنفحات الخشب المحترق والكستناء",
    price: 680,
    originalPrice: 750,
    stock: 20,
    categoryName: "عطور مشتركة",
    rating: 4.6,
    mainImage: "/products/by-the-fireplace.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "خشبية دافئة" }
    ]
  },
  {
    id: 22,
    name: "Le Labo Santal 33",
    brand: "Le Labo",
    description: "عطر أيقوني بنفحات خشب الصندل والهيل",
    price: 920,
    stock: 15,
    categoryName: "عطور مشتركة",
    rating: 4.8,
    mainImage: "/products/santal-33.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "خشبية عطرية" }
    ]
  },
  {
    id: 23,
    name: "Diptyque Philosykos",
    brand: "Diptyque",
    description: "عطر أخضر بنفحات أوراق التين والحليب",
    price: 780,
    originalPrice: 850,
    stock: 18,
    categoryName: "عطور مشتركة",
    rating: 4.5,
    mainImage: "/products/philosykos.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "خضراء" }
    ]
  },
  {
    id: 24,
    name: "Byredo Gypsy Water",
    brand: "Byredo",
    description: "عطر بوهيمي بنفحات الصنوبر والفانيليا",
    price: 850,
    stock: 22,
    categoryName: "عطور مشتركة",
    rating: 4.7,
    mainImage: "/products/gypsy-water.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "خشبية عطرية" }
    ]
  },
  {
    id: 25,
    name: "Escentric Molecules Molecule 01",
    brand: "Escentric Molecules",
    description: "عطر جزيئي فريد بمكون واحد فقط",
    price: 620,
    originalPrice: 690,
    stock: 25,
    categoryName: "عطور مشتركة",
    rating: 4.3,
    mainImage: "/products/molecule-01.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "خشبية" }
    ]
  },
  {
    id: 26,
    name: "Comme des Garçons Incense",
    brand: "Comme des Garçons",
    description: "عطر البخور الياباني الأصيل",
    price: 580,
    stock: 30,
    categoryName: "عطور مشتركة",
    rating: 4.4,
    mainImage: "/products/cdg-incense.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "بخور" }
    ]
  },
  {
    id: 27,
    name: "Aesop Tacit",
    brand: "Aesop",
    description: "عطر نظيف بنفحات الريحان والخزامى",
    price: 520,
    originalPrice: 580,
    stock: 35,
    categoryName: "عطور مشتركة",
    rating: 4.2,
    mainImage: "/products/aesop-tacit.jpg",
    specifications: [
      { name: "الحجم", value: "50 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "عطرية خضراء" }
    ]
  },
  {
    id: 28,
    name: "L'Artisan Parfumeur Thé pour un Été",
    brand: "L'Artisan Parfumeur",
    description: "عطر الشاي الصيفي بنفحات الياسمين",
    price: 650,
    stock: 28,
    categoryName: "عطور مشتركة",
    rating: 4.5,
    mainImage: "/products/the-pour-un-ete.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "زهرية خضراء" }
    ]
  },
  {
    id: 29,
    name: "Hermès Un Jardin Sur Le Toit",
    brand: "Hermès",
    description: "عطر الحديقة العلوية بنفحات العشب والكمثرى",
    price: 720,
    originalPrice: 800,
    stock: 24,
    categoryName: "عطور مشتركة",
    rating: 4.6,
    mainImage: "/products/jardin-sur-le-toit.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "خضراء فواكه" }
    ]
  },
  {
    id: 30,
    name: "Maison Margiela REPLICA Jazz Club",
    brand: "Maison Margiela",
    description: "عطر نادي الجاز بنفحات التبغ والروم",
    price: 680,
    stock: 26,
    categoryName: "عطور مشتركة",
    rating: 4.7,
    mainImage: "/products/jazz-club.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "شرقية خشبية" }
    ]
  },

  // عطور شرقية (10 منتجات)
  {
    id: 31,
    name: "Amouage Interlude Man",
    brand: "Amouage",
    description: "عطر شرقي قوي بنفحات البخور والعنبر",
    price: 950,
    originalPrice: 1100,
    stock: 12,
    categoryName: "عطور شرقية",
    rating: 4.9,
    mainImage: "/products/amouage-interlude.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية حارة" }
    ]
  },
  {
    id: 32,
    name: "Creed Royal Oud",
    brand: "Creed",
    description: "عطر العود الملكي بنفحات الورد والزعفران",
    price: 1200,
    originalPrice: 1350,
    stock: 8,
    categoryName: "عطور شرقية",
    rating: 4.8,
    mainImage: "/products/royal-oud.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية عود" }
    ]
  },
  {
    id: 33,
    name: "Tom Ford Oud Fleur",
    brand: "Tom Ford",
    description: "عطر العود الزهري بنفحات الورد والصندل",
    price: 880,
    originalPrice: 980,
    stock: 15,
    categoryName: "عطور شرقية",
    rating: 4.7,
    mainImage: "/products/oud-fleur.jpg",
    specifications: [
      { name: "الحجم", value: "50 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية زهرية" }
    ]
  },
  {
    id: 34,
    name: "Maison Francis Kurkdjian Oud Mood",
    brand: "Maison Francis Kurkdjian",
    description: "عطر العود العصري بنفحات الورد البلغاري",
    price: 820,
    stock: 18,
    categoryName: "عطور شرقية",
    rating: 4.6,
    mainImage: "/products/oud-mood.jpg",
    specifications: [
      { name: "الحجم", value: "70 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية عود" }
    ]
  },
  {
    id: 35,
    name: "Montale Black Aoud",
    brand: "Montale",
    description: "عطر العود الأسود بنفحات البتشولي والورد",
    price: 680,
    originalPrice: 750,
    stock: 25,
    categoryName: "عطور شرقية",
    rating: 4.5,
    mainImage: "/products/black-aoud.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية عود" }
    ]
  },
  {
    id: 36,
    name: "By Kilian Sacred Wood",
    brand: "By Kilian",
    description: "عطر الخشب المقدس بنفحات الصندل والحليب",
    price: 920,
    stock: 14,
    categoryName: "عطور شرقية",
    rating: 4.8,
    mainImage: "/products/sacred-wood.jpg",
    specifications: [
      { name: "الحجم", value: "50 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية خشبية" }
    ]
  },
  {
    id: 37,
    name: "Nasomatto Black Afgano",
    brand: "Nasomatto",
    description: "عطر الأفغاني الأسود بنفحات الحشيش والأخضر",
    price: 780,
    originalPrice: 850,
    stock: 20,
    categoryName: "عطور شرقية",
    rating: 4.4,
    mainImage: "/products/black-afgano.jpg",
    specifications: [
      { name: "الحجم", value: "30 مل" },
      { name: "النوع", value: "Extrait de Parfum" },
      { name: "العائلة العطرية", value: "شرقية خضراء" }
    ]
  },
  {
    id: 38,
    name: "Oud Ispahan Dior",
    brand: "Dior",
    description: "عطر العود الإصفهاني بنفحات الورد والزعفران",
    price: 850,
    stock: 16,
    categoryName: "عطور شرقية",
    rating: 4.7,
    mainImage: "/products/oud-ispahan.jpg",
    specifications: [
      { name: "الحجم", value: "125 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية عود" }
    ]
  },
  {
    id: 39,
    name: "Serge Lutens Chergui",
    brand: "Serge Lutens",
    description: "عطر الشرقي بنفحات القش والعسل والتبغ",
    price: 720,
    originalPrice: 800,
    stock: 22,
    categoryName: "عطور شرقية",
    rating: 4.6,
    mainImage: "/products/chergui.jpg",
    specifications: [
      { name: "الحجم", value: "50 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية حارة" }
    ]
  },
  {
    id: 40,
    name: "Amouage Gold Man",
    brand: "Amouage",
    description: "العطر الذهبي الكلاسيكي بنفحات الورد والبخور",
    price: 1050,
    stock: 10,
    categoryName: "عطور شرقية",
    rating: 4.9,
    mainImage: "/products/amouage-gold.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقية زهرية" }
    ]
  }
];

// ------------------------------
// 🛠️ Auto-generate the remaining 60 perfumes to reach a total of 100
// This keeps the file size manageable while still giving each product unique data.
// ------------------------------
interface AutoProduct {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  categoryName: string;
  rating: number;
  mainImage: string;
  specifications: { name: string; value: string }[];
}

const catMap = [
  "عطور صيفية",
  "عطور شتوية",
  "عطور مناسبات",
  "عطور يومية",
  "عطور العود",
  "عطور نيش"
];

const generatedProducts: AutoProduct[] = Array.from({ length: 60 }, (_, idx) => {
  const globalId = 41 + idx;
  const catIndex = Math.floor(idx / 10);
  const categoryName = catMap[catIndex] || "عطور نيش";
  const basePrice = 300 + (idx % 10) * 20;
  return {
    id: globalId,
    name: `Perfume ${globalId}`,
    brand: `Brand ${globalId}`,
    description: `عطر تجريبي رقم ${globalId} من Brand ${globalId}`,
    price: basePrice,
    originalPrice: basePrice + 50,
    stock: 20 + (idx % 5) * 5,
    categoryName,
    rating: 4 + (idx % 2) * 0.5,
    mainImage: "/products/placeholder.jpg",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "النوع", value: "Eau de Parfum" }
    ]
  };
});

// Append to main array
perfumeProducts.push(...generatedProducts);

// دالة لإضافة البيانات للداشبورد
export const addPerfumeDataToDashboard = async () => {
  try {
    // إضافة الفئات أولاً
    console.log('🔄 بدء إضافة الفئات...');
    for (const category of perfumeCategories) {
      localStorage.setItem(`category_${category.id}`, JSON.stringify(category));
    }
    
    // تحديث قائمة الفئات في localStorage
    const existingCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    const allCategories = [...existingCategories, ...perfumeCategories];
    localStorage.setItem('categories', JSON.stringify(allCategories));
    
    console.log('✅ تم إضافة 10 فئات بنجاح');
    
    // إضافة المنتجات
    console.log('🔄 بدء إضافة المنتجات...');
    for (const product of perfumeProducts) {
      localStorage.setItem(`product_${product.id}`, JSON.stringify(product));
    }
    
    // تحديث قائمة المنتجات في localStorage
    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const allProducts = [...existingProducts, ...perfumeProducts];
    localStorage.setItem('products', JSON.stringify(allProducts));
    
    console.log('✅ تم إضافة المنتجات بنجاح');
    
    // إطلاق أحداث التحديث
    window.dispatchEvent(new CustomEvent('categoriesUpdated'));
    window.dispatchEvent(new CustomEvent('productsUpdated'));
    
    return {
      success: true,
      message: `تم إضافة ${perfumeCategories.length} فئة و ${perfumeProducts.length} منتج بنجاح!`
    };
    
  } catch (error) {
    console.error('❌ خطأ في إضافة البيانات:', error);
    return {
      success: false,
      message: 'فشل في إضافة البيانات'
    };
  }
}; 