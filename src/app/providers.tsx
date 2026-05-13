"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { SystemGuard } from "@/components/shared/SystemGuard";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        networkMode: 'offlineFirst',
        refetchOnWindowFocus: true,
      },
      mutations: {
        networkMode: 'offlineFirst',
      }
    },
  }));

  return (
    <LenisProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <SystemGuard>
            {children}
          </SystemGuard>
        </ThemeProvider>
      </QueryClientProvider>
    </LenisProvider>
  );
}
