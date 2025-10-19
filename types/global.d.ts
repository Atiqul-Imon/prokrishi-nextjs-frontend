// Global type declarations

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: any;
  }
}

// Extend Next.js types
declare module 'next' {
  export interface PageParams {
    params: {
      id: string;
      token?: string;
    };
    searchParams?: {
      [key: string]: string | string[] | undefined;
    };
  }
}

export {};

