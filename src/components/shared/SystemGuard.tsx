"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Loader2, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function SystemGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const { data: config, isLoading: isConfigLoading } = useQuery({
    queryKey: ["system-config"],
    queryFn: async () => {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${API}/users/system-config`);
      const json = await res.json();
      return json.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });

  const isMaintenanceMode = config?.maintenanceMode;
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  // If maintenance mode is enabled, non-admins should see the maintenance page.
  // We can let them view the login page so admins can still log in!
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/verify-email");

  if (!isConfigLoading && isMaintenanceMode && !isAdmin && !isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-4">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <Settings className="w-10 h-10 text-emerald-500 animate-[spin_3s_linear_infinite]" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Under Maintenance</h1>
        <p className="text-zinc-400 text-center max-w-md mb-8">
          We are currently updating our systems to bring you a better ReceiptIQ experience. Please check back soon!
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
