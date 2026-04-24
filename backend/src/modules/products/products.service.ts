import { supabase } from '../../config/supabase';
import { CreateProductInput, UpdateProductInput, ProductQuery } from '../../schemas/product.schema';
import { NotFoundError } from '../../utils/errors';

export class ProductsService {
  async getProducts(filters: ProductQuery) {
    const { search, category_id, page, limit } = filters;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('products')
      .select(`
        *,
        categories(id, name, slug)
      `, { count: 'exact' })
      .eq('is_active', true);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Transform: rename 'categories' to 'category' and remove 'categories'
    const transformedData = data?.map((product: any) => {
      const { categories, ...rest } = product;
      return { ...rest, category: categories };
    }) || [];

    return {
      data: transformedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  async getAllProducts(filters: ProductQuery) {
    const { search, category_id, page, limit } = filters;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('products')
      .select(`
        *,
        categories(id, name, slug)
      `, { count: 'exact' });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Transform: rename 'categories' to 'category' and remove 'categories'
    const transformedData = data?.map((product: any) => {
      const { categories, ...rest } = product;
      return { ...rest, category: categories };
    }) || [];

    return {
      data: transformedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(id, name, slug)
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Transform: rename 'categories' to 'category' and remove 'categories'
    if (data) {
      const { categories, ...rest } = data as any;
      return { ...rest, category: categories };
    }
    return null;
  }

  async createProduct(input: CreateProductInput) {
    const { data, error } = await supabase
      .from('products')
      .insert(input)
      .select(`
        *,
        categories(id, name, slug)
      `)
      .single();

    if (error) {
      throw error;
    }

    // Transform: rename 'categories' to 'category' and remove 'categories'
    if (data) {
      const { categories, ...rest } = data as any;
      return { ...rest, category: categories };
    }
    return data;
  }

  async updateProduct(id: string, input: UpdateProductInput) {
    const { data, error } = await supabase
      .from('products')
      .update(input)
      .eq('id', id)
      .select(`
        *,
        categories(id, name, slug)
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Product not found');
      }
      throw error;
    }

    // Transform: rename 'categories' to 'category' and remove 'categories'
    if (data) {
      const { categories, ...rest } = data as any;
      return { ...rest, category: categories };
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
