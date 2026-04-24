# Getting Started with Mini Shop

This guide will help you set up and run the Mini Shop system in the correct order.

## Prerequisites

Before you begin, make sure you have:

- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ A Supabase account (sign up at [supabase.com](https://supabase.com))
- ✅ Expo CLI (install with `npm install -g expo-cli`)
- ✅ iOS Simulator (Mac only) or Android Emulator

## Step 1: Set Up Supabase (10 minutes)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Project name**: mini-shop
   - **Database password**: (generate a strong password and save it)
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

### 1.2 Run Database Migration

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open `/backend/supabase/migrations/001_initial_schema.sql` in your code editor
4. Copy all content and paste into Supabase SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

### 1.3 Seed the Database

1. In SQL Editor, create a new query
2. Open `/backend/supabase/seed.sql`
3. Copy all content and paste into SQL Editor
4. Click "Run"
5. Verify in **Table Editor**:
   - Categories table should have 3 rows
   - Products table should have 10 rows

### 1.4 Create Storage Bucket

1. Go to **Storage** in left sidebar
2. Click "New bucket"
3. Name it `product-images`
4. **Important**: Toggle on "Public bucket"
5. Click "Create bucket"

### 1.5 Create Test Accounts

**Customer Account:**
1. Go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter:
   - Email: `customer@test.com`
   - Password: `Test1234!`
   - ✅ Auto Confirm User (check this)
4. Click "Create user"

**Admin Account:**
1. Click "Add user" again
2. Enter:
   - Email: `admin@test.com`
   - Password: `Admin1234!`
   - ✅ Auto Confirm User
3. Click "Create user"
4. Go back to **SQL Editor** and run:
   ```sql
   UPDATE profiles SET role = 'admin'
   WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@test.com');
   ```

### 1.6 Get Your Credentials

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values (you'll need them soon):
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role secret** key (click "Reveal" first)

## Step 2: Set Up Backend API (5 minutes)

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment

```bash
cp .env.example .env
```

Edit `backend/.env` and fill in your Supabase credentials:

```env
NODE_ENV=development
PORT=3000

# Paste your Supabase credentials here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# These can stay as-is for local development
MOBILE_APP_URL=http://localhost:8081
ADMIN_DASHBOARD_URL=http://localhost:5173
```

### 2.3 Start the Backend

```bash
npm run dev
```

You should see:
```
🚀 Server is running!
📍 URL: http://localhost:3000
🌍 Environment: development
```

### 2.4 Test the API

Open a new terminal and run:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-01-15T..."}
```

If you see this, your backend is running correctly! ✅

**Keep this terminal running** and open a new one for the next steps.

## Step 3: Set Up Mobile App (5 minutes)

### 3.1 Install Dependencies

```bash
cd mobile
npm install
```

### 3.2 Configure Environment

```bash
cp .env.example .env
```

Edit `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

**Important**: Use the same Supabase URL and anon key from Step 1.6

### 3.3 Start Expo

```bash
npm start
```

You'll see a QR code and options:

```
› Press i │ open iOS simulator
› Press a │ open Android emulator
```

Choose your platform:
- **iOS**: Press `i` (Mac only)
- **Android**: Press `a` (requires Android Studio)
- **Physical device**: Scan QR code with Expo Go app

### 3.4 What to Expect

**Current Status**: The mobile app foundation is set up with:
- ✅ Project configuration
- ✅ Design system (colors, typography, spacing)
- ✅ Supabase client setup
- ✅ API client with authentication
- ✅ Cart store with Zustand

**Not Yet Implemented**:
- ❌ UI components (Button, Input, Card, etc.)
- ❌ Screens (Login, Shop, Cart, etc.)
- ❌ Navigation

To continue development, you'll need to implement the screens and components following the architecture in the plan.

## Step 4: Test the Backend API

Let's verify everything works by testing the API endpoints.

### 4.1 Test Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "Test1234!"
  }'
```

You should get a response with:
```json
{
  "user": {
    "id": "...",
    "email": "customer@test.com",
    "name": "customer@test.com",
    "role": "customer"
  },
  "session": {
    "access_token": "ey...",
    "refresh_token": "..."
  }
}
```

**Copy the `access_token`** - you'll need it for the next test.

### 4.2 Test Getting Products

```bash
curl http://localhost:3000/products
```

You should see a JSON array with 10 products.

### 4.3 Test Getting Your Orders

```bash
curl http://localhost:3000/orders/my \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

Replace `YOUR_ACCESS_TOKEN_HERE` with the token from step 4.1.

You should get an empty array `[]` (since you haven't created any orders yet).

### 4.4 Test Admin Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin1234!"
  }'
```

You should get a response with `"role": "admin"`.

## Step 5: Next Steps for Implementation

### Mobile App (4-6 hours)

1. **Create UI Components** (`mobile/src/components/ui/`)
   - Button.tsx
   - Input.tsx
   - Card.tsx
   - Badge.tsx
   - Skeleton.tsx
   - EmptyState.tsx

2. **Build Auth Screens** (`mobile/src/app/auth/`)
   - login.tsx
   - register.tsx
   - forgot-password.tsx

3. **Build Main Screens** (`mobile/src/app/(tabs)/`)
   - index.tsx (Shop screen with product grid)
   - cart.tsx (Cart screen)
   - orders.tsx (Order history)
   - profile.tsx (Profile with logout)

4. **Implement Features**
   - Product filtering and search
   - Add to cart functionality
   - Checkout flow
   - Order creation

### Admin Dashboard (3-4 hours)

1. **Set up Project**
   ```bash
   cd dashboard
   npm create vite@latest . -- --template react-ts
   npm install tailwindcss @tanstack/react-query react-router-dom axios
   ```

2. **Build Layout**
   - Sidebar navigation
   - Header with user info
   - Protected routes

3. **Create Pages**
   - Dashboard with KPI cards
   - Products CRUD
   - Orders management

### Polish (1-2 hours)

1. Add loading states and skeletons
2. Add error handling and toasts
3. Implement empty states
4. Add micro-animations
5. Test end-to-end flow

## Troubleshooting

### Backend won't start

**Error**: `SUPABASE_URL: Required`

**Solution**: Make sure your `backend/.env` file has all required variables filled in.

### Mobile app won't connect to backend

**Error**: Network request failed

**Solutions**:
1. Make sure backend is running (`http://localhost:3000/health` works)
2. If using iOS simulator: `http://localhost:3000` should work
3. If using Android emulator: Use `http://10.0.2.2:3000` instead
4. If using physical device: Use your computer's IP (e.g., `http://192.168.1.5:3000`)

### Supabase RLS blocking requests

**Error**: Row Level Security policy violation

**Solutions**:
1. Make sure you're logged in with a valid token
2. Check that the user's profile exists in the `profiles` table
3. For admin operations, verify the user has `role = 'admin'`

### Can't create admin account

**Solution**: Make sure you ran the SQL to update the role:
```sql
UPDATE profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@test.com');
```

## Project Structure

```
MiniShopConfidential/
├── backend/               ✅ Complete
│   ├── src/
│   │   ├── modules/      # Auth, Products, Orders
│   │   ├── middleware/   # Auth & error handling
│   │   └── schemas/      # Zod validation
│   └── supabase/         # Database migrations & seeds
├── mobile/               🔄 Foundation complete, screens needed
│   ├── src/
│   │   ├── app/         # Expo Router screens
│   │   ├── components/  # UI components
│   │   ├── features/    # Business logic
│   │   ├── lib/         # API & Supabase clients
│   │   └── theme/       # Design system
│   └── package.json
└── dashboard/            ❌ Not started
    └── (to be created)
```

## Need Help?

1. Check the detailed docs:
   - [Backend README](./backend/README.md)
   - [Supabase Setup](./backend/supabase/README.md)
   - [Main README](./README.md)

2. Review the implementation plan:
   - See `~/.claude/plans/quiet-fluttering-leaf.md`

3. Test the API endpoints:
   - Use the examples in `backend/README.md`

---

**You're now ready to start building!** 🚀

Follow the implementation plan and build out the remaining features step by step.
