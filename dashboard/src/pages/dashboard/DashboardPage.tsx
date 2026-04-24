import { useDashboardStats, useOrders } from '@/features/orders/hooks/useOrders';
import { useProducts } from '@/features/products/hooks/useProducts';
import KPICard from '@/components/shared/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { OrderStatus } from '@/types';

const statusVariants: Record<OrderStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'error',
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 5 });

  const isLoading = statsLoading || productsLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

   const products = productsData?.data || [];
  const orders = ordersData?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your store.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          change={stats?.revenueChange}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <KPICard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          change={stats?.ordersChange}
          icon={ShoppingCart}
          iconColor="text-blue-600"
        />
        <KPICard
          title="Total Products"
          value={products.length}
          icon={Package}
          iconColor="text-purple-600"
        />
        <KPICard
          title="Growth"
          value={`${stats?.revenueChange || 0}%`}
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No orders yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                     <TableCell>{order.profiles?.name || order.user_id?.slice(0, 8) || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[order.status]}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.total_amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(order.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
