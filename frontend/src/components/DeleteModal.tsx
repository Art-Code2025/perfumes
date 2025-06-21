import React from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  type: 'product' | 'category' | 'order' | 'customer' | 'coupon' | 'shippingZone';
  loading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  type,
  loading = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'product': return '📦';
      case 'category': return '📂';
      case 'order': return '🛒';
      case 'customer': return '👤';
      case 'coupon': return '🎫';
      case 'shippingZone': return '🚚';
      default: return '🗑️';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'product': return 'from-blue-500 to-blue-600';
      case 'category': return 'from-orange-500 to-orange-600';
      case 'order': return 'from-purple-500 to-purple-600';
      case 'customer': return 'from-green-500 to-green-600';
      case 'coupon': return 'from-pink-500 to-pink-600';
      case 'shippingZone': return 'from-indigo-500 to-indigo-600';
      default: return 'from-red-500 to-red-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl transition-all w-full max-w-sm sm:max-w-md">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getColor()} px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-white`}>
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl mr-3 sm:mr-4">
                {getIcon()}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
                <p className="text-xs sm:text-sm opacity-90">تأكيد عملية الحذف</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <p className="text-gray-700 text-base sm:text-lg font-medium mb-2">{message}</p>
              
              {itemName && (
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">العنصر المحدد:</p>
                  <p className="font-bold text-gray-800 text-base sm:text-lg">{itemName}</p>
                </div>
              )}
              
              <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center text-red-700">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium">تحذير: لا يمكن التراجع عن هذا الإجراء</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 h-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                  <span className="hidden sm:inline">جاري الحذف...</span>
                  <span className="sm:hidden">حذف...</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden sm:inline">تأكيد الحذف</span>
                  <span className="sm:hidden">حذف</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal; 