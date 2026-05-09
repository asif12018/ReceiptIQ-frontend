"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-32 relative overflow-hidden bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800/50">
      {/* Full-bleed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-indigo-500/10 dark:from-emerald-500/5 dark:via-transparent dark:to-indigo-500/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-400/10 dark:bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium text-sm mb-8 border border-emerald-200 dark:border-emerald-500/20">
            <Zap className="w-4 h-4 fill-current" />
            Free to start. No credit card required.
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8 leading-tight">
            Your money, finally{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-indigo-500">
              working for you.
            </span>
          </h2>

          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the thousands already using ReceiptIQ to take the guesswork out of personal finance. Set up in under 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="h-16 px-10 text-lg rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 group"
              >
                Start for Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 text-lg rounded-full border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                View Templates
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-600">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
