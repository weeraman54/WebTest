import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

export interface ToastType {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 6000); // Updated to 6 seconds

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bgColor: 'bg-white',
          borderColor: 'border-l-4 border-l-[#13ee9e]',
          iconColor: 'text-[#13ee9e]',
          icon: CheckCircleIcon
        };
      case 'error':
        return {
          bgColor: 'bg-white',
          borderColor: 'border-l-4 border-l-red-500',
          iconColor: 'text-red-500',
          icon: XCircleIcon
        };
      case 'warning':
        return {
          bgColor: 'bg-white',
          borderColor: 'border-l-4 border-l-amber-500',
          iconColor: 'text-amber-500',
          icon: ExclamationTriangleIcon
        };
      case 'info':
        return {
          bgColor: 'bg-white',
          borderColor: 'border-l-4 border-l-blue-500',
          iconColor: 'text-blue-500',
          icon: InformationCircleIcon
        };
      default:
        return {
          bgColor: 'bg-white',
          borderColor: 'border-l-4 border-l-gray-500',
          iconColor: 'text-gray-500',
          icon: InformationCircleIcon
        };
    }
  };

  const styles = getToastStyles();
  const IconComponent = styles.icon;

  return (
    <div
      className={`
        ${styles.bgColor} ${styles.borderColor}
        shadow-lg border border-gray-200 rounded-lg p-4 mb-3
        transform transition-all duration-300 ease-in-out
        hover:shadow-xl max-w-sm w-full
      `}
    >
      <div className="flex items-start">
        <IconComponent className={`w-5 h-5 ${styles.iconColor} mt-0.5 flex-shrink-0`} />
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900 leading-relaxed">
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastType[];
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{ 
              transform: `translateY(${index * 8}px)`,
              zIndex: 1000 - index 
            }}
          >
            <Toast
              toast={toast}
              onClose={onRemoveToast}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (message: string, type: ToastType['type'] = 'info', duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastType = {
      id,
      message,
      type,
      duration
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess: (message: string, duration?: number) => addToast(message, 'success', duration),
    showError: (message: string, duration?: number) => addToast(message, 'error', duration),
    showWarning: (message: string, duration?: number) => addToast(message, 'warning', duration),
    showInfo: (message: string, duration?: number) => addToast(message, 'info', duration),
  };
};

export default Toast;
