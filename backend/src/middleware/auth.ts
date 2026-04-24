import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { supabase } from '../config/supabase';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = authHeader.split(' ')[1];

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new UnauthorizedError('Invalid token');
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    throw new UnauthorizedError('User profile not found');
  }

  // Attach to request
  req.user = {
    id: user.id,
    email: user.email || '',
    role: profile.role,
  };
}

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  if (!req.user || req.user.role !== 'admin') {
    throw new ForbiddenError('Admin access required');
  }
}
