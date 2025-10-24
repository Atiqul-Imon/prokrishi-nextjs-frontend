/**
 * Image Optimization Utility
 * Optimizes external image URLs (Unsplash, ImageKit, etc.)
 */

export function optimizeImageUrl(url: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'auto';
}): string {
  if (!url) return '/img/placeholder.png';

  const { width = 400, height = 400, quality = 75, format = 'auto' } = options || {};

  // Optimize Unsplash images
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    params.set('w', width.toString());
    params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('fm', format);
    params.set('fit', 'crop');
    params.set('auto', 'format'); // Auto format detection
    
    // Remove existing params and add optimized ones
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?${params.toString()}`;
  }

  // Optimize ImageKit images
  if (url.includes('imagekit.io')) {
    // ImageKit transformation parameters
    const transformations = [];
    
    if (width) transformations.push(`w-${width}`);
    if (height) transformations.push(`h-${height}`);
    if (quality) transformations.push(`q-${quality}`);
    if (format && format !== 'auto') transformations.push(`f-${format}`);
    
    // Add crop mode for consistent sizing
    transformations.push('c-maintain_ratio');
    
    // Insert transformation into URL
    if (url.includes('/tr:')) {
      // Replace existing transformations
      const baseUrl = url.split('/tr:')[0];
      return `${baseUrl}/tr:${transformations.join(',')}/${url.split('/').pop()}`;
    } else {
      // Add new transformations
      const pathParts = url.split('/');
      const fileName = pathParts.pop();
      const basePath = pathParts.join('/');
      return `${basePath}/tr:${transformations.join(',')}/${fileName}`;
    }
  }

  // Legacy Cloudinary support (for existing images)
  if (url.includes('cloudinary.com')) {
    // Cloudinary transformation parameters
    const transformation = `w_${width},h_${height},c_fill,q_${quality},f_auto`;
    
    // Insert transformation into URL
    if (url.includes('/upload/')) {
      return url.replace('/upload/', `/upload/${transformation}/`);
    }
  }

  // Return as-is for other URLs
  return url;
}

/**
 * Get optimized image URL for different use cases
 */
export const getProductImageUrl = (url: string, size: 'thumbnail' | 'card' | 'detail' | 'full' = 'card') => {
  const sizeMap = {
    thumbnail: { width: 150, height: 150, quality: 70 },
    card: { width: 400, height: 400, quality: 75 },
    detail: { width: 800, height: 800, quality: 85 },
    full: { width: 1200, height: 1200, quality: 90 },
  };

  return optimizeImageUrl(url, sizeMap[size]);
};

/**
 * Get optimized category image URL
 */
export const getCategoryImageUrl = (url: string) => {
  return optimizeImageUrl(url, { width: 200, height: 200, quality: 75 });
};

/**
 * Get optimized hero/banner image URL
 */
export const getHeroImageUrl = (url: string) => {
  return optimizeImageUrl(url, { width: 1200, height: 600, quality: 80 });
};

