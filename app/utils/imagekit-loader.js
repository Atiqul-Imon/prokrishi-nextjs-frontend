/**
 * ImageKit.io Custom Loader for Next.js Image Optimization
 * Provides automatic format selection, responsive sizing, and quality optimization
 */

const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/6omjsz850';

export default function imagekitLoader({ src, width, quality = 75 }) {
  // If it's already an ImageKit URL, return as is
  if (src.includes('ik.imagekit.io')) {
    return src;
  }

  // Remove leading slash if present
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  
  // Build ImageKit URL with optimizations
  const params = new URLSearchParams();
  
  // Add width for responsive sizing
  if (width) {
    params.append('w', width.toString());
  }
  
  // Auto format selection (WebP/AVIF)
  params.append('f', 'auto');
  
  // Quality optimization
  params.append('q', quality.toString());
  
  // Responsive transformations
  params.append('tr', 'w-auto,h-auto,c-maintain_ratio');
  
  // Progressive loading for better UX
  params.append('pr', 'true');
  
  // Auto optimization
  params.append('ao', 'true');
  
  return `${IMAGEKIT_URL_ENDPOINT}/${cleanSrc}?${params.toString()}`;
}

// Utility function for manual URL generation
export function generateImageKitUrl(src, options = {}) {
  const {
    width,
    height,
    quality = 75,
    format = 'auto',
    crop = 'maintain_ratio',
    focus = 'auto',
    blur = false,
    blurAmount = 10
  } = options;

  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('f', format);
  params.append('q', quality.toString());
  params.append('c', crop);
  params.append('fo', focus);
  
  if (blur) {
    params.append('bl', blurAmount.toString());
  }
  
  return `${IMAGEKIT_URL_ENDPOINT}/${cleanSrc}?${params.toString()}`;
}

// Responsive image URL generator
export function generateResponsiveImageUrls(src, breakpoints = [320, 640, 768, 1024, 1280, 1920]) {
  return breakpoints.map(width => ({
    width,
    url: generateImageKitUrl(src, { width, quality: 75 })
  }));
}

// Preload critical images
export function preloadImage(src, options = {}) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = generateImageKitUrl(src, options);
  document.head.appendChild(link);
}

// Generate blur placeholder
export function generateBlurPlaceholder(src, width = 20, height = 20) {
  return generateImageKitUrl(src, {
    width,
    height,
    quality: 20,
    blur: true,
    blurAmount: 10
  });
}
