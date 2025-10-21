# Vercel Deployment Guide - Prokrishi Frontend

This guide provides step-by-step instructions for deploying the Prokrishi frontend to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Code should be on GitHub, GitLab, or Bitbucket
3. **Backend URL**: Your Render backend URL (e.g., `https://prokrishi-backend.onrender.com`)

---

## Quick Deploy (Recommended)

### Step 1: Import Your Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select your Git provider (GitHub/GitLab/Bitbucket)
4. Import your repository

### Step 2: Configure Build Settings

Vercel will auto-detect Next.js, but verify these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `prokrishi-dev/frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: `18.x` or `20.x`

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

#### Required Variables

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-backend.onrender.com/api` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` | Production |

#### Optional Variables

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_FACEBOOK_APP_ID` | Your Facebook App ID | Production, Preview |
| `NEXT_PUBLIC_FACEBOOK_PAGE_ID` | Your Facebook Page ID | Production, Preview |
| `NEXT_PUBLIC_GA_TRACKING_ID` | Your Google Analytics ID | Production |
| `GENERATE_SOURCEMAP` | `false` | Production |

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 1-3 minutes for build to complete
3. Visit your deployed site!

---

## Using Vercel CLI (Alternative)

If you prefer command line:

### Install Vercel CLI

```bash
npm install -g vercel
```

### Login to Vercel

```bash
vercel login
```

### Navigate to Frontend Directory

```bash
cd prokrishi-dev/frontend
```

### Deploy

```bash
# For first deployment
vercel

# For production deployment
vercel --prod
```

### Set Environment Variables via CLI

```bash
# Production environment
vercel env add NEXT_PUBLIC_API_BASE_URL production
# Enter value: https://your-backend.onrender.com/api

vercel env add NEXT_PUBLIC_SITE_URL production
# Enter value: https://your-app.vercel.app
```

---

## Configuration Files

The project includes these configuration files:

### `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NEXT_PUBLIC_API_BASE_URL": "@next_public_api_base_url"
  }
}
```

This file is already configured and should work without modifications.

### `next.config.mjs`

The Next.js configuration is optimized for Vercel:

- Image optimization for Cloudinary
- Security headers
- No source maps in production
- Compression enabled

---

## Environment Variables Explained

### `NEXT_PUBLIC_API_BASE_URL`

- **Required**: Yes
- **Description**: Your backend API URL
- **Example**: `https://prokrishi-backend.onrender.com/api`
- **Note**: Must include `/api` at the end

### `NEXT_PUBLIC_SITE_URL`

- **Required**: Recommended
- **Description**: Your frontend URL for SEO and sharing
- **Example**: `https://prokrishi.vercel.app`
- **Note**: Used for Open Graph tags and canonical URLs

### `NEXT_PUBLIC_FACEBOOK_APP_ID`

- **Required**: Optional (only if using chat widget)
- **Description**: Facebook App ID for Messenger integration
- **Example**: `123456789012345`

### `NEXT_PUBLIC_FACEBOOK_PAGE_ID`

- **Required**: Optional (only if using chat widget)
- **Description**: Facebook Page ID for Messenger integration
- **Example**: `123456789012345`

### `NEXT_PUBLIC_GA_TRACKING_ID`

- **Required**: Optional
- **Description**: Google Analytics tracking ID
- **Example**: `G-XXXXXXXXXX`

### `GENERATE_SOURCEMAP`

- **Required**: Optional
- **Description**: Whether to generate source maps
- **Recommended**: `false` (reduces build size and protects code)

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to your project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `prokrishi.com`)

### Step 2: Configure DNS

Add these DNS records at your domain registrar:

#### For Root Domain (prokrishi.com)

**A Record:**
- Name: `@`
- Value: `76.76.21.21`

#### For Subdomain (www.prokrishi.com)

**CNAME Record:**
- Name: `www`
- Value: `cname.vercel-dns.com`

### Step 3: Wait for SSL

- Vercel automatically provisions SSL certificate
- Usually takes 1-5 minutes
- Status will show "Valid" when ready

### Step 4: Update Environment Variables

Update `NEXT_PUBLIC_SITE_URL` to your custom domain:

```
NEXT_PUBLIC_SITE_URL=https://prokrishi.com
```

Don't forget to update backend CORS settings too!

---

## Automatic Deployments

Vercel automatically deploys:

### Production Deployments

- **Trigger**: Push to `main` or `master` branch
- **URL**: Your production domain
- **Environment**: Production variables

### Preview Deployments

- **Trigger**: Push to any other branch or pull request
- **URL**: Unique preview URL (e.g., `prokrishi-git-feature-username.vercel.app`)
- **Environment**: Preview variables
- **Use Case**: Test changes before merging

### Development Deployments

- **Trigger**: `vercel` command (without `--prod`)
- **URL**: Unique development URL
- **Environment**: Development variables

---

## Vercel Dashboard Features

### Deployments

- View all deployments
- See build logs
- Rollback to previous deployments
- Promote preview to production

### Analytics

- Page views and visitors
- Real User Monitoring (RUM)
- Web Vitals scores
- Geographic distribution

### Logs

- Function logs
- Build logs
- Error tracking
- Real-time log streaming

### Settings

- Environment variables
- Custom domains
- Team members
- Git integration

---

## Optimizations for Vercel

### Already Configured

✅ **Image Optimization**: Automatic with Next.js Image component
✅ **Compression**: Enabled in `next.config.mjs`
✅ **Security Headers**: Configured in `next.config.mjs`
✅ **No Source Maps**: Set via environment variable

