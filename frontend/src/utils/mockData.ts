// Mock data for development and fallback when API is not available
export interface MockProduct {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: string | number;
  mainImage: string;
  rating: number;
  brand: string;
  specifications: { name: string; value: string }[];
  createdAt: string;
}

export interface MockCategory {
  id: string | number;
  name: string;
  description: string;
  image: string;
}

export const mockCategories: MockCategory[] = [
  {
    id: 1,
    name: "عطور رجالية",
    description: "مجموعة متنوعة من العطور الرجالية الفاخرة",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIj7Yudm32YjYsSDYsdis2KfZhNmK2Kk8L3RleHQ+Cjwvc3ZnPgo="
  },
  {
    id: 2,
    name: "عطور نسائية",
    description: "عطور نسائية أنيقة وجذابة",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkY2QkI2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIj7Yudm32YjYsSDZhtiz2KfYptmK2Kk8L3RleHQ+Cjwvc3ZnPgo="
  },
  {
    id: 3,
    name: "عطور مشتركة",
    description: "عطور للجنسين بروائح مميزة",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjNjY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIj7Yudm32YjYsSDZhdi02KrYsdmD2Kk8L3RleHQ+Cjwvc3ZnPgo="
  },
  {
    id: 4,
    name: "عطور فاخرة",
    description: "عطور فاخرة ومميزة من أفضل الماركات",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjR09MRCIvPgo8dGV4dCB4PSIyMDAiIHk9IjIwMCIgZmlsbD0iYmxhY2siIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtZmFtaWx5PSJBcmlhbCI+2LnYt9mI2LEg2YHYp9iu2LHYqTwvdGV4dD4KPC9zdmc+Cg=="
  }
];

