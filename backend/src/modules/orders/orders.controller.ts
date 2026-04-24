import { FastifyRequest, FastifyReply } from 'fastify';
import { OrdersService } from './orders.service';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
} from '../../schemas/order.schema';

export class OrdersController {
  private ordersService: OrdersService;

  constructor() {
    this.ordersService = new OrdersService();
  }

  async createOrder(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const data = createOrderSchema.parse(req.body);
    const order = await this.ordersService.createOrder(req.user.id, data);
    return reply.code(201).send(order);
  }

  async getMyOrders(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const orders = await this.ordersService.getMyOrders(req.user.id);
    return reply.send(orders);
  }

  async getAllOrders(req: FastifyRequest, reply: FastifyReply) {
    const query = orderQuerySchema.parse(req.query);
    const result = await this.ordersService.getAllOrders(query);
    return reply.send(result);
  }

  async updateOrderStatus(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const data = updateOrderStatusSchema.parse(req.body);
    const order = await this.ordersService.updateOrderStatus(req.params.id, data);
    return reply.send(order);
  }
}
