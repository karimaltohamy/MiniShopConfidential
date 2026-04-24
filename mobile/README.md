# Mini Shop Mobile App

React Native mobile app built with Expo and TypeScript for the Mini Shop e-commerce platform.

## Status

**Current Implementation: ~60% Complete** 🔄

### ✅ Completed Features
- ✅ Project setup with Expo Router
- ✅ TypeScript configuration
- ✅ Design system (colors, typography, spacing, shadows)
- ✅ Supabase client with SecureStore integration
- ✅ API client with JWT interceptors
- ✅ Cart state management with Zustand + AsyncStorage
- ✅ UI Components:
  - Button (with variants, sizes, loading states)
  - Input (with labels, errors, password toggle)
  - Card (pressable variant)
  - Badge (status variants)
  - Skeleton (animated loading)
  - EmptyState (with icon, title, description, action)
- ✅ ProductCard component
- ✅ Auth context and hooks (useAuth)
- ✅ API integrations (auth, products, orders)
- ✅ App layout with Expo Router
- ✅ Auth screens (Login, Register)

### 📋 To Be Implemented
- ❌ Forgot Password screen
- ❌ Tab navigation layout
- ❌ Shop screen with product grid
- ❌ Product search and filtering
- ❌ Product detail screen
- ❌ Cart screen with quantity controls
- ❌ Checkout flow
- ❌ Order history screen
- ❌ Profile screen with logout
- ❌ Loading skeletons for all screens
- ❌ Error handling and toast notifications
- ❌ Pull-to-refresh functionality
- ❌ Empty states for all screens

## Tech Stack

- **Expo SDK 51** - React Native framework
- **Expo Router** - File-based routing
- **TypeScript** - Type safety
- **TanStack Query** - Server state management
- **Zustand** - Client state (cart)
- **Axios** - HTTP client
- **Supabase** - Authentication and database
- **Lucide React Native** - Icons
- **AsyncStorage** - Persistent storage

## Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Backend API running on http://localhost:3000
- Supabase project set up

## Setup Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Development Server

```bash
npm start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code for physical device (Expo Go app)

## Project Structure

```
mobile/
├── src/
│   ├── app/                    # Expo Router screens
│   │   ├── _layout.tsx        # Root layout with providers
│   │   ├── (auth)/            # Auth screens group
│   │   │   ├── login.tsx      ✅
│   │   │   ├── register.tsx   ✅
│   │   │   └── forgot-password.tsx ❌
│   │   ├── (tabs)/            # Main tab screens ❌
│   │   │   ├── _layout.tsx    # Tab navigator
│   │   │   ├── index.tsx      # Shop screen
│   │   │   ├── cart.tsx       # Cart screen
│   │   │   ├── orders.tsx     # Orders screen
│   │   │   └── profile.tsx    # Profile screen
│   │   ├── product/[id].tsx   # Product detail ❌
│   │   └── checkout.tsx       # Checkout flow ❌
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives ✅
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── product/           # Product components
│   │   │   └── ProductCard.tsx ✅
│   │   ├── cart/              # Cart components ❌
│   │   └── order/             # Order components ❌
│   ├── features/              # Feature modules
│   │   ├── auth/              ✅
│   │   │   ├── hooks/useAuth.tsx
│   │   │   └── api/authApi.ts
│   │   ├── products/          ✅
│   │   │   └── api/productsApi.ts
│   │   ├── cart/              ✅
│   │   │   └── store/cartStore.ts
│   │   └── orders/            ✅
│   │       └── api/ordersApi.ts
│   ├── lib/                   # Core utilities ✅
│   │   ├── api/client.ts
│   │   ├── supabase.ts
│   │   └── storage/secureStore.ts
│   └── theme/                 # Design system ✅
│       ├── colors.ts
│       ├── typography.ts
│       ├── spacing.ts
│       └── index.ts
├── assets/                    # Images, fonts
├── app.json                   ✅
├── package.json               ✅
└── tsconfig.json              ✅
```

## Available Components

### UI Components

All components are fully typed and follow the design system.

#### Button
```tsx
<Button
  onPress={() => {}}
  variant="primary" // primary | secondary | outline | ghost
  size="md"         // sm | md | lg
  loading={false}
  disabled={false}
  fullWidth={false}
>
  Click Me
</Button>
```

#### Input
```tsx
<Input
  label="Email"
  type="email"      // text | email | password
  placeholder="Enter email"
  value={email}
  onChangeText={setEmail}
  error="Email is required"
/>
```

#### Card
```tsx
<Card onPress={() => {}}>
  <Text>Card content</Text>
</Card>
```

#### Badge
```tsx
<Badge variant="success">Completed</Badge>
// Variants: default | success | warning | error | info
```

#### Skeleton
```tsx
<Skeleton width={200} height={20} />
```

#### EmptyState
```tsx
<EmptyState
  icon={ShoppingBag}
  title="No products found"
  description="Try adjusting your search"
  actionLabel="Clear Filters"
  onAction={() => {}}
/>
```

### Feature Components

#### ProductCard
```tsx
<ProductCard
  id={product.id}
  name={product.name}
  price={product.price}
  image_url={product.image_url}
  onPress={() => router.push(`/product/${product.id}`)}
  onAddToCart={() => addToCart(product)}
/>
```

## State Management

### Cart Store (Zustand)

```tsx
import { useCartStore } from '../features/cart/store/cartStore';

// In your component
const items = useCartStore((state) => state.items);
const addItem = useCartStore((state) => state.addItem);
const removeItem = useCartStore((state) => state.removeItem);
const updateQuantity = useCartStore((state) => state.updateQuantity);
const getTotal = useCartStore((state) => state.getTotal);
const clearCart = useCartStore((state) => state.clearCart);

