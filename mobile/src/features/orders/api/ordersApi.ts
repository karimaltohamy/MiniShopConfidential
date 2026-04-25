import { apiClient } from '../../../lib/api/client';

export interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderData {
  items: OrderItem[];
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
  order_items: {
    id: string;
    quantity: number;
    unit_price: number;
    products: {
      id: string;
      name: string;
      image_url?: string;
    };
  }[];
}

export const ordersApi = {
  async createOrder(data: CreateOrderData) {
    const { data: order } = await apiClient.post<Order>('/orders', data);
    return order;
  },

  async getMyOrders() {
    const { data } = await apiClient.get<Order[]>('/orders/my');
    return data;
  },

  async getOrderById(id: string) {
    const { data } = await apiClient.get<Order>(`/orders/${id}`);
    return data;
  },
};
