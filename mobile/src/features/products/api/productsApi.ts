import { apiClient } from '../../../lib/api/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: string;
  is_active: boolean;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const productsApi = {
  async getProducts(params?: { search?: string; category_id?: string }) {
    const { data } = await apiClient.get<Product[]>('/products', { params });
    return data;
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
