import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { GameChangingFeatures } from "@/components/features/GameChangingFeatures";
import { PlatformCapabilities } from "@/components/features/PlatformCapabilities";
import { HowItWorks } from "@/components/features/HowItWorks";
import { ImpactMetrics } from "@/components/features/ImpactMetrics";
import { Testimonials } from "@/components/features/Testimonials";
import { CTABanner } from "@/components/features/CTABanner";
import { FAQ } from "@/components/features/FAQ";
import { Newsletter } from "@/components/features/Newsletter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100 via-white to-white dark:from-emerald-900/20 dark:via-zinc-950 dark:to-zinc-950 pointer-events-none" />
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl pointer-events-none animate-pulse [animation-delay:2s]" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-8 border border-emerald-200 dark:border-emerald-500/20">
              ✨ AI-Powered Financial Intelligence
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-none">
              Master Your Wealth<br />
              with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-indigo-500">
                AI Precision
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Scan receipts instantly, get real-time coaching, and conquer your financial goals with our Agentic Command Center.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-10 h-16 text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300">
                  Start Tracking Free
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white">
                  Explore Templates
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex items-center justify-center gap-8 flex-wrap">
              {["50k+ Receipts Scanned", "8k+ Active Users", "৳10M+ Tracked"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sections */}
        <HowItWorks />
        <PlatformCapabilities />
        <ImpactMetrics />
        <Testimonials />
        <FAQ />
        <Newsletter />
        <CTABanner />
      </main>

      <Footer />
    </div>
  );
}