// Add to cart
addItem({
  product_id: product.id,
  name: product.name,
  price: product.price,
  image_url: product.image_url,
});

// Update quantity
updateQuantity(productId, 3);

// Remove item
removeItem(productId);

// Get total
const total = getTotal(); // Returns sum of all items

// Clear cart
clearCart();
```

### Auth Context

```tsx
import { useAuth } from '../features/auth/hooks/useAuth';

// In your component
const { user, profile, loading, login, logout, register } = useAuth();

// Login
await login({ email, password });

// Register
await register({ name, email, password });

// Logout
await logout();

// Check if user is logged in
if (user) {
  // User is authenticated
}

// Get user role
if (profile?.role === 'admin') {
  // User is admin
}
```

## API Integration

### Products API

```tsx
import { productsApi } from '../features/products/api/productsApi';

// Get all products
const products = await productsApi.getProducts();

// Search products
const results = await productsApi.getProducts({ search: 'laptop' });

// Filter by category
const products = await productsApi.getProducts({ category_id: 'uuid' });

// Get single product
const product = await productsApi.getProduct(productId);

// Get categories
const categories = await productsApi.getCategories();
```

### Orders API

```tsx
import { ordersApi } from '../features/orders/api/ordersApi';

// Create order
const order = await ordersApi.createOrder({
  items: [
    {
      product_id: 'uuid',
      quantity: 2,
      unit_price: 149.99,
    },
  ],
});

// Get user's orders
const orders = await ordersApi.getMyOrders();
```

## Next Steps for Implementation

### 1. Complete Main Screens (3-4 hours)

Create the following screens in `src/app/(tabs)/`:

**_layout.tsx** - Tab navigator:
```tsx
import { Tabs } from 'expo-router';
import { ShoppingBag, ShoppingCart, Package, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Shop', tabBarIcon: ShoppingBag }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart', tabBarIcon: ShoppingCart }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: Package }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: User }} />
    </Tabs>
  );
}
```

**index.tsx** - Shop screen:
- Product grid with 2 columns
- Search bar
- Category filter chips
- Pull-to-refresh
- Loading skeleton
- Empty state when no products

**cart.tsx** - Cart screen:
- List of cart items with quantity controls
- Remove item button
- Subtotal calculation
- Checkout button
- Empty state when cart is empty

**orders.tsx** - Order history:
- List of orders with status badges
- Order items preview
- Total amount
- Created date
- Tap to view details
- Empty state when no orders

**profile.tsx** - Profile screen:
- User name and email
- Logout button
- App version
- Settings (future)

### 2. Additional Screens (2 hours)

**product/[id].tsx** - Product detail:
- Product image
- Name, description, price
- Category badge
- Add to cart button with quantity selector
- Back button

**checkout.tsx** - Checkout flow:
- Cart summary
- Total amount
- Place order button
- Success confirmation
- Navigate to orders after success

**forgot-password.tsx** - Password reset:
- Email input
- Send reset link button
- Success message
- Back to login link

### 3. Polish & UX (1-2 hours)

- Add loading skeletons to all screens
- Implement toast notifications (use `react-native-toast-message`)
- Add pull-to-refresh to all list screens
- Implement optimistic updates for cart
- Add error boundaries
- Test complete user flow

## Testing the App

### Test Credentials

- **Customer**: customer@test.com / Test1234!
- **Admin**: admin@test.com / Admin1234!

### Test Flow

1. **Registration**:
   - Open app → Sign Up
   - Enter name, email, password
   - Verify account created

2. **Login**:
   - Enter test credentials
   - Verify redirected to Shop screen

3. **Browse Products**:
   - View product grid
   - Search for products
   - Filter by category

4. **Add to Cart**:
   - Tap "Add to Cart" on product
   - Go to Cart tab
   - Verify item appears

5. **Checkout**:
   - Adjust quantities
   - Tap "Checkout"
   - Verify order created

6. **View Orders**:
   - Go to Orders tab
   - See order history
   - Verify order details

7. **Logout**:
   - Go to Profile tab
   - Tap "Logout"
   - Verify redirected to login

## Troubleshooting

### Can't connect to API

**Issue**: Network request failed

**Solution**:
- **iOS Simulator**: Use `http://localhost:3000`
- **Android Emulator**: Use `http://10.0.2.2:3000`
- **Physical Device**: Use your computer's IP (e.g., `http://192.168.1.5:3000`)

Update `EXPO_PUBLIC_API_URL` in `.env` accordingly.

### Authentication not working

**Issue**: User stays logged out

**Solution**:
1. Clear Expo cache: `expo start -c`
2. Verify Supabase credentials in `.env`
3. Check backend is running
4. Verify test accounts exist in Supabase

### Cart not persisting

**Issue**: Cart clears on app restart

**Solution**:
- Verify `loadCart()` is called in `_layout.tsx`
- Check AsyncStorage permissions
- Clear app data and try again

## Performance Tips

1. **Use TanStack Query for API calls**:
   - Automatic caching
   - Background refetching
   - Optimistic updates

2. **Memoize expensive computations**:
   ```tsx
   const total = useMemo(() => getTotal(), [items]);
   ```

3. **Use FlatList for long lists**:
   - Better performance than ScrollView
   - Virtualizes items

4. **Optimize images**:
   - Use Expo Image with placeholders
   - Lazy load images

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev)

## Support

For issues:
1. Check backend is running (`http://localhost:3000/health`)
2. Verify environment variables
3. Clear Expo cache: `expo start -c`
4. Check backend README for API docs

---

**Built with Expo + TypeScript + Supabase**
