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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-6 text-base font-medium text-muted-foreground">Loading orders...</p>
          <p className="mt-2 text-sm text-muted-foreground">Retrieving customer orders</p>
        </div>
      </div>
    );
  }

  const orders = ordersData?.data || [];
  const pagination = ordersData?.pagination;




  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info" className="px-3 py-1.5">
            {pagination?.total || 0} Total Orders
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Filter by status:</span>
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-48"
              />
            </div>
            {statusFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter('');
                  setCurrentPage(1);
                }}
              >
                Clear Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Orders` : 'All Orders'}
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({orders.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="No orders found"
              description={
                statusFilter
                  ? 'Try adjusting your filters to see more orders'
                  : 'Orders will appear here when customers make purchases from your store'
              }
            />
          ) : (
            <>
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="w-20">Items</TableHead>
                      <TableHead className="w-32">Total</TableHead>
                      <TableHead className="w-28">Status</TableHead>
                      <TableHead className="w-64 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="transition-colors hover:bg-muted/50">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-mono text-xs font-medium">
                              {order.id.slice(0, 8)}...
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <span className="text-sm font-semibold text-primary">
                                {(order.profiles?.name || 'U')[0].toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium">{order.profiles?.name || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {order.order_items?.length || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-lg font-bold">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariants[order.status]}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        {/* <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDateTime(order.created_at)}
                          </span>
                        </TableCell> */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDetailsDialog(order)}
                              leftIcon={<Eye className="h-4 w-4" />}
                              className='p-0'
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openStatusDialog(order)}
                              leftIcon={<RefreshCw className="h-4 w-4" />}
                              className='p-0'
                            >
                              Update
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex justify-center">
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
