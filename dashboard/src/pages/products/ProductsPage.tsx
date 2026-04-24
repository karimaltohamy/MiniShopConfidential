import { useState } from 'react';
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
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/shared/Pagination';
import EmptyState from '@/components/shared/EmptyState';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';
import ProductModal from '@/features/products/components/ProductModal';

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
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: productsData, isLoading } = useProducts({
    search: searchQuery,
    ...(selectedCategoryId && { category_id: selectedCategoryId }),
    page: currentPage,
    limit: 10,
  });
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const openCreateDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const input = {
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="w-64">
              <Select
                options={categoryOptions}
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({productsData?.data?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!productsData?.data || productsData.data.length === 0 ? (
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
                {productsData.data.map((product) => (
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
                    <TableCell>{product?.category?.name || 'N/A'}</TableCell>
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

      {/* Pagination */}
      {productsData?.pagination && productsData.pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={productsData.pagination.page}
            totalPages={productsData.pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingProduct={editingProduct}
        onSubmit={onSubmit}
        categories={categories || []}
        isCreating={createProduct.isPending}
        isUpdating={updateProduct.isPending}
      />
    </div>
  );
}
