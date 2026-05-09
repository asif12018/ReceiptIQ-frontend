"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Receipt, User, Shield, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/receipts", label: "Receipts", icon: Receipt },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function Sidebar({ role }: { role?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-6 flex flex-col h-full shrink-0">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
          R
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">ReceiptIQ</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        {role === "ADMIN" && (
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
              pathname === "/admin"
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                : "text-indigo-400/70 hover:bg-indigo-950/50 hover:text-indigo-300"
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            Platform Metrics
          </Link>
        )}
      </nav>

      <div className="mt-auto border-t border-zinc-800 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-white transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
