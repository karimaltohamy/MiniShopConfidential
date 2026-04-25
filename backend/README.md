# MiniShop Backend API

RESTful API backend for MiniShop e-commerce platform.

## Tech Stack

- **Fastify** - Fast web framework for Node.js
- **TypeScript** - Type-safe development
- **Supabase** - PostgreSQL database & authentication
- **Zod** - Schema validation
- **JWT** - Token-based authentication

## Project Structure

```
backend/
├── src/
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication (login, register)
│   │   ├── products/        # Product CRUD & categories
│   │   └── orders/          # Order management & real-time updates
│   ├── config/              # Configuration (Supabase, env)
│   ├── middleware/          # Auth & error handling middleware
│   ├── schemas/             # Zod validation schemas
│   ├── types/               # TypeScript types
│   ├── utils/               # Helper functions
│   ├── app.ts               # Fastify app setup
│   └── server.ts            # Entry point
├── package.json
└── tsconfig.json
```

## Features

- Authentication & authorization (JWT)
- Product management with categories
- Order processing with real-time updates
- Role-based access control (admin/customer)
- Input validation with Zod
- CORS & security headers
- Pagination support

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file:

```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### 3. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run typecheck` - TypeScript type checking

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Password reset
- `GET /auth/me` - Get current user

### Products
- `GET /products` - List products (with search & filter)
- `GET /products/:id` - Get product details
- `GET /products/categories` - List categories
- `POST /products` - Create product (admin)
- `PATCH /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Orders
- `POST /orders` - Create order
- `GET /orders/my` - User's orders
- `GET /orders` - All orders (admin)
- `PATCH /orders/:id/status` - Update status (admin)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key (admin) |
