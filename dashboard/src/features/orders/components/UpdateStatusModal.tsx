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
import Select from '@/components/ui/Select';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface UpdateStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  newStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  isUpdating: boolean;
  onUpdate: () => Promise<void>;
}

export default function UpdateStatusModal({
  open,
  onOpenChange,
  order,
  newStatus,
  onStatusChange,
  isUpdating,
  onUpdate,
}: UpdateStatusModalProps) {
  const handleSubmit = async () => {
    await onUpdate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the status of order {order?.id.slice(0, 8)}...
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Select
            label="New Status"
            options={statusOptions}
            value={newStatus}
            onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isUpdating}>
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
