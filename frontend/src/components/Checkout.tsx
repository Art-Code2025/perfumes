import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ShoppingCart, 
  User, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Gift, 
  Truck, 
  Clock, 
  Star,
  Plus,
  Minus,
  X,
  ArrowRight,
  ArrowLeft,
  Package,
  Shield,
  Heart,
  Zap,
  Phone,
  Mail,
  Home,
  Calendar,
  Award,
  Percent,
  Calculator
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  category?: string;
  originalPrice?: number;
  discount?: number;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  buildingNumber?: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
}

interface ShippingZone {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  regions: string[];
  icon?: string;
  color?: string;
  freeShippingThreshold?: number;
}

interface Coupon {
  code: string;
  type: 'percentage' | 'fixed' | 'freeShipping';
  value: number;
  minAmount: number;
  maxDiscount?: number;
  description: string;
  validUntil?: string;
  category?: string;
  isActive: boolean;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    buildingNumber: '',
    floor: '',
    apartment: '',
    landmark: ''
  });
  const [selectedShippingZone, setSelectedShippingZone] = useState<ShippingZone | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [preferredDeliveryTime, setPreferredDeliveryTime] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [isGift, setIsGift] = useState(false);

  const steps = [
    { 
      id: 1, 
      title: 'مراجعة الطلب', 
      icon: ShoppingCart,
      description: 'تأكد من المنتجات والكميات',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 2, 
      title: 'معلومات التوصيل', 
      icon: MapPin,
      description: 'أدخل عنوان التوصيل',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 3, 
      title: 'الدفع والشحن', 
      icon: CreditCard,
      description: 'اختر طريقة الدفع والشحن',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 4, 
      title: 'تأكيد الطلب', 
      icon: CheckCircle,
      description: 'مراجعة نهائية وإرسال الطلب',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const shippingZones: ShippingZone[] = [
    {
      id: 'riyadh-express',
      name: 'الرياض - توصيل سريع',
      price: 15,
      estimatedDays: '24 ساعة',
      regions: ['الرياض', 'الدرعية', 'الخرج'],
      icon: '🚀',
      color: 'from-blue-500 to-blue-600',
      freeShippingThreshold: 200
    },
    {
      id: 'riyadh-standard',
      name: 'الرياض - توصيل عادي',
      price: 10,
      estimatedDays: '1-2 أيام',
      regions: ['الرياض', 'الدرعية', 'الخرج'],
      icon: '🚛',
      color: 'from-green-500 to-green-600',
      freeShippingThreshold: 150
    },
    {
      id: 'jeddah',
      name: 'جدة ومكة المكرمة',
      price: 20,
      estimatedDays: '2-3 أيام',
      regions: ['جدة', 'مكة', 'الطائف'],
      icon: '🏔️',
      color: 'from-purple-500 to-purple-600',
      freeShippingThreshold: 250
    },
    {
      id: 'dammam',
      name: 'الدمام والمنطقة الشرقية',
      price: 25,
      estimatedDays: '2-4 أيام',
      regions: ['الدمام', 'الخبر', 'الظهران', 'الأحساء'],
      icon: '🏭',
      color: 'from-teal-500 to-teal-600',
      freeShippingThreshold: 300
    },
    {
      id: 'north',
      name: 'المنطقة الشمالية',
      price: 30,
      estimatedDays: '3-5 أيام',
      regions: ['تبوك', 'الجوف', 'عرعر', 'حائل'],
      icon: '🏔️',
      color: 'from-indigo-500 to-indigo-600',
      freeShippingThreshold: 350
    },
    {
      id: 'south',
      name: 'المنطقة الجنوبية',
      price: 35,
      estimatedDays: '3-6 أيام',
      regions: ['أبها', 'جازان', 'نجران', 'الباحة'],
      icon: '🌴',
      color: 'from-orange-500 to-orange-600',
      freeShippingThreshold: 400
    },
    {
      id: 'other',
      name: 'باقي المناطق',
      price: 40,
      estimatedDays: '4-7 أيام',
      regions: ['أخرى'],
      icon: '📦',
      color: 'from-gray-500 to-gray-600',
      freeShippingThreshold: 500
    }
  ];

  const availableCoupons: Coupon[] = [
    {
      code: 'WELCOME15',
      type: 'percentage',
      value: 15,
      minAmount: 100,
      maxDiscount: 50,
      description: 'خصم 15% للعملاء الجدد (حتى 50 ريال)',
      validUntil: '2024-12-31',
      isActive: true
    },
    {
      code: 'SAVE100',
      type: 'fixed',
      value: 100,
      minAmount: 500,
      description: 'خصم 100 ريال عند الشراء بـ 500 ريال أو أكثر',
      validUntil: '2024-12-31',
      isActive: true
    },
    {
      code: 'FREESHIP',
      type: 'freeShipping',
      value: 0,
      minAmount: 200,
      description: 'شحن مجاني عند الشراء بـ 200 ريال أو أكثر',
      validUntil: '2024-12-31',
      isActive: true
    },
    {
      code: 'PERFUME20',
      type: 'percentage',
      value: 20,
      minAmount: 300,
      maxDiscount: 100,
      description: 'خصم 20% على العطور (حتى 100 ريال)',
      category: 'perfume',
      validUntil: '2024-12-31',
      isActive: true
    },
    {
      code: 'SUMMER25',
      type: 'percentage',
      value: 25,
      minAmount: 400,
      maxDiscount: 150,
      description: 'خصم صيفي 25% (حتى 150 ريال)',
      validUntil: '2024-08-31',
      isActive: true
    }
  ];

  const deliveryTimeSlots = [
    '9:00 ص - 12:00 م',
    '12:00 م - 3:00 م', 
    '3:00 م - 6:00 م',
    '6:00 م - 9:00 م',
    'أي وقت مناسب'
  ];

  // Load cart and user data
  useEffect(() => {
    console.log('🛒 [Checkout] Loading cart and user data...');
    setIsLoadingCart(true);
    
    // Small delay to ensure localStorage is available
    setTimeout(() => {
      try {
        // Load cart items
        const savedCart = localStorage.getItem('cartItems');
        console.log('📦 [Checkout] Saved cart:', savedCart);
        
        if (savedCart && savedCart !== 'null' && savedCart !== 'undefined') {
          try {
            const parsedCart = JSON.parse(savedCart);
            console.log('✅ [Checkout] Parsed cart:', parsedCart);
            
            if (Array.isArray(parsedCart) && parsedCart.length > 0) {
              // Convert any cart format to Checkout format
              const convertedCart = parsedCart.map((item: any, index: number) => {
                // Handle different cart formats
                let convertedItem: CartItem;
                
                if (item.product) {
                  // ShoppingCart format - Enhanced conversion
                  const basePrice = item.product.price || 0;
                  const optionsPrice = item.optionsPricing ? 
                    Object.values(item.optionsPricing).reduce((sum: number, price: any) => sum + (price || 0), 0) : 0;
                  const totalPrice = basePrice + optionsPrice;
                  
                  // Get size from selectedOptions with fallback
                  const getSize = () => {
                    if (item.selectedOptions) {
                      return item.selectedOptions.size || 
                             item.selectedOptions.الحجم || 
                             item.selectedOptions.المقاس || 
                             item.selectedOptions.Size || '';
                    }
                    return '';
                  };
                  
                  convertedItem = {
                    id: item.id?.toString() || item.productId?.toString() || `item-${index}`,
                    name: item.product.name || 'منتج غير معروف',
                    price: totalPrice,
                    originalPrice: item.product.originalPrice || totalPrice,
                    quantity: item.quantity || 1,
                    image: item.product.mainImage || '',
                    size: getSize(),
                    category: item.product.productType || item.product.category?.name || '',
                    discount: item.product.originalPrice && item.product.originalPrice > totalPrice ? 
                      Math.round(((item.product.originalPrice - totalPrice) / item.product.originalPrice) * 100) : 0
                  };
                } else {
                  // Simple format or already converted
                  convertedItem = {
                    id: item.id?.toString() || `item-${index}`,
                    name: item.name || item.productName || 'منتج غير معروف',
                    price: item.price || 0,
                    originalPrice: item.originalPrice || item.price || 0,
                    quantity: item.quantity || 1,
                    image: item.image || '',
                    size: item.size || '',
                    category: item.category || '',
                    discount: item.discount || 0
                  };
                }
                
                return convertedItem;
              });
              
              setCartItems(convertedCart);
              console.log('🎯 [Checkout] Cart converted and loaded successfully with', convertedCart.length, 'items');
            } else {
              console.log('⚠️ [Checkout] Cart is empty or invalid array');
              setCartItems([]);
            }
          } catch (error) {
            console.error('❌ [Checkout] Error parsing cart:', error);
            setCartItems([]);
          }
        } else {
          console.log('ℹ️ [Checkout] No cart found in localStorage');
          setCartItems([]);
        }

        // Load user data if logged in
        const savedUser = localStorage.getItem('user');
        if (savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
          try {
            const user = JSON.parse(savedUser);
            console.log('👤 [Checkout] Loading user data:', user);
            setUserData({
              name: user.name || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ''),
              email: user.email || '',
              phone: user.phone || '',
              address: user.address || '',
              city: user.city || '',
              region: user.region || '',
              postalCode: user.postalCode || '',
              buildingNumber: user.buildingNumber || '',
              floor: user.floor || '',
              apartment: user.apartment || '',
              landmark: user.landmark || ''
            });
          } catch (error) {
            console.error('❌ [Checkout] Error parsing user data:', error);
          }
        } else {
          console.log('ℹ️ [Checkout] No user data found - continuing as guest');
        }
      } catch (error) {
        console.error('❌ [Checkout] Error in useEffect:', error);
        setCartItems([]);
      } finally {
        setIsLoadingCart(false);
      }
    }, 100);
  }, []);

  // Auto-select shipping zone based on city
  useEffect(() => {
    if (userData.city) {
      const city = userData.city.toLowerCase();
      let selectedZone = null;
      
      if (city.includes('رياض')) {
        selectedZone = shippingZones.find(z => z.id === 'riyadh-standard');
      } else if (city.includes('جدة') || city.includes('مكة')) {
        selectedZone = shippingZones.find(z => z.id === 'jeddah');
      } else if (city.includes('دمام') || city.includes('خبر')) {
        selectedZone = shippingZones.find(z => z.id === 'dammam');
      }
      
      if (selectedZone && !selectedShippingZone) {
        setSelectedShippingZone(selectedZone);
        console.log('🚚 [Checkout] Auto-selected shipping zone:', selectedZone.name);
      }
    }
  }, [userData.city, selectedShippingZone]);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = (event: any) => {
      console.log('🔄 [Checkout] Cart update event received:', event.detail);
      if (event.detail && event.detail.items) {
        setCartItems(event.detail.items);
        console.log('✅ [Checkout] Cart updated with', event.detail.items.length, 'items');
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'cartItems') {
        console.log('💾 [Checkout] Storage change detected for cartItems');
        try {
          const newCart = event.newValue ? JSON.parse(event.newValue) : [];
          if (Array.isArray(newCart)) {
            setCartItems(newCart);
            console.log('🔄 [Checkout] Cart updated from storage with', newCart.length, 'items');
          }
        } catch (error) {
          console.error('❌ [Checkout] Error parsing cart from storage:', error);
        }
      }
    };

    // Add event listeners
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const itemsDiscount = originalTotal - subtotal;
  
  let shippingCost = selectedShippingZone?.price || 0;
  let couponDiscount = 0;
  let freeShipping = false;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      couponDiscount = Math.min(
        (subtotal * appliedCoupon.value / 100),
        appliedCoupon.maxDiscount || Infinity
      );
    } else if (appliedCoupon.type === 'fixed') {
      couponDiscount = appliedCoupon.value;
    } else if (appliedCoupon.type === 'freeShipping') {
      freeShipping = true;
      shippingCost = 0;
    }
  }

  // Check for free shipping threshold
  if (selectedShippingZone?.freeShippingThreshold && subtotal >= selectedShippingZone.freeShippingThreshold) {
    freeShipping = true;
    shippingCost = 0;
  }

  const total = Math.max(0, subtotal + shippingCost - couponDiscount);
  const totalSavings = itemsDiscount + couponDiscount + (freeShipping ? (selectedShippingZone?.price || 0) : 0);

  console.log('💰 [Checkout] Pricing calculation:', {
    subtotal,
    originalTotal,
    itemsDiscount,
    shippingCost,
    couponDiscount,
    freeShipping,
    total,
    totalSavings
  });

  // Utility functions
  const updateQuantity = (itemId: string, size: string | undefined, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Update the converted cart items for display
    const updatedItems = cartItems.map(item => 
      item.id === itemId && item.size === size 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCartItems(updatedItems);
    
    // Also update the original cart in localStorage
    try {
      const originalCart = localStorage.getItem('cartItems');
      if (originalCart) {
        const parsedOriginalCart = JSON.parse(originalCart);
        if (Array.isArray(parsedOriginalCart)) {
          const updatedOriginalCart = parsedOriginalCart.map((item: any) => {
            const itemIdMatch = item.id?.toString() === itemId || item.productId?.toString() === itemId;
            const sizeMatch = !size || 
              item.selectedOptions?.size === size || 
              item.selectedOptions?.الحجم === size ||
              item.size === size;
            
            if (itemIdMatch && sizeMatch) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
          
          localStorage.setItem('cartItems', JSON.stringify(updatedOriginalCart));
          console.log('✅ [Checkout] Original cart updated in localStorage');
        }
      }
    } catch (error) {
      console.error('❌ [Checkout] Error updating original cart:', error);
    }
    
    // Dispatch event for navbar update
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { items: updatedItems } 
    }));
    
    toast.success('تم تحديث الكمية');
  };

  const removeItem = (itemId: string, size: string | undefined) => {
    // Remove from converted cart items for display
    const updatedItems = cartItems.filter(item => 
      !(item.id === itemId && item.size === size)
    );
    
    setCartItems(updatedItems);
    
    // Also remove from original cart in localStorage
    try {
      const originalCart = localStorage.getItem('cartItems');
      if (originalCart) {
        const parsedOriginalCart = JSON.parse(originalCart);
        if (Array.isArray(parsedOriginalCart)) {
          const updatedOriginalCart = parsedOriginalCart.filter((item: any) => {
            const itemIdMatch = item.id?.toString() === itemId || item.productId?.toString() === itemId;
            const sizeMatch = !size || 
              item.selectedOptions?.size === size || 
              item.selectedOptions?.الحجم === size ||
              item.size === size;
            
            return !(itemIdMatch && sizeMatch);
          });
          
          localStorage.setItem('cartItems', JSON.stringify(updatedOriginalCart));
          console.log('✅ [Checkout] Item removed from original cart in localStorage');
        }
      }
    } catch (error) {
      console.error('❌ [Checkout] Error removing item from original cart:', error);
    }
    
    // Dispatch event for navbar update
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { items: updatedItems } 
    }));
    
    toast.success('تم حذف المنتج من السلة');
    
    if (updatedItems.length === 0) {
      toast.info('السلة فارغة الآن');
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (!userData.name.trim()) newErrors.name = 'الاسم مطلوب';
      if (!userData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        newErrors.email = 'البريد الإلكتروني غير صحيح';
      }
      if (!userData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
      else if (!/^(05|5)[0-9]{8}$/.test(userData.phone.replace(/\s|-/g, ''))) {
        newErrors.phone = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 05)';
      }
      if (!userData.address.trim()) newErrors.address = 'العنوان مطلوب';
      if (!userData.city.trim()) newErrors.city = 'المدينة مطلوبة';
      if (!userData.region.trim()) newErrors.region = 'المنطقة مطلوبة';
    }

    if (step === 3) {
      if (!selectedShippingZone) newErrors.shipping = 'يرجى اختيار طريقة الشحن';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('يرجى تصحيح الأخطاء المعروضة');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('يرجى إدخال كود الخصم');
      return;
    }

    setIsProcessing(true);

    try {
      const coupon = availableCoupons.find(c => 
        c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive
      );

      if (!coupon) {
        toast.error('كود الخصم غير صحيح أو منتهي الصلاحية');
        setIsProcessing(false);
        return;
      }

      if (subtotal < coupon.minAmount) {
        toast.error(`الحد الأدنى للطلب ${coupon.minAmount} ريال لاستخدام هذا الكوبون`);
        setIsProcessing(false);
        return;
      }

      // Check if coupon is category-specific
      if (coupon.category) {
        const hasValidItems = cartItems.some(item => 
          item.category?.toLowerCase().includes(coupon.category!)
        );
        if (!hasValidItems) {
          toast.error('هذا الكوبون غير صالح للمنتجات المحددة');
          setIsProcessing(false);
          return;
        }
      }

      setAppliedCoupon(coupon);
      toast.success(`تم تطبيق كوبون ${coupon.code} بنجاح! 🎉`);
      
      // Add confetti effect
      setTimeout(() => {
        // Simple confetti simulation
        for (let i = 0; i < 50; i++) {
          setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
              position: fixed;
              top: -10px;
              left: ${Math.random() * 100}vw;
              width: 10px;
              height: 10px;
              background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)]};
              z-index: 10000;
              animation: fall 3s linear forwards;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
          }, i * 50);
        }
      }, 500);

    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('حدث خطأ في تطبيق الكوبون');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('تم إلغاء الكوبون');
  };

  const handleSubmit = async () => {
    if (!validateStep(2) || !validateStep(3)) {
      toast.error('يرجى إكمال جميع المعلومات المطلوبة');
      setCurrentStep(2);
      return;
    }

    if (cartItems.length === 0) {
      toast.error('السلة فارغة');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems,
        userData,
        shippingZone: selectedShippingZone,
        subtotal,
        shippingCost,
        couponDiscount,
        freeShipping,
        total,
        totalSavings,
        appliedCoupon,
        orderNotes,
        preferredDeliveryTime,
        giftMessage: isGift ? giftMessage : '',
        isGift,
        timestamp: new Date().toISOString(),
        orderNumber: `ORD-${Date.now()}`,
        status: 'pending'
      };

      console.log('📤 [Checkout] Submitting order:', orderData);

      const response = await fetch('/.netlify/functions/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ [Checkout] Order submitted successfully:', result);
        
        // Clear cart
        localStorage.removeItem('cartItems');
        
        // Store order data for thank you page
        localStorage.setItem('lastOrder', JSON.stringify({
          ...orderData,
          id: result.id || orderData.orderNumber
        }));

        // Dispatch cart cleared event
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { items: [] } 
        }));

        toast.success('تم إرسال طلبك بنجاح! 🎉');
        
        // Redirect to thank you page
        setTimeout(() => {
          navigate('/thank-you');
        }, 1000);
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في إرسال الطلب');
      }
    } catch (error) {
      console.error('❌ [Checkout] Order submission error:', error);
      toast.error('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // Add CSS for confetti animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Show loading screen while cart is being loaded
  if (isLoadingCart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center max-w-md w-full border border-white/20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">جاري تحميل السلة...</h2>
          <p className="text-gray-600 text-lg">
            يرجى الانتظار بينما نحضر طلبك
          </p>
        </div>
      </div>
    );
  }

  // Show empty cart message if no items after loading
  if (!isLoadingCart && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center max-w-md w-full border border-white/20 transform hover:scale-105 transition-all duration-500">
          <div className="text-8xl mb-6 animate-bounce">🛒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            السلة فارغة
          </h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            يبدو أن سلة التسوق فارغة.<br/>
            اكتشف مجموعتنا الرائعة من العطور!
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
            >
              🏠 العودة للصفحة الرئيسية
            </button>
            <button
              onClick={() => navigate('/products')}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
            >
              🛍️ تصفح المنتجات
            </button>
            <button
              onClick={() => {
                // Try to reload cart from localStorage one more time
                const savedCart = localStorage.getItem('cartItems');
                console.log('🔄 [Checkout] Retry loading cart:', savedCart);
                if (savedCart) {
                  try {
                    const parsedCart = JSON.parse(savedCart);
                    if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                      setCartItems(parsedCart);
                      toast.success('تم تحديث السلة بنجاح!');
                    }
                  } catch (error) {
                    console.error('❌ [Checkout] Retry parse error:', error);
                  }
                }
              }}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-2xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
            >
              🔄 إعادة تحميل السلة
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render step content
  const renderStepContent = () => {
    // Handle empty cart case
    if (!isLoadingCart && cartItems.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              السلة فارغة
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              لا توجد منتجات في سلة التسوق حالياً. يرجى إضافة بعض المنتجات أولاً لإتمام الطلب.
            </p>
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-xl transform hover:scale-105"
              >
                <ArrowRight size={24} />
                ابدأ التسوق الآن
              </Link>
              <div>
                <Link
                  to="/cart"
                  className="text-gray-500 hover:text-gray-700 transition-colors underline"
                >
                  العودة إلى السلة
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Show loading state
    if (isLoadingCart) {
      return (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل بيانات السلة...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Order Review Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-2xl border border-blue-100">
                <ShoppingCart className="text-blue-600" size={24} />
                <span className="text-xl font-bold text-gray-800">
                  مراجعة طلبك ({cartItems.length} منتج)
                </span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-white/30 shadow-xl">
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div 
                    key={`${item.id}-${item.size || 'default'}`}
                    className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                    style={{
                      animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      {item.image && (
                        <div className="relative">
                          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                            {item.quantity}
                          </div>
                          {item.discount && (
                            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-2 py-1 text-xs font-bold shadow-lg">
                              -{item.discount}%
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h4>
                        {item.size && (
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1 rounded-full text-sm text-gray-600 mb-2">
                            <Package size={14} />
                            الحجم: {item.size}
                          </div>
                        )}
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-1 border border-gray-200 shadow-sm">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="w-10 h-10 rounded-xl bg-white shadow-sm hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="w-10 h-10 rounded-xl bg-white shadow-sm hover:bg-green-50 hover:text-green-600 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                            title="حذف المنتج"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="text-right">
                        <div className="space-y-1">
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-sm text-gray-400 line-through">
                              {(item.originalPrice * item.quantity).toFixed(2)} ريال
                            </p>
                          )}
                          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {(item.price * item.quantity).toFixed(2)} ريال
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.price.toFixed(2)} ريال × {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-6 border border-green-100 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                  <Gift className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">كوبونات الخصم</h3>
                  <p className="text-gray-600 text-sm">استخدم كوبون الخصم للحصول على توفير إضافي</p>
                </div>
              </div>
              
              {!appliedCoupon ? (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="أدخل كود الخصم"
                      className="flex-1 px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 backdrop-blur-sm text-lg font-medium transition-all duration-300"
                      disabled={isProcessing}
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!couponCode.trim() || isProcessing}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:scale-105 active:scale-95"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          جاري التحقق...
                        </div>
                      ) : (
                        'تطبيق'
                      )}
                    </button>
                  </div>
                  
                  {/* Available Coupons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableCoupons.filter(c => c.isActive).slice(0, 6).map((coupon) => (
                      <div 
                        key={coupon.code} 
                        className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95 group"
                        onClick={() => {
                          setCouponCode(coupon.code);
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                            <Percent className="text-white" size={16} />
                          </div>
                          <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {coupon.code}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{coupon.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-600 font-semibold">
                            {coupon.type === 'percentage' ? `${coupon.value}%` : 
                             coupon.type === 'fixed' ? `${coupon.value} ريال` : 'شحن مجاني'}
                          </span>
                          <span className="text-gray-500">
                            من {coupon.minAmount} ريال
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-300 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                        <Award className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-green-800 text-lg">
                          كوبون مطبق: {appliedCoupon.code}
                        </p>
                        <p className="text-green-600 text-sm">
                          {appliedCoupon.description}
                        </p>
                        <p className="text-green-700 font-semibold">
                          توفير: {couponDiscount.toFixed(2)} ريال 🎉
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                      title="إلغاء الكوبون"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 rounded-3xl p-6 border border-gray-100 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl">
                  <Calculator className="text-white" size={20} />
                </div>
                ملخص الطلب
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="font-bold text-lg">{subtotal.toFixed(2)} ريال</span>
                </div>
                
                {itemsDiscount > 0 && (
                  <div className="flex justify-between items-center py-2 text-green-600">
                    <span>خصم المنتجات:</span>
                    <span className="font-bold">-{itemsDiscount.toFixed(2)} ريال</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">الشحن:</span>
                  <span className="font-semibold">
                    {selectedShippingZone ? (
                      freeShipping ? (
                        <span className="text-green-600 font-bold">مجاني 🎉</span>
                      ) : (
                        `${shippingCost} ريال`
                      )
                    ) : (
                      'يحدد لاحقاً'
                    )}
                  </span>
                </div>
                
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between items-center py-2 text-green-600">
                    <span>خصم الكوبون ({appliedCoupon.code}):</span>
                    <span className="font-bold">-{couponDiscount.toFixed(2)} ريال</span>
                  </div>
                )}
                
                {totalSavings > 0 && (
                  <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 font-semibold">إجمالي التوفير:</span>
                      <span className="text-green-600 font-bold text-lg">
                        {totalSavings.toFixed(2)} ريال 💰
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-800">المجموع الكلي:</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {total.toFixed(2)} ريال
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Customer Information */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">معلومات العميل</h3>
                  <p className="text-gray-600">أدخل بياناتك الشخصية لإتمام الطلب</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} />
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg ${
                      errors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                    }`}
                    placeholder="أدخل اسمك الكامل"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X size={14} />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail size={16} />
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg ${
                      errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X size={14} />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={16} />
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg ${
                      errors.phone ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                    }`}
                    placeholder="05xxxxxxxx"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X size={14} />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    المدينة *
                  </label>
                  <input
                    type="text"
                    value={userData.city}
                    onChange={(e) => setUserData(prev => ({ ...prev, city: e.target.value }))}
                    className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg ${
                      errors.city ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                    }`}
                    placeholder="اسم المدينة"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X size={14} />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    المنطقة *
                  </label>
                  <select
                    value={userData.region}
                    onChange={(e) => setUserData(prev => ({ ...prev, region: e.target.value }))}
                    className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg ${
                      errors.region ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                    }`}
                  >
                    <option value="">اختر المنطقة</option>
                    <option value="riyadh">منطقة الرياض</option>
                    <option value="makkah">منطقة مكة المكرمة</option>
                    <option value="eastern">المنطقة الشرقية</option>
                    <option value="madinah">منطقة المدينة المنورة</option>
                    <option value="qassim">منطقة القصيم</option>
                    <option value="hail">منطقة حائل</option>
                    <option value="tabuk">منطقة تبوك</option>
                    <option value="northern">منطقة الحدود الشمالية</option>
                    <option value="jouf">منطقة الجوف</option>
                    <option value="asir">منطقة عسير</option>
                    <option value="baha">منطقة الباحة</option>
                    <option value="jazan">منطقة جازان</option>
                    <option value="najran">منطقة نجران</option>
                  </select>
                  {errors.region && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X size={14} />
                      {errors.region}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الرمز البريدي
                  </label>
                  <input
                    type="text"
                    value={userData.postalCode}
                    onChange={(e) => setUserData(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg"
                    placeholder="12345"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Home size={16} />
                    العنوان التفصيلي *
                  </label>
                  <textarea
                    value={userData.address}
                    onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                    rows={4}
                    className={`w-full px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 resize-none text-lg ${
                      errors.address ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                    }`}
                    placeholder="الحي، الشارع، رقم المبنى، رقم الشقة، أي معالم مميزة..."
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <X size={14} />
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    رقم المبنى
                  </label>
                  <input
                    type="text"
                    value={userData.buildingNumber}
                    onChange={(e) => setUserData(prev => ({ ...prev, buildingNumber: e.target.value }))}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg"
                    placeholder="123"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    رقم الشقة
                  </label>
                  <input
                    type="text"
                    value={userData.apartment}
                    onChange={(e) => setUserData(prev => ({ ...prev, apartment: e.target.value }))}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 text-lg"
                    placeholder="4أ"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            {/* Shipping Zones */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                  <Truck className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">اختر طريقة الشحن</h3>
                  <p className="text-gray-600">اختر الطريقة المناسبة لك</p>
                </div>
              </div>
              
              {errors.shipping && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-red-600 font-semibold flex items-center gap-2">
                    <X size={16} />
                    {errors.shipping}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {shippingZones.map((zone, index) => (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedShippingZone(zone)}
                    className={`cursor-pointer rounded-3xl p-6 border-2 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 ${
                      selectedShippingZone?.id === zone.id
                        ? `border-green-500 bg-gradient-to-br ${zone.color} shadow-2xl scale-105`
                        : 'border-gray-200 bg-white/70 backdrop-blur-sm hover:border-green-300'
                    }`}
                    style={{
                      animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`text-3xl p-3 rounded-2xl ${
                          selectedShippingZone?.id === zone.id 
                            ? 'bg-white/20 backdrop-blur-sm' 
                            : 'bg-gray-100'
                        }`}>
                          {zone.icon}
                        </div>
                        <div>
                          <h4 className={`font-bold text-lg ${
                            selectedShippingZone?.id === zone.id ? 'text-white' : 'text-gray-800'
                          }`}>
                            {zone.name}
                          </h4>
                          <p className={`text-sm flex items-center gap-1 ${
                            selectedShippingZone?.id === zone.id ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            <Clock size={14} />
                            {zone.estimatedDays}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {subtotal >= (zone.freeShippingThreshold || 0) ? (
                          <div className="text-center">
                            <p className={`text-2xl font-bold ${
                              selectedShippingZone?.id === zone.id ? 'text-white' : 'text-green-600'
                            }`}>
                              مجاني! 🎉
                            </p>
                            <p className={`text-sm line-through ${
                              selectedShippingZone?.id === zone.id ? 'text-white/60' : 'text-gray-400'
                            }`}>
                              {zone.price} ريال
                            </p>
                          </div>
                        ) : (
                          <p className={`text-2xl font-bold ${
                            selectedShippingZone?.id === zone.id ? 'text-white' : 'text-green-600'
                          }`}>
                            {zone.price} ريال
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className={`text-sm ${
                        selectedShippingZone?.id === zone.id ? 'text-white/90' : 'text-gray-600'
                      }`}>
                        يشمل: {zone.regions.join('، ')}
                      </p>
                      
                      {zone.freeShippingThreshold && subtotal < zone.freeShippingThreshold && (
                        <div className={`text-xs p-2 rounded-xl ${
                          selectedShippingZone?.id === zone.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-blue-50 text-blue-600'
                        }`}>
                          شحن مجاني عند الشراء بـ {zone.freeShippingThreshold} ريال أو أكثر
                          <br />
                          (يتبقى {(zone.freeShippingThreshold - subtotal).toFixed(2)} ريال)
                        </div>
                      )}
                    </div>
                    
                    {selectedShippingZone?.id === zone.id && (
                      <div className="mt-4 flex items-center gap-2 text-white">
                        <CheckCircle size={20} />
                        <span className="font-bold">تم الاختيار</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                  <CreditCard className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">طريقة الدفع</h3>
                  <p className="text-gray-600">اختر طريقة الدفع المناسبة</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="text-white" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-800">الدفع عند الاستلام</h4>
                    <p className="text-gray-600">ادفع نقداً عند وصول الطلب إليك</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <Shield className="text-green-600 mt-1" size={20} />
                      <div>
                        <p className="font-bold text-green-800 text-sm">دفع آمن</p>
                        <p className="text-green-600 text-xs">لا حاجة لبطاقة ائتمان</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="text-green-600 mt-1" size={20} />
                      <div>
                        <p className="font-bold text-green-800 text-sm">فحص المنتج</p>
                        <p className="text-green-600 text-xs">افحص قبل الدفع</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Heart className="text-green-600 mt-1" size={20} />
                      <div>
                        <p className="font-bold text-green-800 text-sm">إرجاع سهل</p>
                        <p className="text-green-600 text-xs">إمكانية الإرجاع فوري</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Gift className="text-purple-600" />
                خيارات إضافية
              </h3>
              
              <div className="space-y-6">
                {/* Preferred Delivery Time */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar size={16} />
                    الوقت المفضل للتوصيل
                  </label>
                  <select
                    value={preferredDeliveryTime}
                    onChange={(e) => setPreferredDeliveryTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="">اختر الوقت المفضل (اختياري)</option>
                    {deliveryTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                {/* Gift Option */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="font-semibold text-gray-800 flex items-center gap-2">
                      <Gift size={16} className="text-purple-600" />
                      هذا الطلب هدية
                    </span>
                  </label>
                  
                  {isGift && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-200">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        رسالة الهدية (اختياري)
                      </label>
                      <textarea
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 resize-none"
                        placeholder="اكتب رسالة جميلة للمهدى إليه..."
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {giftMessage.length}/200 حرف
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Notes */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    ملاحظات خاصة (اختياري)
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 resize-none"
                    placeholder="أي ملاحظات خاصة بالطلب أو التوصيل..."
                    maxLength={300}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {orderNotes.length}/300 حرف
                  </p>
                </div>
              </div>
            </div>

            {/* Final Order Summary */}
            <div className="bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 rounded-3xl p-8 border border-gray-100 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-gray-600 to-slate-600 rounded-2xl">
                  <Calculator className="text-white" size={24} />
                </div>
                ملخص الطلب النهائي
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 text-lg">المجموع الفرعي:</span>
                  <span className="font-bold text-xl">{subtotal.toFixed(2)} ريال</span>
                </div>
                
                {itemsDiscount > 0 && (
                  <div className="flex justify-between items-center py-3 text-green-600 border-b border-gray-200">
                    <span className="text-lg">خصم المنتجات:</span>
                    <span className="font-bold text-xl">-{itemsDiscount.toFixed(2)} ريال</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 text-lg">
                    الشحن ({selectedShippingZone?.name}):
                  </span>
                  <span className="font-bold text-xl">
                    {freeShipping ? (
                      <span className="text-green-600">مجاني 🎉</span>
                    ) : (
                      `${shippingCost} ريال`
                    )}
                  </span>
                </div>
                
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between items-center py-3 text-green-600 border-b border-gray-200">
                    <span className="text-lg">خصم الكوبون ({appliedCoupon.code}):</span>
                    <span className="font-bold text-xl">-{couponDiscount.toFixed(2)} ريال</span>
                  </div>
                )}
                
                {totalSavings > 0 && (
                  <div className="bg-green-50 rounded-2xl p-4 border border-green-200 my-4">
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 font-semibold">إجمالي التوفير:</span>
                      <span className="text-green-600 font-bold text-lg">
                        {totalSavings.toFixed(2)} ريال 💰
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="border-t-2 border-gray-300 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-gray-800">المجموع الكلي:</span>
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {total.toFixed(2)} ريال
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 rounded-2xl border border-green-100">
                <CheckCircle className="text-green-600" size={24} />
                <span className="text-2xl font-bold text-gray-800">
                  مراجعة نهائية وإرسال الطلب
                </span>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-xl">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <CheckCircle className="text-white" size={48} />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  جاهز لإتمام الطلب! 🎉
                </h3>
                
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  تأكد من صحة جميع البيانات أدناه قبل تأكيد الطلب.<br/>
                  سيتم إرسال رسالة تأكيد إلى بريدك الإلكتروني.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customer Information */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                  <h4 className="font-bold text-gray-800 mb-4 text-xl flex items-center gap-2">
                    <User className="text-blue-600" size={20} />
                    معلومات العميل
                  </h4>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-semibold">الاسم:</span>
                      <span>{userData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">الهاتف:</span>
                      <span>{userData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">البريد:</span>
                      <span className="text-sm">{userData.email}</span>
                    </div>
                  </div>
                </div>
                
                {/* Delivery Information */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <h4 className="font-bold text-gray-800 mb-4 text-xl flex items-center gap-2">
                    <MapPin className="text-green-600" size={20} />
                    عنوان التوصيل
                  </h4>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-semibold">المدينة:</span>
                      <span>{userData.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">المنطقة:</span>
                      <span>{userData.region}</span>
                    </div>
                    <div>
                      <span className="font-semibold">العنوان التفصيلي:</span>
                      <p className="text-sm mt-1 text-gray-600">{userData.address}</p>
                    </div>
                  </div>
                </div>
                
                {/* Shipping Information */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h4 className="font-bold text-gray-800 mb-4 text-xl flex items-center gap-2">
                    <Truck className="text-purple-600" size={20} />
                    معلومات الشحن
                  </h4>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-semibold">طريقة الشحن:</span>
                      <span className="text-sm">{selectedShippingZone?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">مدة التوصيل:</span>
                      <span>{selectedShippingZone?.estimatedDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">تكلفة الشحن:</span>
                      <span className={freeShipping ? 'text-green-600 font-bold' : ''}>
                        {freeShipping ? 'مجاني 🎉' : `${shippingCost} ريال`}
                      </span>
                    </div>
                    {preferredDeliveryTime && (
                      <div className="flex justify-between">
                        <span className="font-semibold">الوقت المفضل:</span>
                        <span className="text-sm">{preferredDeliveryTime}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Payment Information */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                  <h4 className="font-bold text-gray-800 mb-4 text-xl flex items-center gap-2">
                    <CreditCard className="text-orange-600" size={20} />
                    معلومات الدفع
                  </h4>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-semibold">طريقة الدفع:</span>
                      <span>الدفع عند الاستلام</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">المبلغ المطلوب:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {total.toFixed(2)} ريال
                      </span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="font-semibold">إجمالي التوفير:</span>
                        <span className="font-bold">
                          {totalSavings.toFixed(2)} ريال 💰
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Options */}
              {(isGift || orderNotes) && (
                <div className="mt-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-100">
                  <h4 className="font-bold text-gray-800 mb-4 text-xl flex items-center gap-2">
                    <Star className="text-yellow-600" size={20} />
                    خيارات خاصة
                  </h4>
                  <div className="space-y-3 text-gray-700">
                    {isGift && (
                      <div>
                        <p className="font-semibold text-purple-600 mb-2">🎁 هذا الطلب هدية</p>
                        {giftMessage && (
                          <div className="bg-white/70 rounded-xl p-3 border border-purple-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">رسالة الهدية:</span><br/>
                              "{giftMessage}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {orderNotes && (
                      <div>
                        <p className="font-semibold mb-2">📝 ملاحظات خاصة:</p>
                        <div className="bg-white/70 rounded-xl p-3 border border-gray-200">
                          <p className="text-sm text-gray-600">"{orderNotes}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Final Action */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-16 py-5 rounded-3xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl shadow-2xl transform hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      جاري إرسال الطلب...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap size={24} />
                      تأكيد الطلب الآن
                      <span className="text-2xl">🚀</span>
                    </div>
                  )}
                </button>
                
                <p className="text-gray-500 text-sm mt-4">
                  بالضغط على "تأكيد الطلب" فإنك توافق على شروط الخدمة وسياسة الخصوصية
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step content not implemented yet</div>;
    }
  };

  // Add slide-in animation CSS
  useEffect(() => {
    const slideInStyle = document.createElement('style');
    slideInStyle.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(slideInStyle);
    
    return () => {
      if (document.head.contains(slideInStyle)) {
        document.head.removeChild(slideInStyle);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 via-pink-50 to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            إتمام الطلب
          </h1>
          <p className="text-gray-600 text-xl leading-relaxed">
            اتبع الخطوات البسيطة لإكمال طلبك بسهولة وأمان<br/>
            نحن هنا لنجعل تجربة التسوق مميزة لك ✨
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-12 border border-white/20">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all duration-500 ${
                  currentStep >= step.id
                    ? `bg-gradient-to-r ${step.color} border-transparent text-white shadow-2xl scale-110`
                    : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle size={28} />
                  ) : (
                    <step.icon size={28} />
                  )}
                  {currentStep === step.id && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-75 animate-pulse"></div>
                  )}
                </div>
                <div className="mr-4 text-right">
                  <p className={`font-semibold text-sm transition-colors duration-300 ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-2 mx-6 rounded-full transition-all duration-500 ${
                    currentStep > step.id 
                      ? `bg-gradient-to-r ${step.color}` 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="bg-gray-50/80 backdrop-blur-sm px-8 py-6 flex justify-between items-center border-t border-gray-200/50">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-3 px-8 py-4 text-gray-600 hover:text-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg hover:bg-white/50 rounded-2xl"
            >
              <ArrowLeft size={24} />
              السابق
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-2xl transform hover:scale-105"
              >
                التالي
                <ArrowRight size={24} />
              </button>
            ) : (
              <div className="text-gray-500 text-sm">
                اضغط "تأكيد الطلب" أعلاه لإكمال الطلب 👆
              </div>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="text-green-600" size={20} />
              <span className="font-semibold">دفع آمن</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="text-blue-600" size={20} />
              <span className="font-semibold">توصيل سريع</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="text-red-600" size={20} />
              <span className="font-semibold">ضمان الجودة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
