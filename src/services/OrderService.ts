import { supabase } from '../lib/supabase';

export interface Order {
  id: string;
  customer_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'delivered' | 'cancelled';
  total_amount: number;
  order_date: string;
  created_at: string;
  updated_at: string;
}

export class OrderService {
  /**
   * Fetch all orders for a specific customer
   */
  static async fetchCustomerOrders(customer_email: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
    try {
      const { data: orders, error } = await supabase
        .from('website_orders_for_erp')
        .select('*')
        .eq('customer_email', customer_email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customer orders:', error);
        return { success: false, error: error.message };
      }

      return { success: true, orders: orders || [] };
    } catch (error) {
      console.error('Unexpected error fetching orders:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch orders' 
      };
    }
  }

  /**
   * Check if user can edit account details based on order status
   * Returns true only if ALL orders are completed, delivered, or cancelled
   */
  static async canEditAccountDetails(customerId: string): Promise<{ canEdit: boolean; error?: string }> {
    try {
      const result = await this.fetchCustomerOrders(customerId);
      
      if (!result.success) {
        return { canEdit: false, error: result.error };
      }

      const orders = result.orders || [];
      
      // If no orders, allow editing
      if (orders.length === 0) {
        return { canEdit: true };
      }

      // Check if ALL orders are either completed, delivered, or cancelled
      const allowedStatuses = ['completed', 'delivered', 'cancelled'];
      const restrictiveOrders = orders.filter(order => 
        !allowedStatuses.includes(order.status)
      );

      return { canEdit: restrictiveOrders.length === 0 };
    } catch (error) {
      console.error('Error checking edit permissions:', error);
      return { 
        canEdit: false, 
        error: error instanceof Error ? error.message : 'Failed to check permissions' 
      };
    }
  }

  /**
   * Get pending orders count for display
   */
  static async getPendingOrdersCount(customerId: string): Promise<{ count: number; error?: string }> {
    try {
      const result = await this.fetchCustomerOrders(customerId);
      
      if (!result.success) {
        return { count: 0, error: result.error };
      }

      const orders = result.orders || [];
      const pendingCount = orders.filter(order => 
        order.status !== 'completed' && order.status !== 'delivered' && order.status !== 'cancelled'
      ).length;

      return { count: pendingCount };
    } catch (error) {
      console.error('Error getting pending orders count:', error);
      return { 
        count: 0, 
        error: error instanceof Error ? error.message : 'Failed to get orders count' 
      };
    }
  }
}

export default OrderService;
