import { supabase } from '../../config/supabase';
import { CreateProductInput, UpdateProductInput, ProductQuery } from '../../schemas/product.schema';
import { NotFoundError } from '../../utils/errors';

export class ProductsService {
  async getProducts(filters: ProductQuery) {
    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .eq('is_active', true);

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  async getAllProducts(filters: ProductQuery) {
    // Admin version - shows all products including inactive
    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug)');

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }

  async createProduct(input: CreateProductInput) {
    const { data, error } = await supabase
      .from('products')
      .insert(input)
      .select('*, categories(id, name, slug)')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updateProduct(id: string, input: UpdateProductInput) {
    const { data, error } = await supabase
      .from('products')
      .update(input)
      .eq('id', id)
      .select('*, categories(id, name, slug)')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Product not found');
      }
      throw error;
    }

    return data;
  }

  async deleteProduct(id: string) {
    // Soft delete - set is_active to false
    const { data, error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Product not found');
      }
      throw error;
    }

    return data;
  }

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return data;
  }
}
