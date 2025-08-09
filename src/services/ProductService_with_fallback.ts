import { supabase } from '../lib/supabase';
import type { Product } from '../types/product';
import { transformInventoryItemToProduct } from '../types/product';

export class ProductService {
  /**
   * Fetch all active website products from inventory view (with fallback)
   */
  static async fetchWebsiteProducts(): Promise<Product[]> {
    try {
      // Try inventory_item_view first
      let { data, error } = await supabase
        .from('inventory_item_view')
        .select('*')
        .order('name', { ascending: true });

      // If view doesn't exist, fallback to direct table access
      if (error && error.code === '42P01') {
        console.warn('inventory_item_view not found, using direct table access');
        ({ data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('is_website_item', true)
          .eq('is_active', true)
          .order('name', { ascending: true }));
      }

      if (error) {
        console.error('Error fetching website products:', error);
        return [];
      }

      return data?.map(transformInventoryItemToProduct) || [];
    } catch (error) {
      console.error('Failed to fetch website products:', error);
      return [];
    }
  }

  /**
   * Fetch featured products from inventory view (with fallback)
   */
  static async fetchFeaturedProducts(): Promise<Product[]> {
    try {
      // Try inventory_item_view first
      let { data, error } = await supabase
        .from('inventory_item_view')
        .select('*')
        .eq('is_featured', true)
        .order('name', { ascending: true });

      // If view doesn't exist, fallback to direct table access
      if (error && error.code === '42P01') {
        console.warn('inventory_item_view not found, using direct table access');
        ({ data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('is_website_item', true)
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('name', { ascending: true }));
      }

      if (error) {
        console.error('Error fetching featured products:', error);
        return [];
      }

      return data?.map(transformInventoryItemToProduct) || [];
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      return [];
    }
  }

  /**
   * Fetch products by category from inventory view (with fallback)
   */
  static async fetchProductsByCategory(category: string): Promise<Product[]> {
    try {
      // Try inventory_item_view first
      let { data, error } = await supabase
        .from('inventory_item_view')
        .select('*')
        .eq('category', category)
        .order('name', { ascending: true });

      // If view doesn't exist, fallback to direct table access
      if (error && error.code === '42P01') {
        console.warn('inventory_item_view not found, using direct table access');
        ({ data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('is_website_item', true)
          .eq('is_active', true)
          .eq('category', category)
          .order('name', { ascending: true }));
      }

      if (error) {
        console.error('Error fetching products by category:', error);
        return [];
      }

      return data?.map(transformInventoryItemToProduct) || [];
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      return [];
    }
  }

  /**
   * Fetch product by ID from inventory view (with fallback)
   */
  static async fetchProductById(id: string): Promise<Product | null> {
    try {
      // Try inventory_item_view first
      let { data, error } = await supabase
        .from('inventory_item_view')
        .select('*')
        .eq('id', id)
        .single();

      // If view doesn't exist, fallback to direct table access
      if (error && error.code === '42P01') {
        console.warn('inventory_item_view not found, using direct table access');
        ({ data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('id', id)
          .eq('is_website_item', true)
          .eq('is_active', true)
          .single());
      }

      if (error) {
        console.error('Error fetching product by ID:', error);
        return null;
      }

      return data ? transformInventoryItemToProduct(data) : null;
    } catch (error) {
      console.error('Failed to fetch product by ID:', error);
      return null;
    }
  }

  /**
   * Search products by name or description from inventory view (with fallback)
   */
  static async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      // Try inventory_item_view first
      let { data, error } = await supabase
        .from('inventory_item_view')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,search_keywords.ilike.%${searchTerm}%`)
        .order('name', { ascending: true });

      // If view doesn't exist, fallback to direct table access
      if (error && error.code === '42P01') {
        console.warn('inventory_item_view not found, using direct table access');
        ({ data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('is_website_item', true)
          .eq('is_active', true)
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,search_keywords.ilike.%${searchTerm}%`)
          .order('name', { ascending: true }));
      }

      if (error) {
        console.error('Error searching products:', error);
        return [];
      }

      return data?.map(transformInventoryItemToProduct) || [];
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  }
}
