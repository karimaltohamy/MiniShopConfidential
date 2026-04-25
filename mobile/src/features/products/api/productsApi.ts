import { apiClient } from '../../../lib/api/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: string;
  is_active: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  // Enhanced fields for modern UI
  rating?: number;
  review_count?: number;
  original_price?: number;
  is_new?: boolean;
  is_featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export const productsApi = {
  async getProducts(params?: { search?: string; category_id?: string; page?: string; limit?: string }) {
    console.log('productsApi.getProducts called with params:', params);
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
      console.log('productsApi response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('productsApi error:', error.message, error.response?.data);
      throw error;
    }
  },

  async getProduct(id: string) {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  async getCategories() {
    const { data } = await apiClient.get<Category[]>('/products/categories');
    return data;
  },
};
