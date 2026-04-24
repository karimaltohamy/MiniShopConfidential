import { buildApp } from './app';
import { env } from './config/env';

async function start() {
  try {
    const app = await buildApp();

    const port = parseInt(env.PORT, 10);
    await app.listen({ port, host: '0.0.0.0' });

    console.log(`
🚀 Server is running!
📍 URL: http://localhost:${port}
🌍 Environment: ${env.NODE_ENV}
    `);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();
