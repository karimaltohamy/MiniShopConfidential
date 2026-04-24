import { useState } from 'react';
import { useOrders, useUpdateOrderStatus } from '@/features/orders/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/shared/Pagination';
import EmptyState from '@/components/shared/EmptyState';
import { ShoppingCart, Eye, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';
import OrderDetailsModal from '@/features/orders/components/OrderDetailsModal';
import UpdateStatusModal from '@/features/orders/components/UpdateStatusModal';

const statusVariants: Record<OrderStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'error',
};

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');

  const { data: ordersData, isLoading } = useOrders({
    page: currentPage,
    limit: 10,
    status: statusFilter || undefined,
  });

  const updateOrderStatus = useUpdateOrderStatus();

  const openDetailsDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const openStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrderStatus.mutateAsync({
        id: selectedOrder.id,
        input: { status: newStatus },
      });
      setIsStatusDialogOpen(false);
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  const orders = ordersData?.data || [];
  const pagination = ordersData?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="w-64">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({pagination?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="No orders found"
              description={
                statusFilter
                  ? 'No orders match the selected filter'
                  : 'Orders will appear here when customers make purchases'
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                       <TableCell>{order.profiles?.name || 'N/A'}</TableCell>
                      <TableCell>{order.order_items?.length || 0}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(order.created_at)}
                      </TableCell>
                       <TableCell className="text-right">
                         <div className="flex justify-end gap-2">
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => openDetailsDialog(order)}
                             leftIcon={<Eye className="h-4 w-4" />}
                           >
                             View
                           </Button>
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => openStatusDialog(order)}
                             leftIcon={<RefreshCw className="h-4 w-4" />}
                           >
                             Update Status
                           </Button>
                         </div>
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        order={selectedOrder}
      />

      {/* Update Status Modal */}
      <UpdateStatusModal
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        order={selectedOrder}
        newStatus={newStatus}
        onStatusChange={setNewStatus}
        isUpdating={updateOrderStatus.isPending}
        onUpdate={handleUpdateStatus}
      />
    </div>
  );
}