export const mockProducts: MockProduct[] = [
  // Men's Perfumes
  {
    id: 1,
    name: "Maison Francis Kurkdjian Baccarat Rouge 540",
    description: "عطر رجالي فاخر بنفحات خشبية وزهرية مع لمسة من العنبر والياسمين. يتميز بثباته الطويل ورائحته المميزة التي تجذب الانتباه.",
    price: 320,
    originalPrice: 420,
    stock: 15,
    categoryId: 1,
    mainImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMkQ0QTg3Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9IkFyaWFsIj5NYWlzb24gRnJhbmNpczwvdGV4dD4KPHRleHQgeD0iMjAwIiB5PSIyMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwiPkJhY2NhcmF0IFJvdWdlIDU0MDwvdGV4dD4KPC9zdmc+Cg==",
    rating: 5,
    brand: "Maison Francis Kurkdjian",
    specifications: [
      { name: "الحجم", value: "70 مل" },
      { name: "نوع العطر", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "خشبي - زهري" },
      { name: "المكونات الأساسية", value: "العنبر، الياسمين، خشب الأرز" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Philosophy Amazing Grace",
    description: "عطر عصري بلمسة من الحمضيات والزهور البيضاء. يتميز برائحة منعشة ونظيفة مناسبة للاستخدام اليومي.",
    price: 280,
    stock: 12,
    categoryId: 1,
    mainImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjNDc4NEIzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIj5QaGlsb3NvcGh5PC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIyMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCI+QW1hemluZyBHcmFjZTwvdGV4dD4KPC9zdmc+Cg==",
    rating: 4,
    brand: "Philosophy",
    specifications: [
      { name: "الحجم", value: "60 مل" },
      { name: "نوع العطر", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "حمضي - زهري" },
      { name: "المكونات الأساسية", value: "البرغموت، الياسمين، المسك الأبيض" }
    ],
    createdAt: new Date().toISOString()
  },
  // Women's Perfumes
  {
    id: 3,
    name: "Aerin Mediterranean Honeysuckle",
    description: "عطر نسائي بروائح زهرية ناعمة مستوحى من البحر الأبيض المتوسط. يجمع بين زهرة العسل والحمضيات المنعشة.",
    price: 350,
    originalPrice: 450,
    stock: 20,
    categoryId: 2,
    mainImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkY5Q0REIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5BZXJpbjwvdGV4dD4KPHRleHQgeD0iMjAwIiB5PSIyMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwiPk1lZGl0ZXJyYW5lYW4gSG9uZXlzdWNrbGU8L3RleHQ+Cjwvc3ZnPgo=",
    rating: 5,
    brand: "Aerin",
    specifications: [
      { name: "الحجم", value: "50 مل" },
      { name: "نوع العطر", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "زهري - حمضي" },
      { name: "المكونات الأساسية", value: "زهرة العسل، الليمون، الياسمين" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Viktor & Rolf Flowerbomb",
    description: "عطر أنيق بلمسة من الفانيليا والزهور. يتميز برائحة حلوة وجذابة مع ثبات ممتاز طوال اليوم.",
    price: 380,
    stock: 25,
    categoryId: 2,
    mainImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRTkxRTYzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9IkFyaWFsIj5WaWt0b3IgJiBSb2xmPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIyMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCI+Rmxvd2VyYm9tYjwvdGV4dD4KPC9zdmc+Cg==",
    rating: 4,
    brand: "Viktor & Rolf",
    specifications: [
      { name: "الحجم", value: "50 مل" },
      { name: "نوع العطر", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "زهري - شرقي" },
      { name: "المكونات الأساسية", value: "الفانيليا، الباتشولي، الفريزيا" }
    ],
    createdAt: new Date().toISOString()
  },
  // Unisex Perfumes
  {
    id: 5,
    name: "Chanel Bleu de Chanel",
    description: "عطر كلاسيكي للجنسين بتركيبة خشبية عطرة. يجمع بين الأناقة والعصرية في تركيبة متوازنة ومميزة.",
    price: 450,
    originalPrice: 550,
    stock: 8,
    categoryId: 3,
    mainImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMDA0Q0JGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIj5DaGFuZWw8L3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMjIwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9IkFyaWFsIj5CbGV1IGRlIENoYW5lbDwvdGV4dD4KPC9zdmc+Cg==",
    rating: 5,
    brand: "Chanel",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "نوع العطر", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "خشبي - عطري" },
      { name: "المكونات الأساسية", value: "الجريب فروت، الأرز، البخور" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    name: "Yves Saint Laurent Black Opium",
    description: "عطر عصري بتركيبة فريدة تجمع بين القهوة والفانيليا. رائحة جريئة ومثيرة مناسبة للمساء.",
    price: 320,
    stock: 10,
    categoryId: 3,
    mainImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMDAwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIj5ZdmVzIFNhaW50IExhdXJlbnQ8L3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMjIwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9IkFyaWFsIj5CbGFjayBPcGl1bTwvdGV4dD4KPC9zdmc+Cg==",
    rating: 4,
    brand: "Yves Saint Laurent",
    specifications: [
      { name: "الحجم", value: "90 مل" },
      { name: "نوع العطر", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "شرقي - حلو" },
      { name: "المكونات الأساسية", value: "القهوة، الفانيليا، الياسمين الأبيض" }
    ],
    createdAt: new Date().toISOString()
  },
  // Luxury Perfumes
  {
    id: 7,
    name: "Dior Sauvage Elixir",
    description: "عطر فاخر من دار ديور بتركيبة قوية ومكثفة. يتميز بالفلفل الأسود والخزامى مع لمسة خشبية عميقة.",
    price: 520,
    originalPrice: 650,
    stock: 30,
    categoryId: 4,
    mainImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMTEyMzQ0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIzMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5EaW9yPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIyMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCI+U2F1dmFnZSBFbGl4aXI8L3RleHQ+Cjwvc3ZnPgo=",
    rating: 5,
    brand: "Dior",
    specifications: [
      { name: "الحجم", value: "60 مل" },
      { name: "نوع العطر", value: "Parfum" },
      { name: "العائلة العطرية", value: "خشبي - عطري" },
      { name: "المكونات الأساسية", value: "الفلفل الأسود، الخزامى، خشب الصندل" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    name: "Tom Ford Oud Wood",
    description: "عطر حصري بتركيبة معقدة من العود والورد. يمثل قمة الفخامة والأناقة في عالم العطور.",
    price: 680,
    originalPrice: 800,
    stock: 15,
    categoryId: 4,
    mainImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjOEI0NTEzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5Ub20gRm9yZDwvdGV4dD4KPHRleHQgeD0iMjAwIiB5PSIyMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiPk91ZCBXb29kPC90ZXh0Pgo8L3N2Zz4K",
    rating: 5,
    brand: "Tom Ford",
    specifications: [
      { name: "الحجم", value: "50 مل" },
      { name: "نوع العطر", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "خشبي - شرقي" },
      { name: "المكونات الأساسية", value: "العود، الورد البلغاري، خشب الصندل" }
    ],
    createdAt: new Date().toISOString()
  },
  // Additional products for variety
  {
    id: 9,
    name: "Creed Aventus",
    description: "عطر فاخر مستوحى من الإمبراطور نابليون. يجمع بين الأناناس والبرغموت مع قاعدة خشبية قوية.",
    price: 590,
    originalPrice: 720,
    stock: 12,
    categoryId: 4,
    mainImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMDA0MDAwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIj5DcmVlZDwvdGV4dD4KPHRleHQgeD0iMjAwIiB5PSIyMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiPkF2ZW50dXM8L3RleHQ+Cjwvc3ZnPgo=",
    rating: 5,
    brand: "Creed",
    specifications: [
      { name: "الحجم", value: "120 مل" },
      { name: "نوع العطر", value: "Eau de Parfum" },
      { name: "العائلة العطرية", value: "فاكهي - خشبي" },
      { name: "المكونات الأساسية", value: "الأناناس، البرغموت، خشب البتولا" }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 10,
    name: "Hermès Terre d'Hermès",
    description: "عطر رجالي أنيق يعكس علاقة الرجل بالأرض. تركيبة متوازنة من الحمضيات والمعادن والخشب.",
    price: 420,
    stock: 18,
    categoryId: 1,
    mainImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkY4QzAwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5IZXJtw6hzPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjIyMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCI+VGVycmUgZCdIZXJtw6hzPC90ZXh0Pgo8L3N2Zz4K",
    rating: 4,
    brand: "Hermès",
    specifications: [
      { name: "الحجم", value: "100 مل" },
      { name: "نوع العطر", value: "Eau de Toilette" },
      { name: "العائلة العطرية", value: "خشبي - حمضي" },
      { name: "المكونات الأساسية", value: "الجريب فروت، الفلفل، الأرز" }
    ],
    createdAt: new Date().toISOString()
  }
];

// Helper functions
export const getMockProducts = (): MockProduct[] => {
  // Try to get products from localStorage first
  const stored = localStorage.getItem('products');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored products, using mock data');
    }
  }
  
  // Store mock data in localStorage for persistence
  localStorage.setItem('products', JSON.stringify(mockProducts));
  return mockProducts;
};

export const getMockCategories = (): MockCategory[] => {
  // Try to get categories from localStorage first
  const stored = localStorage.getItem('categories');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored categories, using mock data');
    }
  }
  
  // Store mock data in localStorage for persistence
  localStorage.setItem('categories', JSON.stringify(mockCategories));
  return mockCategories;
};

export const getMockProductById = (id: string | number): MockProduct | null => {
  const products = getMockProducts();
  return products.find(p => p.id.toString() === id.toString()) || null;
};

export const getMockProductsByCategory = (categoryId: string | number): MockProduct[] => {
  const products = getMockProducts();
  return products.filter(p => p.categoryId.toString() === categoryId.toString());
}; 