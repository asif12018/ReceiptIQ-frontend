"use client";

import { motion } from "framer-motion";
import { Camera, BrainCircuit, Target, ArrowRight } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Snap or Upload",
    description: "Simply take a picture of your receipt or upload a digital invoice. Our system supports dozens of formats.",
    icon: Camera,
  },
  {
    id: "02",
    title: "AI Analysis",
    description: "ReceiptIQ's models extract items, prices, and taxes in milliseconds, automatically categorizing your expenses.",
    icon: BrainCircuit,
  },
  {
    id: "03",
    title: "Achieve Goals",
    description: "Your dashboard updates instantly. Get real-time advice on how your spending impacts your weekly and monthly goals.",
    icon: Target,
  },
];

export function HowItWorks() {
  return (
    <section className="py-32 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6"
          >
            From receipt to <span className="text-emerald-500">insights</span> in seconds.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            A frictionless workflow designed to get out of your way. Spend less time tracking and more time living.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0" />

          {steps.map((step, idx) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="relative bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-8 relative z-10 mx-auto md:mx-0">
                <step.icon className="w-8 h-8 text-emerald-500" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-xs border border-emerald-200 dark:border-emerald-500/30">
                  {step.id}
                </div>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 text-center md:text-left">{step.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-center md:text-left leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
