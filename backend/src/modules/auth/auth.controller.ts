import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../../schemas/auth.schema';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: FastifyRequest, reply: FastifyReply) {
    const data = registerSchema.parse(req.body);
    const result = await this.authService.register(data);
    return reply.code(201).send(result);
  }

  async login(req: FastifyRequest, reply: FastifyReply) {
    const data = loginSchema.parse(req.body);
    const result = await this.authService.login(data);
    return reply.send(result);
  }

  async forgotPassword(req: FastifyRequest, reply: FastifyReply) {
    const data = forgotPasswordSchema.parse(req.body);
    const result = await this.authService.forgotPassword(data);
    return reply.send(result);
  }

  async resetPassword(req: FastifyRequest, reply: FastifyReply) {
    const data = resetPasswordSchema.parse(req.body);
    const result = await this.authService.resetPassword(data);
    return reply.send(result);
  }

  async getMe(req: FastifyRequest, reply: FastifyReply) {
    if (!req.user) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const profile = await this.authService.getMe(req.user.id);
    return reply.send(profile);
  }
}
