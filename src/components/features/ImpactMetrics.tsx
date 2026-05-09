"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BarChart3,
  BrainCircuit,
  Receipt,
  Target,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  {
    label: "Receipts Scanned",
    value: "50k+",
    icon: Receipt,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Goals Created",
    value: "12k+",
    icon: Target,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "AI Conversations",
    value: "80k+",
    icon: MessageSquare,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    label: "Avg. Savings Boost",
    value: "28%",
    icon: TrendingUp,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Active Users",
    value: "8k+",
    icon: BrainCircuit,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    label: "Reports Generated",
    value: "100k+",
    icon: BarChart3,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

export function ImpactMetrics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      countersRef.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.8, y: 15 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-28 bg-zinc-100 dark:bg-zinc-950 relative overflow-hidden border-t border-zinc-200 dark:border-zinc-800/50"
    >
      {/* grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-emerald-500/10 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4">
            The numbers speak for themselves
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            A growing community of financially empowered users trusts ReceiptIQ every single day.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/60 rounded-3xl p-8 flex flex-col items-center text-center hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-300"
              >
                <div className={`p-3 rounded-xl ${m.bg} ${m.color} mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  ref={(el) => { countersRef.current[idx] = el; }}
                  className="text-5xl font-extrabold text-zinc-900 dark:text-white mb-2"
                >
                  {m.value}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-500 font-medium uppercase tracking-widest">
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
