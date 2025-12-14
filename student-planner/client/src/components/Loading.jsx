import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin ${className}`} />
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="glass-panel p-8 flex flex-col items-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  </div>
);

export const SkeletonLoader = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-white/10 rounded-lg ${className}`}
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </>
  );
};

export const CardSkeleton = () => (
  <div className="glass-panel p-6 space-y-4">
    <SkeletonLoader className="h-6 w-1/3" />
    <SkeletonLoader className="h-4 w-full" />
    <SkeletonLoader className="h-4 w-2/3" />
    <div className="flex gap-2 mt-4">
      <SkeletonLoader className="h-10 w-24" />
      <SkeletonLoader className="h-10 w-24" />
    </div>
  </div>
);

export default LoadingSpinner;
