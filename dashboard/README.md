# MiniShop Admin Dashboard

Web-based admin dashboard for managing the MiniShop e-commerce platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool & dev server
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Authentication & storage
- **Axios** - HTTP client
- **Recharts** - Charts and visualizations

## Project Structure

```
dashboard/
├── src/
│   ├── app/                      # App configuration
│   │   ├── App.tsx              # Main app with providers
│   │   └── router.tsx           # Route configuration
│   ├── pages/                   # Page components
│   │   ├── auth/               # Login page
│   │   ├── dashboard/          # Dashboard overview
│   │   ├── products/           # Products management
│   │   └── orders/             # Orders management
│   ├── components/              # Reusable components
│   │   ├── layout/             # Layout components (Sidebar, Header)
│   │   ├── shared/             # Shared components (KPIs, Pagination)
│   │   └── ui/                 # UI primitives (Button, Input, Card, etc.)
│   ├── features/                # Feature modules
│   │   ├── auth/               # Auth context & API
│   │   ├── products/           # Products API & hooks
│   │   └── orders/             # Orders API & hooks
│   ├── lib/                     # Core utilities
│   │   ├── api.ts              # Axios client with interceptors
│   │   ├── supabase.ts         # Supabase client
│   │   └── utils.ts            # Helper functions
│   ├── types/                   # TypeScript types
│   ├── hooks/                   # Custom React hooks
│   └── main.tsx                # App entry point
├── public/                      # Static assets
└── package.json
```

## Features

- Admin authentication with role-based access
- Dashboard with KPIs and analytics
- Product management (CRUD operations)
  - Image upload to Supabase Storage
  - Category filtering and search
  - Stock management
- Order management
  - View order details
  - Update order status
  - Real-time updates
  - Pagination & filtering
- Dark mode support

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

Dashboard runs on `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Default Admin Credentials

Test credentials:
- **Email**: admin@test.com
- **Password**: Admin1234!

## Key Features

### Dashboard Overview
- Total revenue & orders metrics
- Month-over-month changes
- Recent orders table
- Quick actions

### Product Management
- Create, edit, delete products
- Upload product images
- Category assignment
- Stock tracking
- Search & filter

### Order Management
- View all orders with pagination
- Filter by status (pending, processing, completed, cancelled)
- Update order status
- View order details & items
- Real-time order updates

## Supabase Storage Setup

For product images, create a storage bucket:

1. Supabase Dashboard → Storage
2. Create bucket: `product-images`
3. Set to **public**
4. Configure RLS policies as needed

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |

## Build for Production

```bash
npm run build
```

Output in `dist/` directory.

## Notes

- JWT tokens managed automatically via Supabase Auth
- React Query handles caching and refetching
- Form validation with Zod schemas
- Toast notifications for user feedback
- Responsive design (desktop & tablet)
