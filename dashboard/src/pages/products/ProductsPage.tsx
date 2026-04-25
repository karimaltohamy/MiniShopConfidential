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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-6 text-base font-medium text-muted-foreground">Loading products...</p>
          <p className="mt-2 text-sm text-muted-foreground">Fetching your product catalog</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button onClick={openCreateDialog} leftIcon={<Plus className="h-4 w-4" />}>
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-64">
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
          <div className="flex items-center justify-between">
            <CardTitle>
              All Products
              <span className="ml-2 text-base font-normal text-muted-foreground">
                ({productsData?.pagination?.total || 0})
              </span>
            </CardTitle>
          </div>
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
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="w-24">Stock</TableHead>
                    <TableHead className="w-28">Status</TableHead>
                    <TableHead className="w-48 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsData.data.map((product) => (
                    <TableRow key={product.id} className="transition-colors hover:bg-muted/50">
                      <TableCell>
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-14 w-14 rounded-lg border object-cover shadow-sm"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-muted">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold">{product.name}</span>
                          {product.description && (
                            <span className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                              {product.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{product?.category?.name || 'N/A'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{formatCurrency(product.price)}</span>
                      </TableCell>
                      <TableCell>
                        <span className={product.stock < 10 ? 'text-destructive font-semibold' : ''}>
                          {product.stock}
                        </span>
                      </TableCell>
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
                            leftIcon={<Trash2 className="h-4 w-4 text-destructive" />}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {productsData?.pagination && productsData.pagination.totalPages > 1 && (
        <div className="flex justify-center">
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
