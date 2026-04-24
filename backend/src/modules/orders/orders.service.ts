import { supabase } from '../../config/supabase';
import { CreateOrderInput, UpdateOrderStatusInput, OrderQuery } from '../../schemas/order.schema';
import { NotFoundError } from '../../utils/errors';

export class OrdersService {
  async createOrder(userId: string, input: CreateOrderInput) {
    // Calculate total amount
    const totalAmount = input.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items
    const orderItems = input.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw itemsError;
    }

    // Fetch complete order with items
    return this.getOrder(order.id);
  }

  async getOrder(orderId: string) {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            image_url
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Order not found');
      }
      throw error;
    }

    return order;
  }

  async getMyOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            image_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  async getAllOrders(query: OrderQuery) {
    const { status, page, limit } = query;
    const offset = (page - 1) * limit;

    let dbQuery = supabase
      .from('orders')
      .select(`
        *,
        profiles (
          name,
          email
        ),
        order_items (
          *,
          products (
            id,
            name,
            image_url
          )
        )
      `, { count: 'exact' });

    if (status) {
      dbQuery = dbQuery.eq('status', status);
    }

    const { data, error, count } = await dbQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return {
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  async updateOrderStatus(orderId: string, input: UpdateOrderStatusInput) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: input.status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Order not found');
      }
      throw error;
    }

    return data;
  }
}
