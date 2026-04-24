# Mini Shop Backend API

Backend API built with Fastify, TypeScript, and Supabase.

## Features

- **Authentication**: Register, login, forgot password, JWT-based auth
- **Products**: CRUD operations with category filtering and search
- **Orders**: Create orders, view order history, admin order management
- **Role-Based Access Control**: Customer vs Admin permissions
- **Input Validation**: Zod schemas on all routes
- **Error Handling**: Consistent error response format
- **Database Security**: Row Level Security (RLS) policies

## Tech Stack

- **Fastify** - High-performance web framework
- **TypeScript** - Type safety
- **Supabase** - PostgreSQL database, authentication, and storage
- **Zod** - Schema validation
- **@fastify/cors** - CORS support
- **@fastify/helmet** - Security headers
- **@fastify/multipart** - File upload support

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Completed database setup (see `supabase/README.md`)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:

```env
NODE_ENV=development
PORT=3000

# Get these from Supabase Dashboard > Project Settings > API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Frontend URLs for CORS
MOBILE_APP_URL=http://localhost:8081
ADMIN_DASHBOARD_URL=http://localhost:5173
```

### 3. Database Setup

Before running the backend, make sure you've completed the Supabase setup:

1. Run the migration: `supabase/migrations/001_initial_schema.sql`
2. Run the seed data: `supabase/seed.sql`
3. Create test accounts (see `supabase/README.md`)

### 4. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Verify Setup

Test the health check endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication Routes

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "customer"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token"
  }
}
```

#### POST /auth/forgot-password
Send password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset email sent"
}
```

#### GET /auth/me
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "John Doe",
  "role": "customer",
  "created_at": "2024-01-15T10:00:00.000Z"
}
```

### Product Routes

#### GET /products
Get all active products (public route).

**Query Parameters:**
- `search` (optional): Search by product name
- `category_id` (optional): Filter by category UUID

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Wireless Headphones",
    "description": "Premium noise-cancelling...",
    "price": 149.99,
    "image_url": "https://...",
    "category_id": "uuid",
    "is_active": true,
    "categories": {
      "id": "uuid",
      "name": "Electronics",
      "slug": "electronics"
    }
  }
]
```

#### GET /products/categories
Get all categories (public route).

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Electronics",
    "slug": "electronics"
  }
]
```

#### GET /products/:id
Get single product by ID (public route).

**Response:** `200 OK` or `404 Not Found`

#### POST /products
Create a new product (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category_id": "uuid",
  "image_url": "https://...",
  "is_active": true
}
```

**Response:** `201 Created`

#### PATCH /products/:id
Update a product (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "price": 89.99
}
```

**Response:** `200 OK`

#### DELETE /products/:id
Soft delete a product (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response:** `204 No Content`

### Order Routes

#### POST /orders
Create a new order (authenticated users).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "unit_price": 149.99
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "status": "pending",
  "total_amount": 299.98,
  "created_at": "2024-01-15T10:00:00.000Z",
  "order_items": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "quantity": 2,
      "unit_price": 149.99,
      "products": {
        "id": "uuid",
        "name": "Wireless Headphones",
        "image_url": "https://..."
      }
    }
  ]
}
```

#### GET /orders/my
Get current user's order history (authenticated users).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "status": "pending",
    "total_amount": 299.98,
    "created_at": "2024-01-15T10:00:00.000Z",
    "order_items": [...]
  }
]
```

#### GET /orders
Get all orders with pagination (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**
- `status` (optional): Filter by order status (pending, processing, completed, cancelled)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "status": "pending",
      "total_amount": 299.98,
      "created_at": "2024-01-15T10:00:00.000Z",
      "profiles": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "order_items": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### PATCH /orders/:id/status
Update order status (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "status": "processing"
}
```

**Response:** `200 OK`

## Error Response Format

All errors follow this consistent format:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [...]
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── env.ts        # Environment variables validation
│   │   └── supabase.ts   # Supabase client setup
│   ├── middleware/       # Fastify middleware
│   │   ├── auth.ts       # JWT verification & RBAC
│   │   └── errorHandler.ts
│   ├── schemas/          # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   ├── product.schema.ts
│   │   └── order.schema.ts
│   ├── modules/          # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.routes.ts
│   │   ├── products/
│   │   └── orders/
│   ├── utils/            # Utility functions
│   │   └── errors.ts     # Custom error classes
│   ├── app.ts            # Fastify app setup
│   └── server.ts         # Entry point
├── supabase/             # Database migrations & seeds
├── package.json
├── tsconfig.json
└── .env.example
```

## Development Scripts

```bash
# Run development server with hot reload
npm run dev

# Type check without emitting files
npm run typecheck

# Build for production
npm run build

# Run production build
npm start
```

## Testing the API

You can use tools like:
- **Thunder Client** (VS Code extension)
- **Postman**
- **curl**

### Example: Login and Make Authenticated Request

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@test.com","password":"Test1234!"}'

# Copy the access_token from response

# Get your orders
curl http://localhost:3000/orders/my \
  -H "Authorization: Bearer <access_token>"
```

## Troubleshooting

### Port already in use
Change the `PORT` in `.env` to a different value (e.g., 3001).

### CORS errors
Make sure the frontend URLs in `.env` match your actual frontend URLs.

### Supabase connection errors
Verify your Supabase credentials in `.env` and check that your Supabase project is running.

### RLS policy blocks requests
For admin operations, make sure you're using the `service_role` key in production or that the user has the `admin` role in the profiles table.

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use environment variables** - Don't hardcode secrets in code
3. **Keep service_role key secret** - It bypasses RLS policies
4. **Use HTTPS in production** - Never send tokens over HTTP
5. **Validate all inputs** - Zod schemas on every route
6. **Enable RLS policies** - Database-level security

## Next Steps

1. Set up mobile app to consume this API
2. Set up admin dashboard to consume this API
3. Deploy to production (Railway, Render, or Fly.io)
4. Set up monitoring and logging
5. Add rate limiting for production
6. Add API documentation with Swagger/OpenAPI

## Support

For issues or questions, create an issue in the repository.
