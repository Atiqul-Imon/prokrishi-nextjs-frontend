"use client";

import React from 'react';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton = ({ className = "", children }: SkeletonProps) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
      {children}
    </div>
  );
};

export const StatCardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-gray-300">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="w-12 h-12 rounded-xl" />
    </div>
    <div className="mt-4">
      <Skeleton className="h-6 w-32 rounded-full" />
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <Skeleton className="h-6 w-32" />
    </div>
    <div className="p-6 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <Skeleton className="h-32 w-full rounded-2xl" />
    
    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    
    {/* Content Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <TableSkeleton />
      <TableSkeleton />
    </div>
  </div>
);

export default Skeleton;
