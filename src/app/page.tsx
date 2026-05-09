import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Master Your Wealth with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">AI Precision</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Scan receipts instantly, get real-time coaching, and conquer your financial goals with our Agentic Command Center.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-8 h-14 text-lg">
                  Start Tracking Free
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                  Explore Templates
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Statistics Section */}
        <section className="py-20 border-y border-zinc-900 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-emerald-500 mb-2">৳10M+</p>
              <p className="text-zinc-400 font-medium">Tracked by Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-emerald-500 mb-2">50k+</p>
              <p className="text-zinc-400 font-medium">Receipts Scanned</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-emerald-500 mb-2">24/7</p>
              <p className="text-zinc-400 font-medium">AI Financial Coaching</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
