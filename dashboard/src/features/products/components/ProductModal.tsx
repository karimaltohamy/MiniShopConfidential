import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import ImageUpload from '@/components/shared/ImageUpload';
import { Product, Category } from '@/types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive').or(z.string().min(1).transform(Number)),
  category_id: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock must be positive').or(z.string().min(1).transform(Number)),
  image_url: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  categories: Category[];
  isCreating: boolean;
  isUpdating: boolean;
}

export default function ProductModal({
  open,
  onOpenChange,
  editingProduct,
  onSubmit,
  categories,
  isCreating,
  isUpdating,
}: ProductModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const imageUrl = watch('image_url');

  useEffect(() => {
    if (open) {
      if (editingProduct) {
        reset({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          category_id: editingProduct.category_id,
          stock: editingProduct.stock,
          image_url: editingProduct.image_url || '',
        });
      } else {
        reset({
          name: '',
          description: '',
          price: 0,
          category_id: '',
          stock: 0,
          image_url: '',
        });
      }
    }
  }, [open, editingProduct, reset]);

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ImageUpload
            value={imageUrl}
            onChange={(url) => setValue('image_url', url)}
            onRemove={() => setValue('image_url', '')}
          />

          <Input label="Name" error={errors.name?.message} {...register('name')} />

          <Textarea
            label="Description"
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              error={errors.price?.message}
              {...register('price')}
            />

            <Input
              label="Stock"
              type="number"
              error={errors.stock?.message}
              {...register('stock')}
            />
          </div>

          <Select
            label="Category"
            options={categoryOptions}
            error={errors.category_id?.message}
            {...register('category_id')}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isCreating || isUpdating}
            >
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
