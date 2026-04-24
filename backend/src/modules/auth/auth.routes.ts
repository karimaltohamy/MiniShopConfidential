import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import { requireAuth } from '../../middleware/auth';
import { rateLimit } from '../../middleware/rateLimit';

export default async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController();

  app.post('/register', controller.register.bind(controller));
  app.post('/login', controller.login.bind(controller));
  app.post('/forgot-password', {
    preHandler: rateLimit({ max: 5, windowMs: 60 * 60 * 1000 }), // 5 per hour
    handler: controller.forgotPassword.bind(controller),
  });
  app.post('/reset-password', {
    preHandler: rateLimit({ max: 3, windowMs: 60 * 60 * 1000 }), // 3 per hour
    handler: controller.resetPassword.bind(controller),
  });

  app.get('/me', {
    preHandler: [requireAuth],
    handler: controller.getMe.bind(controller),
  });
}
