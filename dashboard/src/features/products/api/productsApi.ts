import { apiClient } from '@/lib/api';
import { Product, Category, CreateProductInput, UpdateProductInput } from '@/types';

export const productsApi = {
  async getProducts(params?: { search?: string; category?: string }) {
    const { data } = await apiClient.get<Product[]>('/products', { params });
    return data;
  },

  async getProduct(id: string) {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  async createProduct(input: CreateProductInput) {
    const { data } = await apiClient.post<Product>('/products', input);
    return data;
  },

  async updateProduct(id: string, input: UpdateProductInput) {
    const { data } = await apiClient.patch<Product>(`/products/${id}`, input);
    return data;
  },

  async deleteProduct(id: string) {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data;
  },

  async getCategories() {
    const { data } = await apiClient.get<Category[]>('/products/categories');
    return data;
  },
};
