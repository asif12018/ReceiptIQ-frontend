"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
    <section className="py-24 relative overflow-hidden bg-white dark:bg-zinc-950">
      <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <Mail className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
        <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">
          Smarter Finances, Delivered.
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
          Join 8,000+ users who get weekly AI-driven financial insights, tips on cutting hidden subscriptions, and exclusive features right in their inbox.
        </p>
        
        <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}>
          <input 
            type="email" 
            required 
            placeholder="Enter your email address" 
            className="flex-1 px-5 py-4 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
          />
          <Button type="submit" className="h-14 rounded-full px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20">
            Subscribe Now
          </Button>
        </form>
        <p className="text-xs text-zinc-500 mt-4">We respect your privacy. No spam, ever.</p>
      </div>
    </section>
  );
}
