import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import { requireAuth } from '../../middleware/auth';

export default async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController();

  app.post('/register', controller.register.bind(controller));
  app.post('/login', controller.login.bind(controller));
  app.post('/forgot-password', controller.forgotPassword.bind(controller));

  app.get('/me', {
    preHandler: [requireAuth],
    handler: controller.getMe.bind(controller),
  });
}
