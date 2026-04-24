import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useProducts,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/features/products/hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
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
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/shared/EmptyState';
import ImageUpload from '@/components/shared/ImageUpload';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Product, CreateProductInput } from '@/types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive').or(z.string().min(1).transform(Number)),
  category_id: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock must be positive').or(z.string().min(1).transform(Number)),
  image_url: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: products, isLoading } = useProducts({ search: searchQuery, category: selectedCategory });
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

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

  const openCreateDialog = () => {
    setEditingProduct(null);
    reset({
      name: '',
      description: '',
      price: 0,
      category_id: '',
      stock: 0,
      image_url: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id,
      stock: product.stock,
      image_url: product.image_url || '',
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const input: CreateProductInput = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category_id: data.category_id,
        stock: Number(data.stock),
        image_url: data.image_url,
      };

      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, input });
      } else {
        await createProduct.mutateAsync(input);
      }

      setIsDialogOpen(false);
      reset();
    } catch (error) {
      // Error handled by mutation hooks
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct.mutateAsync(id);
    }
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...(categories || []).map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">Manage your product catalog</p>
        </div>
        <Button onClick={openCreateDialog} leftIcon={<Plus className="h-4 w-4" />}>
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-64">
              <Select
                options={categoryOptions}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({products?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!products || products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products found"
              description="Get started by adding your first product to the catalog"
              actionLabel="Add Product"
              onAction={openCreateDialog}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category?.name || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? 'success' : 'error'}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                          leftIcon={<Pencil className="h-4 w-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          leftIcon={<Trash2 className="h-4 w-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onClose={() => setIsDialogOpen(false)}>
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
              options={
                categories?.map((cat) => ({ value: cat.id, label: cat.name })) || []
              }
              error={errors.category_id?.message}
              {...register('category_id')}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={createProduct.isPending || updateProduct.isPending}
              >
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
