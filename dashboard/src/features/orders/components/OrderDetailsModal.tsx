import { Order, OrderStatus } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const statusVariants: Record<OrderStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'error',
};

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export default function OrderDetailsModal({
  open,
  onOpenChange,
  order,
}: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order ID: {order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <div>
               <p className="text-sm font-medium text-muted-foreground">Customer</p>
               <p className="text-sm">{order.profiles?.name || 'N/A'}</p>
             </div>
             <div>
               <p className="text-sm font-medium text-muted-foreground">Email</p>
               <p className="text-sm">{order.profiles?.email || 'N/A'}</p>
             </div>
             <div>
               <p className="text-sm font-medium text-muted-foreground">Status</p>
               <Badge variant={statusVariants[order.status]}>
                 {order.status}
               </Badge>
             </div>
             <div>
               <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
               <p className="text-sm font-bold">
                 {formatCurrency(order.total_amount)}
               </p>
             </div>
             <div>
               <p className="text-sm font-medium text-muted-foreground">Order Date</p>
               <p className="text-sm">{formatDateTime(order.created_at)}</p>
             </div>
             <div>
               <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
               <p className="text-sm">{formatDateTime(order.updated_at)}</p>
             </div>
           </div>

           {order.order_items && order.order_items.length > 0 && (
             <div>
               <p className="text-sm font-medium mb-2">Order Items</p>
               <div className="space-y-2">
                 {order.order_items.map((item) => (
                   <div
                     key={item.id}
                     className="flex justify-between items-center p-2 bg-muted rounded"
                   >
                     <div>
                       <p className="text-sm font-medium">
                         {item.products?.name || 'Unknown Product'}
                       </p>
                       <p className="text-xs text-muted-foreground">
                         Quantity: {item.quantity}
                       </p>
                     </div>
                     <p className="text-sm font-medium">
                       {formatCurrency(item.unit_price * item.quantity)}
                     </p>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
