import { useDashboardStats, useOrders } from '@/features/orders/hooks/useOrders';
import { useProducts } from '@/features/products/hooks/useProducts';
import KPICard from '@/components/shared/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { DollarSign, ShoppingCart, Package, TrendingUp, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { OrderStatus } from '@/types';
import { useNavigate } from 'react-router-dom';

const statusVariants: Record<OrderStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'error',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 5 });

  const isLoading = statsLoading || productsLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-6 text-base font-medium text-muted-foreground">Loading dashboard...</p>
          <p className="mt-2 text-sm text-muted-foreground">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  const products = productsData?.data || [];
  const orders = ordersData?.data || [];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's an overview of your store performance.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
          title="Growth Rate"
          value={`${stats?.revenueChange || 0}%`}
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/orders')}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-lg font-semibold">No orders yet</h3>
              <p className="text-sm text-muted-foreground">
                Orders will appear here when customers make purchases
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
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
                    <TableRow
                      key={order.id}
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => navigate('/orders')}
                    >
                      <TableCell className="font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.profiles?.name || order.user_id?.slice(0, 8) || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(order.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
