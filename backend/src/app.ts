import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import productsRoutes from './modules/products/products.routes';
import ordersRoutes from './modules/orders/orders.routes';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'development' ? 'info' : 'warn',
    },
  });

  // Plugins
  await app.register(cors, {
    origin: [env.MOBILE_APP_URL, env.ADMIN_DASHBOARD_URL],
    credentials: true,
  });

  await app.register(helmet);

  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });

  // Global error handler
  app.setErrorHandler(errorHandler);

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // Routes
  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(productsRoutes, { prefix: '/products' });
  await app.register(ordersRoutes, { prefix: '/orders' });

  return app;
}
