import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';

export function errorHandler(
  error: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply,
) {
  // Zod validation errors
  if (error instanceof ZodError) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      details: error.errors,
    });
  }

  // Custom app errors
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.error,
      message: error.message,
    });
  }

  // Default 500
  req.log.error(error);
  return reply.code(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
}
