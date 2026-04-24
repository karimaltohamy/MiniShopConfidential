# MiniShop Admin Dashboard

A modern, responsive admin dashboard for managing the MiniShop e-commerce platform.

## Features

- **Authentication**: Secure admin login with role-based access control
- **Dashboard**: Overview with KPIs and recent orders
- **Products Management**: Full CRUD operations for products
  - Create, edit, and delete products
  - Image upload to Supabase Storage
  - Category filtering and search
  - Stock management
- **Orders Management**: Track and manage customer orders
  - View order details
  - Update order status
  - Filter by status
  - Pagination support

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form + Zod** - Form handling and validation
- **Tailwind CSS** - Styling
- **Supabase** - Authentication and storage
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on port 3000
- Supabase project with:
  - Authentication enabled
  - Product images storage bucket created
  - RLS policies configured

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Start the development server:

```bash
npm run dev
```

The dashboard will be available at [http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
dashboard/
├── src/
│   ├── app/              # App setup and routing
│   │   ├── App.tsx       # Main app component with providers
│   │   └── router.tsx    # Route configuration
│   ├── components/
│   │   ├── layout/       # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── shared/       # Shared components
│   │   │   ├── KPICard.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ImageUpload.tsx
│   │   └── ui/           # Base UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── Table.tsx
│   │       ├── Dialog.tsx
│   │       ├── Select.tsx
│   │       └── Textarea.tsx
│   ├── features/         # Feature modules
│   │   ├── auth/
│   │   │   ├── api/      # Auth API calls
│   │   │   ├── hooks/    # Auth hooks and context
│   │   │   └── components/ # Protected route
│   │   ├── products/
│   │   │   ├── api/      # Products API calls
│   │   │   └── hooks/    # Products React Query hooks
│   │   └── orders/
│   │       ├── api/      # Orders API calls
│   │       └── hooks/    # Orders React Query hooks
│   ├── pages/            # Page components
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── products/
│   │   │   └── ProductsPage.tsx
│   │   └── orders/
│   │       └── OrdersPage.tsx
│   ├── lib/              # Utilities and configs
│   │   ├── api.ts        # Axios client setup
│   │   ├── supabase.ts   # Supabase client
│   │   └── utils.ts      # Helper functions
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── index.css         # Global styles
│   ├── main.tsx          # App entry point
│   └── vite-env.d.ts     # Vite types
├── public/               # Static assets
├── .env.example          # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## Default Credentials

For development and testing:

- **Email**: admin@example.com
- **Password**: admin123

**Note**: Make sure to create an admin user in your database with these credentials or update them accordingly.

## Key Features Explained

### Authentication

- Admin-only access with role verification
- JWT token management via Supabase Auth
- Automatic token refresh
- Protected routes with redirect to login

### Product Management

- Image upload to Supabase Storage bucket `product-images`
- Real-time search and category filtering
- Form validation with Zod schemas
- Optimistic UI updates with React Query

### Order Management

- Paginated order listing
- Status filtering
- Order details modal
- Status update workflow
- Real-time data synchronization

### Dashboard

- Revenue and orders KPIs with month-over-month changes
- Recent orders table
- Quick access to key metrics

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## Supabase Storage Setup

Create a storage bucket for product images:

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `product-images`
3. Set it to **public** for easy access
4. Configure RLS policies if needed

## Notes

- All API calls automatically include the JWT token from Supabase Auth
- Form validation uses Zod schemas for type-safe validation
- React Query handles caching and automatic refetching
- Toast notifications (via Sonner) for user feedback
- Responsive design works on desktop and tablet

## Support

For issues or questions, please refer to the main project documentation.
