'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode;
}

export default function ContentContainer({ children }: ContentContainerProps) {
  const pathname = usePathname();
  
  // Dashboard routes should remain full width
  const isDashboard = pathname?.startsWith('/dashboard');
  
  if (isDashboard) {
    // Dashboard: Full width, no container
    return <>{children}</>;
  }
  
  // Public pages: 
  // - Mobile/Tablet: Full width (100%)
  // - Large screens (1024px+): 50% viewport width, centered
  return (
    <div className="w-full bg-white min-h-screen lg:max-w-[50vw]">
      {children}
    </div>
  );
}

