# TypeScript Migration - Remaining Fixes

## Summary
The TypeScript migration is ~90% complete. All files have been converted, type definitions created, and core infrastructure is in place. Remaining: ~195 type errors to fix.

## What's Been Completed ✅
- ✅ All 69 files renamed from .jsx/.js to .tsx/.ts
- ✅ TypeScript dependencies installed
- ✅ tsconfig.json created with moderate strictness
- ✅ Comprehensive type definitions in types/ directory
- ✅ API utils fully typed
- ✅ Auth & Cart contexts fully typed
- ✅ Yup removed, Zod schemas created
- ✅ Root layout and main page converted

## Remaining Type Errors by Category

### 1. Empty Dashboard Pages (6 errors) - FIXED ✅
- ✅ dashboard/profile/page.tsx - Added placeholder content
- ✅ dashboard/reports/page.tsx - Added placeholder content  
- ✅ dashboard/settings/page.tsx - Added placeholder content

### 2. useState Type Issues (~50 errors)
**Pattern:** `useState(null)` needs proper typing

**Files to fix:**
- `app/dashboard/customers/[id]/page.tsx` - Line 47: `useState<User | null>(null)`
- `app/dashboard/categories/edit/[id]/page.tsx` - Line 27: `useState<Category | null>(null)`
- `app/dashboard/orders/[id]/page.tsx` - Lines 19, 21, 24: Proper state types needed
- `app/checkout/page.tsx` - Line 92: Address state type issue

**Fix template:**
```typescript
// Before:
const [data, setData] = useState(null);

// After:
const [data, setData] = useState<DataType | null>(null);
```

### 3. Dynamic Route Params (~20 errors)
**Pattern:** `params.id` is `ParamValue` which can be undefined

**Files to fix:**
- `app/dashboard/categories/[id]/page.tsx`
- `app/dashboard/categories/edit/[id]/page.tsx`
- `app/dashboard/customers/[id]/page.tsx`
- All [id] dynamic routes

**Fix template:**
```typescript
// Add interface at top of file:
interface PageProps {
  params: { id: string }
}

// Then use:
export default function Page({ params }: PageProps) {
  const id = params.id; // Now properly typed as string
}
```

### 4. Component Props Missing (~15 errors)
**Files:**
- `app/dashboard/categories/CategoryForm.tsx` - Line 100: errors prop type
- `app/dashboard/categories/add/page.tsx` - Missing `initial` prop
- `app/checkout/page.tsx` - AddressForm prop mismatch

**Fix:** Update component prop interfaces to match usage

### 5. Dashboard Layout (~3 errors)
**File:** `app/dashboard/layout.tsx`
- Line 25: Style tag jsx prop
- Line 49: Sidebar current prop

**Fix:**
```typescript
// Line 25: Remove jsx prop from <style>
<style dangerouslySetInnerHTML={{...}} />

// Line 49: Fix Sidebar
<Sidebar current={pathname || ''} />
```

### 6. Data Property Access (~30 errors)
**Pattern:** Accessing properties on `never` type - usually from untyped state/props

**Files:**
- `app/dashboard/customers/[id]/page.tsx` - customer properties
- `app/dashboard/orders/[id]/page.tsx` - order and user properties  
- `app/checkout/page.tsx` - address properties

**Fix:** Properly type the state variable holding the data

### 7. Pagination Type Issues (~15 errors)
**File:** `app/dashboard/customers/page.tsx`
- Lines 148, 158, 167, 171: Type mismatches
- Lines 179, 182, 188: Pagination object properties

**Fix:**
```typescript
const [pagination, setPagination] = useState({
  page: 1,
  totalPages: 1,
  total: 0
});
```

### 8. Contact Form (~1 error)
**File:** `app/contact/ContactClient.tsx` - Line 89
Type 'string' not assignable to 'number'

**Fix:** Cast or parse the string value properly

## Quick Fix Commands

### Run these in order:

```bash
cd /home/atiqul-islam/prokrishi-v2/prokrishi-dev/frontend

# 1. Check current error count
npm run type-check 2>&1 | grep "error TS" | wc -l

# 2. For development, you can use the app with some errors by adding:
# In tsconfig.json, temporarily set:
#   "noEmitOnError": false

# 3. Or build with Next.js which is more forgiving:
npm run build
```

## Systematic Fix Approach

### Step 1: Fix all useState(null) issues
Run this find/replace in VS Code:
- Find: `useState\(null\)`
- Replace: `useState<any | null>(null)`
- Files: All .tsx files

### Step 2: Fix all dynamic route params
Add to each [id] page file:
```typescript
interface PageProps {
  params: { id: string; token?: string }
}

export default function Page({ params }: PageProps) {
```

### Step 3: Add missing component props
Review each component error and add missing props to interfaces

### Step 4: Fix Order interface street/city fields
Update Order interface if backend returns different address structure

## Priority Fixes (Most Impact)

1. **dashboard/layout.tsx** - Blocks all dashboard pages
2. **checkout/page.tsx** - Critical user flow
3. **All [id] pages** - Common pattern
4. **EmptyState component** - Used everywhere

## Notes
- TypeScript will still provide autocomplete and type checking even with errors
- Next.js dev server will run despite type errors
- Production build requires all errors fixed
- Most errors are mechanical and follow patterns above

