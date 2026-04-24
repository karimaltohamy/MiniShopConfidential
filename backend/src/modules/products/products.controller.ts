import { FastifyRequest, FastifyReply } from 'fastify';
import { ProductsService } from './products.service';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from '../../schemas/product.schema';

export class ProductsController {
  private productsService: ProductsService;

  constructor() {
    this.productsService = new ProductsService();
  }

  async getProducts(req: FastifyRequest, reply: FastifyReply) {
    const filters = productQuerySchema.parse(req.query);

    // If user is admin, show all products, otherwise only active ones
    const result = req.user?.role === 'admin'
      ? await this.productsService.getAllProducts(filters)
      : await this.productsService.getProducts(filters);

    return reply.send(result);
  }

  async getProduct(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const product = await this.productsService.getProduct(req.params.id);

    if (!product) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Product not found',
      });
    }

    return reply.send(product);
  }

  async createProduct(req: FastifyRequest, reply: FastifyReply) {
    const data = createProductSchema.parse(req.body);
    const product = await this.productsService.createProduct(data);
    return reply.code(201).send(product);
  }

  async updateProduct(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const data = updateProductSchema.parse(req.body);
    const product = await this.productsService.updateProduct(req.params.id, data);
    return reply.send(product);
  }

  async deleteProduct(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    await this.productsService.deleteProduct(req.params.id);
    return reply.code(204).send();
  }

  async getCategories(req: FastifyRequest, reply: FastifyReply) {
    const categories = await this.productsService.getCategories();
    return reply.send(categories);
  }
}
