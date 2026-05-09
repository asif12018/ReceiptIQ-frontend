import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-4">
            Receipt<span className="text-emerald-600 dark:text-emerald-500">IQ</span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            AI-driven wealth management. Stop tracking, start optimizing.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-zinc-900 dark:text-white font-semibold mb-4">Platform</h3>
          <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <li><Link href="/explore" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Templates</Link></li>
            <li><Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Dashboard</Link></li>
            <li><Link href="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Sign In</Link></li>
          </ul>
        </div>

        {/* Legal & Support */}
        <div>
          <h3 className="text-zinc-900 dark:text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <li><Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter (Contest Requirement) */}
        <div>
          <h3 className="text-zinc-900 dark:text-white font-semibold mb-4">Stay Updated</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">Get the latest AI financial tips.</p>
          <div className="flex gap-2">
            <Input type="email" placeholder="Your email" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white" />
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Subscribe</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-800 pt-8 text-center text-sm text-zinc-500 dark:text-zinc-500">
        &copy; {new Date().getFullYear()} ReceiptIQ. Built for Anigravity Contest. All rights reserved.
      </div>
    </footer>
  );
}
