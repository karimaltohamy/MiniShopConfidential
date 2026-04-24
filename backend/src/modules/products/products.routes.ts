import { FastifyInstance } from 'fastify';
import { ProductsController } from './products.controller';
import { requireAuth, requireAdmin } from '../../middleware/auth';

export default async function productsRoutes(app: FastifyInstance) {
  const controller = new ProductsController();

  // Public routes
  app.get('/', controller.getProducts.bind(controller));
  app.get('/categories', controller.getCategories.bind(controller));
  app.get('/:id', controller.getProduct.bind(controller));

  // Admin only routes
  app.post('/', {
    preHandler: [requireAuth, requireAdmin],
    handler: controller.createProduct.bind(controller),
  });

  app.patch('/:id', {
    preHandler: [requireAuth, requireAdmin],
    handler: controller.updateProduct.bind(controller),
  });

  app.delete('/:id', {
    preHandler: [requireAuth, requireAdmin],
    handler: controller.deleteProduct.bind(controller),
  });
}
