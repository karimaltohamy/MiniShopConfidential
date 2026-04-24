import { FastifyReply, FastifyRequest } from 'fastify';

// In-memory rate limiter store: IP -> { count, resetAt }
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetAt) {
      rateLimitStore.delete(ip);
    }
  }
}, 60_000); // Clean up every minute

interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export function rateLimit(options: RateLimitOptions) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();

    let record = rateLimitStore.get(ip);

    // If no record or expired, create new
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + options.windowMs };
      rateLimitStore.set(ip, record);
    }

    record.count++;

    const remaining = Math.max(0, options.max - record.count);

    // Set headers for rate limit info
    reply.header('X-RateLimit-Limit', options.max.toString());
    reply.header('X-RateLimit-Remaining', remaining.toString());

    if (record.count > options.max) {
      reply.header('Retry-After', Math.ceil((record.resetAt - now) / 1000).toString());
      return reply
        .code(429)
        .send({
          statusCode: 429,
          error: 'Too Many Requests',
          message: 'Please try again later',
        });
    }
  };
}

// Call this on app close to clear interval
export function cleanup() {
  clearInterval(cleanupInterval);
}