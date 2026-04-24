import { apiClient } from '@/lib/api';
import { Order, PaginatedResponse, UpdateOrderStatusInput } from '@/types';

export const ordersApi = {
  async getOrders(params?: { page?: number; limit?: number; status?: string }) {
    const { data } = await apiClient.get<PaginatedResponse<Order>>('/orders', { params });
    return data;
  },

  async updateOrderStatus(id: string, input: UpdateOrderStatusInput) {
    const { data } = await apiClient.patch<Order>(`/orders/${id}/status`, input);
    return data;
  },

  async getDashboardStats() {
    // This would typically be a separate endpoint, but we'll aggregate from orders
    const { data } = await apiClient.get<PaginatedResponse<Order>>('/orders', {
      params: { limit: 100 },
    });

    const orders = data.data;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

    // Calculate stats for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = orders.filter(
      (order) => new Date(order.created_at) >= thirtyDaysAgo
    );
    const recentRevenue = recentOrders.reduce((sum, order) => sum + order.total_amount, 0);

    // Calculate previous 30 days for comparison
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const previousOrders = orders.filter(
      (order) =>
        new Date(order.created_at) >= sixtyDaysAgo &&
        new Date(order.created_at) < thirtyDaysAgo
    );
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total_amount, 0);

    const revenueChange =
      previousRevenue > 0
        ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    const ordersChange =
      previousOrders.length > 0
        ? ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100
        : 0;

    return {
      totalRevenue,
      totalOrders,
      revenueChange: Math.round(revenueChange),
      ordersChange: Math.round(ordersChange),
    };
  },
};
