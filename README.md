# MiniShop - Full-Stack E-Commerce Platform

A complete e-commerce system with mobile app, backend API, and admin dashboard.

## 🎥 Demo Video

**Watch the full walkthrough:** [Demo Video Recording](https://drive.google.com/file/d/1ml18l5J-JrYXyGsttdnQxciEp_hg7k7H/view?usp=sharing)

> 4-5 minute screen recording demonstrating:
> - Mobile app: register, browse, add to cart, checkout
> - Admin dashboard: view order, update status
> - Code structure and technical decisions

## Overview

MiniShop is a production-ready e-commerce platform featuring:
- **Mobile App** - Customer-facing shopping experience (React Native + Expo)
- **Backend API** - RESTful API with authentication & real-time updates (Fastify + Node.js)
- **Admin Dashboard** - Product and order management interface (React + Vite)
- **Database** - PostgreSQL with Row Level Security (Supabase)

## 🔑 Test Credentials

Pre-configured accounts for testing:
- **Customer Account**: customer@test.com / Test1234!
- **Admin Account**: admin@test.com / Admin1234!

> **Note**: Create these accounts in Supabase Dashboard → Authentication → Users after running the database migrations.

## Project Structure

```
MiniShopConfidential/
├── backend/              # Fastify API server
│   ├── src/
│   │   ├── modules/     # Auth, Products, Orders
│   │   ├── config/      # Supabase & environment
│   │   ├── middleware/  # Auth & error handling
│   │   └── schemas/     # Zod validation
│   └── README.md
│
├── mobile/              # Expo React Native app
│   ├── src/
│   │   ├── app/        # Expo Router screens
│   │   ├── features/   # Auth, Products, Cart, Orders
│   │   ├── components/ # Reusable UI components
│   │   ├── lib/        # API client & Supabase
│   │   └── theme/      # Design system
│   └── README.md
│
├── dashboard/           # React admin panel
│   ├── src/
│   │   ├── pages/      # Dashboard, Products, Orders
│   │   ├── features/   # Feature modules
│   │   ├── components/ # UI components
│   │   └── lib/        # API client & utils
│   └── README.md
│
└── README.md           # This file
```

## Tech Stack

### Backend
- **Fastify** - High-performance web framework
- **TypeScript** - Type-safe development
- **Supabase** - PostgreSQL database, authentication, storage
- **Zod** - Request validation
- **JWT** - Token-based authentication

### Mobile App
- **Expo** - React Native development platform
- **Expo Router** - File-based navigation
- **TanStack Query** - Server state & caching
- **Zustand** - Cart state management
- **Axios** - HTTP client
- **Lucide React Native** - Icons

### Admin Dashboard
- **React 18** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Hook Form + Zod** - Forms & validation
- **Recharts** - Data visualization

## Features

### Mobile App
- User authentication (login, register, password reset)
- Product browsing with search & category filters
- Shopping cart with offline persistence
- Checkout and order creation
- Order history with real-time updates
- Dark mode support
- Pull-to-refresh functionality

### Backend API
- RESTful API with comprehensive endpoints
- JWT authentication with auto-refresh
- Role-based access control (customer/admin)
- Product management (CRUD operations)
- Order processing with status tracking
- Real-time order updates via WebSocket
- Input validation on all routes
- Pagination support

### Admin Dashboard
- Dashboard overview with KPIs and analytics
- Product management (create, edit, delete)
- Image upload to Supabase Storage
- Order management (view, filter, update status)
- Real-time order updates
- Search and filtering
- Dark mode support

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Expo CLI (for mobile)

### 1. Setup Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run database migrations from `backend/supabase/migrations/`
3. Run seed data from `backend/supabase/seed.sql`
4. Create storage bucket: `product-images` (public)
5. Create test accounts:
   - Customer: customer@test.com / Test1234!
   - Admin: admin@test.com / Admin1234!

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with Supabase credentials
npm run dev
```

Runs on `http://localhost:3000`

### 3. Mobile App Setup

```bash
cd mobile
npm install
cp .env.example .env
# Edit .env with API URL and Supabase credentials
npm start
```

Press `i` for iOS or `a` for Android

### 4. Dashboard Setup

```bash
cd dashboard
npm install
cp .env.example .env
# Edit .env with API URL and Supabase credentials
npm run dev
```

Runs on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Password reset
- `GET /auth/me` - Get current user

### Products
- `GET /products` - List products (with search, filters, pagination)
- `GET /products/:id` - Get product details
- `GET /products/categories` - List categories
- `POST /products` - Create product (admin)
- `PATCH /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Orders
- `POST /orders` - Create order
- `GET /orders/my` - User's order history
- `GET /orders` - All orders (admin, paginated)
- `PATCH /orders/:id/status` - Update order status (admin)

## Database Schema

### Tables
- **profiles** - User profiles with role (customer/admin)
- **categories** - Product categories
- **products** - Products with pricing, stock, images
- **orders** - Customer orders with status tracking
- **order_items** - Order line items

### Security
- Row Level Security (RLS) policies on all tables
- Customer users can only view/edit their own data
- Admin users have full access
- Authentication required for all write operations

## Environment Variables

### Backend
```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Mobile
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Dashboard
```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Documentation

Each component has detailed documentation:
- [Backend API](./backend/README.md) - API setup, endpoints, architecture
- [Mobile App](./mobile/README.md) - App setup, components, state management
- [Admin Dashboard](./dashboard/README.md) - Dashboard setup, features, deployment

## Architecture

### Backend Pattern
```
Routes → Controller → Service → Supabase
```

### Mobile Pattern
```
Screens → Hooks (TanStack Query) → API Client → Backend
```

### Dashboard Pattern
```
Pages → Hooks (TanStack Query) → API Client → Backend
```

## Security Features

- JWT authentication with automatic refresh
- Row Level Security (RLS) at database level
- Role-based access control
- Input validation with Zod schemas
- Secure token storage (SecureStore/httpOnly cookies)
- CORS configuration
- Password hashing via Supabase Auth
- SQL injection prevention

## Key Technologies

- **State Management**: TanStack Query (server), Zustand (client)
- **Validation**: Zod schemas across frontend & backend
- **Routing**: Expo Router (mobile), React Router (dashboard)
- **Styling**: Tailwind CSS (dashboard), custom theme system (mobile)
- **Real-time**: WebSocket for live order updates
- **Storage**: Supabase Storage for product images

## Development

### Backend
```bash
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Run production build
```

### Mobile
```bash
npm start        # Start Expo dev server
npm run android  # Run on Android
npm run ios      # Run on iOS
```

### Dashboard
```bash
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Testing

### Test Credentials
- **Customer**: customer@test.com / Test1234!
- **Admin**: admin@test.com / Admin1234!

### Mobile Test Flow
1. Login with customer credentials
2. Browse products with search/filters
3. Add items to cart
4. Checkout and create order
5. View order history
6. Toggle dark mode

### Dashboard Test Flow
1. Login with admin credentials
2. View dashboard KPIs
3. Create/edit products
4. Upload product images
5. View and manage orders
6. Update order status



