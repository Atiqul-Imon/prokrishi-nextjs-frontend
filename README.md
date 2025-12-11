# Prokrishi Frontend (Legacy)

> This codebase is now legacy and no longer used in production. The active frontend lives in `../frontend-new`. Only update this directory for reference or migration purposes.

Modern e-commerce frontend built with Next.js 15, React 19, and TypeScript.

## 🚀 Quick Start

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp env.local.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)

### Production Deployment

**Deploy to Vercel**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

Quick deploy:
1. Push code to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy!

## 📚 Documentation

- **[Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)** - Complete Vercel deployment instructions
- **[Main Deployment Guide](../DEPLOYMENT_GUIDE.md)** - Full deployment guide (Backend + Frontend)
- **[Environment Variables](./env.local.example)** - Development environment template
- **[SWR Implementation](./SWR_IMPLEMENTATION.md)** - Data fetching documentation
- **[TypeScript Fixes](./TYPESCRIPT_FIXES.md)** - TypeScript configuration

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4
- **Data Fetching**: SWR (stale-while-revalidate)
- **Forms**: React Hook Form
- **Icons**: Heroicons & Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
frontend/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Auth pages
│   ├── account/         # User account pages
│   ├── cart/            # Shopping cart
│   ├── checkout/        # Checkout flow
│   ├── dashboard/       # Admin dashboard
│   ├── products/        # Product pages
│   ├── context/         # React context
│   └── layout.tsx       # Root layout
├── components/          # Reusable components
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
├── utils/               # Utility functions
├── public/              # Static assets
└── config/              # Configuration files
```

## 🔑 Environment Variables

### Required

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3500/api
```

### Optional

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_FACEBOOK_PAGE_ID=your_facebook_page_id
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_tracking_id
GENERATE_SOURCEMAP=true
```

See [env.local.example](./env.local.example) for complete list with descriptions.

## 📱 Features

### Customer Features
- 🛍️ Browse products with search and filters
- 📦 Product categories and collections
- 🛒 Shopping cart management
- ✅ Checkout with multiple payment methods
- 👤 User account and profile management
- 📍 Multiple delivery addresses
- 📝 Order history and tracking
- 🔐 Secure authentication (JWT)

### Admin Features
- 📊 Dashboard with analytics
- 🏷️ Product management (CRUD)
- 📂 Category management
- 👥 Customer management
- 📦 Order management
- 💰 Payment tracking
- 📈 Sales reports

### Technical Features
- ⚡ Fast page loads with SWR caching
- 🎨 Responsive design (mobile-first)
- 🖼️ Optimized images (Cloudinary + Next.js Image)
- 🔒 Secure authentication flow
- 📱 PWA ready
- 🌐 SEO optimized
- ♿ Accessible (WCAG 2.1)

## 🎨 Key Components

### Layout Components
- `Navbar` - Main navigation with cart
- `Footer` - Site footer
- `ContentContainer` - Content wrapper
- `Sidebar` - Admin dashboard sidebar

### Product Components
- `ProductCard` - Product display card
- `ProductGrid` - Product grid layout
- `FeaturedCategories` - Category showcase
- `HeroSection` - Homepage hero

### Form Components
- `LoginForm` - User login
- `RegisterForm` - User registration
- `ProductForm` - Product management
- `AddressForm` - Address management

### UI Components
- `EmptyState` - Empty state messages
- `LoadingSkeleton` - Loading placeholders
- `CheckoutProgress` - Checkout stepper
- `ChatWidget` - Facebook Messenger integration

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server (with Turbopack)
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run ESLint

# TypeScript
npm run type-check      # Check TypeScript errors
npm run type-check:watch # Watch mode type checking

# Testing
npm run test-build      # Test production build locally
```

## 🔐 Authentication Flow

1. **Registration**: User creates account with email/phone
2. **Login**: JWT tokens issued (access + refresh)
3. **Token Storage**: Stored in httpOnly cookies
4. **Protected Routes**: Middleware checks authentication
5. **Token Refresh**: Automatic refresh on expiry
6. **Logout**: Tokens cleared

## 📦 State Management

- **Global State**: React Context API
  - `AuthContext` - User authentication state
  - `CartContext` - Shopping cart state

- **Server State**: SWR
  - Automatic caching
  - Background revalidation
  - Optimistic updates
  - Error handling

## 🎯 Data Fetching Strategy

Using SWR for efficient data fetching:

```typescript
import useSWR from 'swr';
import { getProducts } from '@/utils/api';

// In component
const { data, error, isLoading } = useSWR('/product', getProducts);
```

Benefits:
- ⚡ Fast UI (cache-first)
- 🔄 Auto revalidation
- 🚀 Optimistic updates
- 💪 Error handling
- 🔌 Offline support

See [SWR_IMPLEMENTATION.md](./SWR_IMPLEMENTATION.md) for details.

## 🧪 Testing

```bash
# Build test
npm run test-build

# Type checking
npm run type-check

# Lint check
npm run lint
```

## 🐛 Debugging

### Common Issues

**API requests fail**
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Ensure backend is running
- Verify CORS settings on backend

**Images not loading**
- Check Cloudinary domain in `next.config.mjs`
- Verify image URLs are correct
- Check Cloudinary credentials

**TypeScript errors**
- Run `npm run type-check` to see all errors
- Check types in `types/` directory
- Ensure all dependencies are installed

**Build fails**
- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall
- Check for console errors

## 🚨 Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Backend URL configured correctly
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] Images loading from Cloudinary
- [ ] Authentication working
- [ ] Cart functionality working
- [ ] Checkout process working
- [ ] Admin dashboard accessible
- [ ] Mobile responsive
- [ ] SEO meta tags configured

## 🎨 Design System

### Colors
- Primary: Green (agriculture theme)
- Secondary: Gray
- Success: Green
- Error: Red
- Warning: Yellow

### Typography
- Headings: Mercellus (serif)
- Body: PT Serif
- UI: System fonts

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔒 Security Features

- ✅ HTTPS only (enforced by Vercel)
- ✅ Security headers configured
- ✅ XSS protection
- ✅ CSRF protection
- ✅ httpOnly cookies
- ✅ Input validation
- ✅ Rate limiting (backend)

## 📈 Performance Optimization

- ✅ Next.js Image optimization
- ✅ Code splitting (automatic)
- ✅ SWR caching
- ✅ Compression (Vercel)
- ✅ CDN (Vercel Edge Network)
- ✅ No source maps in production
- ✅ Lazy loading components

## 🌐 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📖 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/reference/react/use-server)

### Technology Documentation
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SWR Documentation](https://swr.vercel.app)
- [React Hook Form](https://react-hook-form.com)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Run type check and linting
5. Submit a pull request

## 📄 License

ISC License

## 🆘 Support

For deployment issues, see:
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- [Main Deployment Guide](../DEPLOYMENT_GUIDE.md)

For technical issues, check the documentation or create an issue.

---

**Ready to deploy?** Follow the [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md) to get started!
