import { z } from 'zod';

export const orderItemSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unit_price: z.number().min(0, 'Unit price must be positive'),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
});

export const orderQuerySchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']).optional(),
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).default('20'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderQuery = z.infer<typeof orderQuerySchema>;
