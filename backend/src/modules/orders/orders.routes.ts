import { FastifyInstance } from 'fastify';
import { OrdersController } from './orders.controller';
import { requireAuth, requireAdmin } from '../../middleware/auth';

export default async function ordersRoutes(app: FastifyInstance) {
  const controller = new OrdersController();

  // User routes
  app.post('/', {
    preHandler: [requireAuth],
    handler: controller.createOrder.bind(controller),
  });

   app.get('/my', {
     preHandler: [requireAuth],
     handler: controller.getMyOrders.bind(controller),
   });

   app.get('/:id', {
     preHandler: [requireAuth],
     handler: controller.getOrderById.bind(controller),
   });

   // Admin routes
  app.get('/', {
    preHandler: [requireAuth, requireAdmin],
    handler: controller.getAllOrders.bind(controller),
  });

  app.patch('/:id/status', {
    preHandler: [requireAuth, requireAdmin],
    handler: controller.updateOrderStatus.bind(controller),
  });
}
