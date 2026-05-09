"use client";

import { useRef } from "react";
import { motion, Variants } from "framer-motion";
import { BrainCircuit, ScanLine, Target, Sparkles, LineChart, ShieldCheck, MessageCircle } from "lucide-react";

const features = [
  {
    id: "ai-coach",
    title: "Agentic AI Coach",
    description:
      "Not just a chatbot. An autonomous agent that monitors your spending, predicts shortfalls, and proactively optimizes your budget in real-time.",
    icon: BrainCircuit,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-500/30",
  },
  {
    id: "smart-ocr",
    title: "Quantum-Fast OCR",
    description:
      "Snap a receipt and watch the magic. Our neural engine extracts every line item, tax, and vendor detail in milliseconds — auto-categorized for you.",
    icon: ScanLine,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "hover:border-indigo-500/30",
  },
  {
    id: "dynamic-goals",
    title: "Predictive Goals",
    description:
      "Set a savings target and let ReceiptIQ chart the course. Overspend today? Your daily allowance automatically recalibrates for the rest of the week.",
    icon: Target,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "hover:border-rose-500/30",
  },
  {
    id: "forecasting",
    title: "Cashflow Forecasting",
    description:
      "Peer into the future. Visualize your next month's financial health based on subscriptions, recurring bills, and historical spending patterns.",
    icon: LineChart,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/30",
  },
  {
    id: "ai-chat",
    title: "Financial Q&A Chat",
    description:
      "Ask anything — 'Can I afford a vacation this month?' or 'Where am I overspending?' — and get instant, data-backed answers from your AI advisor.",
    icon: MessageCircle,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "hover:border-cyan-500/30",
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function GameChangingFeatures() {
  const rightRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-32 relative bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Background ambient blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-emerald-500/5 dark:bg-emerald-500/8 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">

          {/* ── Left: CSS sticky (works with Lenis) ── */}
          <div className="lg:col-span-5 mb-16 lg:mb-0">
            <div className="lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6 border border-emerald-200 dark:border-emerald-500/20">
                  <Sparkles className="w-4 h-4" />
                  <span>Next-Gen Capabilities</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight">
                  Not just tracking.{" "}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500">
                    Total Financial Control.
                  </span>
                </h2>

                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                  ReceiptIQ combines multi-agent AI with predictive modeling to automate your financial growth — so you can focus on living.
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    End-to-end receipt categorization
                  </div>
                  <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                    <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                    AI-driven actionable financial insights
                  </div>
                  <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                    <Target className="w-5 h-5 text-emerald-500 shrink-0" />
                    Adaptive goal recalibration
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── Right: scrolling feature cards ── */}
          <motion.div
            ref={rightRef}
            className="lg:col-span-7 flex flex-col gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  variants={cardVariants}
                  className={`group relative bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/60 p-7 rounded-3xl overflow-hidden ${feature.border} transition-all duration-400 hover:shadow-xl`}
                >
                  {/* Hover shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-zinc-50 dark:group-hover:from-white/[0.02] dark:group-hover:to-transparent transition-all duration-500 pointer-events-none" />

                  <div className="relative z-10 flex gap-5 items-start">
                    <div className={`p-3.5 rounded-2xl ${feature.bg} ${feature.color} shrink-0`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
