import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(0, 'Price must be positive'),
  category_id: z.string().uuid('Invalid category ID'),
  image_url: z.string().url().optional(),
  is_active: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category_id: z.string().uuid().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
