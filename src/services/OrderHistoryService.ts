import { supabase } from '../lib/supabase';

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sku: string;
}

export interface OrderHistory {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  order_date: string;
  total_amount: number;
  payment_method: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  customer_email: string;
  customer_phone: string;
  delivery_instructions: string;
  customer_name: string;
  user_email: string;
  order_items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export class OrderHistoryService {
  /**
   * Fetch order history for a user by email
   */
  static async fetchOrderHistory(userEmail: string): Promise<{
    success: boolean;
    orders: OrderHistory[];
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('website_orders_for_erp')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching order history:', error);
        return {
          success: false,
          orders: [],
          error: error.message
        };
      }

      return {
        success: true,
        orders: data || []
      };
    } catch (error) {
      console.error('Error fetching order history:', error);
      return {
        success: false,
        orders: [],
        error: error instanceof Error ? error.message : 'Failed to fetch order history'
      };
    }
  }

  /**
   * Fetch single order details by order ID
   */
  static async fetchOrderDetails(orderId: string): Promise<{
    success: boolean;
    order: OrderHistory | null;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('website_orders_for_erp')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order details:', error);
        return {
          success: false,
          order: null,
          error: error.message
        };
      }

      return {
        success: true,
        order: data
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
      return {
        success: false,
        order: null,
        error: error instanceof Error ? error.message : 'Failed to fetch order details'
      };
    }
  }

  /**
   * Get order status steps for stepper
   */
  static getOrderStatusSteps(status: string): {
    steps: { label: string; status: 'completed' | 'current' | 'upcoming' }[];
    currentStep: number;
  } {
    const allSteps = [
      { label: 'Pending', key: 'pending' },
      { label: 'Confirmed', key: 'confirmed' },
      { label: 'Shipped', key: 'shipped' },
      { label: 'Delivered', key: 'delivered' }
    ];

    const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentStatusIndex = statusOrder.indexOf(status);

    const steps = allSteps.map((step, index) => ({
      label: step.label,
      status: index < currentStatusIndex ? 'completed' as const :
              index === currentStatusIndex ? (status === 'delivered' ? 'completed' as const : 'current' as const) :
              'upcoming' as const
    }));

    return {
      steps,
      currentStep: currentStatusIndex
    };
  }

  /**
   * Format order date for display
   */
  static formatOrderDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get status color for badges
   */
  static getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}

export default OrderHistoryService;
