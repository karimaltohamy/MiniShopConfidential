# MiniShop Mobile App

React Native mobile app for MiniShop e-commerce platform built with Expo.

## Tech Stack

- **Expo** - React Native development framework
- **Expo Router** - File-based navigation
- **TypeScript** - Type-safe development
- **TanStack Query** - Server state management
- **Zustand** - Client state (cart management)
- **Axios** - HTTP client
- **Supabase** - Authentication
- **Lucide React Native** - Icons

## Project Structure

```
mobile/
├── src/
│   ├── app/                      # Expo Router screens
│   │   ├── (auth)/              # Auth screens
│   │   │   ├── login.tsx        # Login screen
│   │   │   ├── register.tsx     # Register screen
│   │   │   └── reset-password.tsx
│   │   ├── (tabs)/              # Main tab screens
│   │   │   ├── _layout.tsx      # Tab navigator
│   │   │   ├── index.tsx        # Shop/Products screen
│   │   │   ├── cart.tsx         # Shopping cart
│   │   │   ├── orders.tsx       # Order history
│   │   │   └── profile.tsx      # User profile
│   │   ├── product/[id].tsx     # Product details
│   │   └── _layout.tsx          # Root layout
│   ├── components/              # Reusable components
│   │   ├── ui/                  # UI primitives (Button, Input, Card, etc.)
│   │   ├── product/             # Product components
│   │   ├── cart/                # Cart components
│   │   ├── order/               # Order components
│   │   └── navigation/          # Navigation components
│   ├── features/                # Feature modules
│   │   ├── auth/               # Auth hooks & API
│   │   ├── products/           # Products API
│   │   ├── cart/               # Cart store (Zustand)
│   │   └── orders/             # Orders API
│   ├── lib/                    # Core utilities
│   │   ├── api/client.ts       # Axios client with interceptors
│   │   ├── supabase.ts         # Supabase client
│   │   └── storage/            # Secure storage
│   ├── contexts/               # React contexts (Theme)
│   ├── theme/                  # Design system
│   └── utils/                  # Helper functions
├── assets/                     # Images & fonts
└── package.json
```

## Features

- User authentication (login, register, password reset)
- Product browsing with search and filters
- Shopping cart with persistence
- Order management
- Dark mode support
- Real-time order updates
- Offline cart persistence

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm start
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code for physical device

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser

## Key Components

### UI Components
- **Button** - Primary, secondary, outline, ghost variants
- **Input** - Text, email, password with validation
- **Card** - Product cards, order cards
- **Badge** - Status indicators (pending, completed, etc.)
- **Skeleton** - Loading placeholders
- **EmptyState** - No data states

### Feature Components
- **ProductCard** - Product display with add to cart
- **CartItem** - Cart item with quantity controls
- **OrderCard** - Order history display

## State Management

### Cart Store (Zustand)
```tsx
const { items, addItem, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
```

### Auth Context
```tsx
const { user, profile, login, logout, register } = useAuth();
```

## API Integration

All API calls use TanStack Query for caching and state management:

- **Products**: List, search, filter, details
- **Orders**: Create, view history
- **Auth**: Login, register, logout

## Testing

Test credentials:
- **Customer**: customer@test.com / Test1234!
- **Admin**: admin@test.com / Admin1234!

## Network Configuration

- **iOS Simulator**: `http://localhost:3000`
- **Android Emulator**: `http://10.0.2.2:3000`
- **Physical Device**: Use your computer's IP address

## Troubleshooting

### Can't connect to backend
Update `EXPO_PUBLIC_API_URL` based on your platform (see Network Configuration above).

### Clear cache
```bash
npm start -- --clear
```
