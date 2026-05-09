"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOut, User, LayoutDashboard, Target } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center font-bold text-white">R</div>
          <Link href="/" className="text-xl font-bold tracking-tight text-white">ReceiptIQ</Link>
        </div>
        
        <div className="hidden md:flex gap-8">
          <Link href="/" className="text-sm font-medium text-emerald-400">Home</Link>
          <Link href="/explore" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Explore Templates</Link>
          <Link href="/about" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">About Us</Link>
        </div>

        <div className="relative">
          {isPending ? (
            <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse"></div>
          ) : session ? (
            <div>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full border-2 border-zinc-700 overflow-hidden hover:border-emerald-500 transition-all focus:outline-none"
              >
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden py-1">
                  <div className="px-4 py-3 border-b border-zinc-800 mb-1">
                    <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{session.user.email}</p>
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link href="/dashboard/goals" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white">
                    <Target className="w-4 h-4" /> Create Goal
                  </Link>
                  <div className="border-t border-zinc-800 mt-1 pt-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-zinc-800"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-6">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