### Recommended

1. **Use Next.js Image Component**
   ```tsx
   import Image from 'next/image';
   
   <Image 
     src={product.image} 
     alt={product.name}
     width={400}
     height={400}
   />
   ```

2. **Enable Edge Caching**
   ```tsx
   // In page component
   export const revalidate = 3600; // Cache for 1 hour
   ```

3. **Use SWR for Data Fetching** (already implemented)
   - Automatic caching
   - Revalidation
   - Optimistic updates

---

## Troubleshooting

### Build Fails

**Error**: `Type error: Cannot find module...`
- **Solution**: Run `npm install` locally and commit `package-lock.json`

**Error**: `Module not found: Can't resolve '@/...'`
- **Solution**: Check `tsconfig.json` paths configuration

**Error**: TypeScript errors
- **Solution**: Run `npm run type-check` and fix all errors

### API Requests Fail

**Error**: `Failed to fetch` or `Network error`
- **Check**: `NEXT_PUBLIC_API_BASE_URL` is correct
- **Check**: Backend is running
- **Check**: CORS configured on backend

**Error**: `401 Unauthorized`
- **Check**: Authentication is working
- **Check**: Cookies are being sent (credentials: 'include')

### Images Not Loading

**Error**: Invalid src prop
- **Check**: Cloudinary domain in `next.config.mjs`
- **Check**: Image URLs are valid
- **Check**: Cloudinary credentials are correct

### Slow Build Times

- **Reduce dependencies**: Remove unused packages
- **Clear cache**: In Vercel dashboard, redeploy without cache
- **Optimize imports**: Use specific imports instead of barrel imports

### Preview Deployment Issues

**Issue**: Preview uses production variables
- **Solution**: Set separate preview environment variables in settings

**Issue**: Preview URL doesn't work
- **Solution**: Check build logs for errors

---

## Performance Monitoring

### Web Vitals

Vercel automatically tracks:
- **LCP** (Largest Contentful Paint) - Loading performance
- **FID** (First Input Delay) - Interactivity
- **CLS** (Cumulative Layout Shift) - Visual stability

View in: Dashboard → Analytics → Web Vitals

### Real User Monitoring (RUM)

- Actual user experience data
- Geographic performance
- Device-specific metrics

Enable in: Dashboard → Settings → Analytics

---

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env.local` to Git
- ✅ Use Vercel dashboard to set sensitive variables
- ✅ Prefix public variables with `NEXT_PUBLIC_`
- ✅ Rotate secrets regularly

### Headers

Already configured in `next.config.mjs`:
- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `Referrer-Policy: origin-when-cross-origin`

### Additional Recommendations

1. **Content Security Policy** (optional)
   ```js
   // Add to next.config.mjs headers
   {
     key: 'Content-Security-Policy',
     value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
   }
   ```

2. **Rate Limiting** (handled by backend)

3. **Input Validation** (use react-hook-form with validation)

---

## Scaling and Limits

### Vercel Hobby Plan (Free)

- **Bandwidth**: 100 GB/month
- **Builds**: 6,000 minutes/month
- **Serverless Function Execution**: 100 GB-Hours
- **Serverless Function Duration**: 10 seconds max
- **Team Members**: 1

### Vercel Pro Plan ($20/month)

- **Bandwidth**: 1 TB/month
- **Builds**: Unlimited
- **Function Duration**: 15 seconds
- **Team Members**: Unlimited
- **Priority Support**: Yes

### When to Upgrade

- High traffic (>100GB bandwidth/month)
- Long build times (>6000 min/month)
- Need longer function execution
- Need team collaboration

---

## Deployment Checklist

### Before First Deploy

- [ ] Code pushed to Git repository
- [ ] Backend deployed and URL obtained
- [ ] Environment variables documented
- [ ] Test build locally (`npm run build`)
- [ ] Fix all TypeScript errors

### During Deployment

- [ ] Vercel project created
- [ ] Root directory set to `prokrishi-dev/frontend`
- [ ] Environment variables added
- [ ] First deployment successful

### After Deployment

- [ ] Visit deployed URL and test
- [ ] Check all pages load correctly
- [ ] Test API integration
- [ ] Test image loading
- [ ] Test user authentication
- [ ] Test cart and checkout
- [ ] Update backend CORS settings
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/analytics

---

## Useful Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# View logs
vercel logs

# List environment variables
vercel env ls

# Pull environment variables to local
vercel env pull

# Link local project to Vercel
vercel link

# Remove deployment
vercel remove [deployment-url]
```

---

## Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Next.js Discord**: [nextjs.org/discord](https://nextjs.org/discord)
- **Vercel Support**: support@vercel.com (Pro plan)

---

## Quick Reference

### Environment Variables

```bash
# Production
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# Optional
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_FACEBOOK_PAGE_ID=your_facebook_page_id
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_tracking_id
GENERATE_SOURCEMAP=false
```

### Important Files

- `next.config.mjs` - Next.js configuration
- `vercel.json` - Vercel deployment settings
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration

### Useful URLs

- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Analytics: `https://vercel.com/[username]/[project]/analytics`
- Deployments: `https://vercel.com/[username]/[project]/deployments`
- Settings: `https://vercel.com/[username]/[project]/settings`

---

**Your frontend is now deployed on Vercel!** 🚀

For any issues, check the troubleshooting section or Vercel's documentation.

