'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image Component using ImageKit.io
 * Provides responsive images, lazy loading, and modern format support
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  placeholder = 'blur',
  blurDataURL,
  loading = 'lazy',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Generate ImageKit URL with optimizations
  const generateImageKitUrl = (originalSrc: string, width?: number, height?: number) => {
    if (!originalSrc) return '';
    
    // If it's already an ImageKit URL, return as is
    if (originalSrc.includes('ik.imagekit.io')) {
      return originalSrc;
    }

    // Convert to ImageKit URL with optimizations
    const baseUrl = 'https://ik.imagekit.io/6omjsz850';
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('f', 'auto'); // Auto format (WebP/AVIF)
    params.append('q', quality.toString());
    params.append('tr', 'w-auto,h-auto,c-maintain_ratio'); // Responsive transformations
    
    return `${baseUrl}${originalSrc}?${params.toString()}`;
  };

  // Generate responsive srcSet
  const generateSrcSet = (originalSrc: string) => {
    const breakpoints = [320, 640, 768, 1024, 1280, 1920];
    return breakpoints
      .map(w => `${generateImageKitUrl(originalSrc, w)} ${w}w`)
      .join(', ');
  };

  // Generate blur placeholder
  const generateBlurDataURL = (originalSrc: string) => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a low-quality placeholder
    const placeholderUrl = generateImageKitUrl(originalSrc, 20, 20);
    return `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  if (!isInView) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-100 animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      <Image
        src={generateImageKitUrl(src, width, height)}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={generateBlurDataURL(src)}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover'
        }}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}

// Responsive Image Hook
export const useResponsiveImage = (src: string, breakpoints: number[] = [320, 640, 768, 1024, 1280]) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [srcSet, setSrcSet] = useState('');

  useEffect(() => {
    if (!src) return;

    const generateSrcSet = () => {
      return breakpoints
        .map(w => `https://ik.imagekit.io/6omjsz850${src}?w=${w}&f=auto&q=75 ${w}w`)
        .join(', ');
    };

    setSrcSet(generateSrcSet());
    setCurrentSrc(`https://ik.imagekit.io/6omjsz850${src}?w=800&f=auto&q=75`);
  }, [src, breakpoints]);

  return { src: currentSrc, srcSet };
};

// ImageKit URL Generator Utility
export const generateImageKitUrl = (
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
    crop?: 'maintain_ratio' | 'force' | 'at_max';
    focus?: 'auto' | 'face' | 'center';
  } = {}
) => {
  if (!src) return '';
  
  const {
    width,
    height,
    quality = 75,
    format = 'auto',
    crop = 'maintain_ratio',
    focus = 'auto'
  } = options;

  const baseUrl = 'https://ik.imagekit.io/6omjsz850';
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('f', format);
  params.append('q', quality.toString());
  params.append('c', crop);
  params.append('fo', focus);
  
  return `${baseUrl}${src}?${params.toString()}`;
};

// Preload critical images
export const preloadImage = (src: string, options?: any) => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = generateImageKitUrl(src, options);
  document.head.appendChild(link);
};
