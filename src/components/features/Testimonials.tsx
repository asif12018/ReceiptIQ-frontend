"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Rafiq Hassan",
    role: "Freelance Designer",
    avatar: "R",
    color: "bg-indigo-600",
    review: "I used to dread month-end reconciliation. ReceiptIQ handles it automatically. My taxes are organized better than ever — and I barely lift a finger.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "Small Business Owner",
    avatar: "N",
    color: "bg-rose-600",
    review: "The AI coach caught a recurring subscription I forgot about. Saved me ৳1,200/month within the first week. This app literally paid for itself.",
    rating: 5,
  },
  {
    name: "Tanvir Ahmed",
    role: "Software Engineer",
    avatar: "T",
    color: "bg-amber-600",
    review: "The receipt scanning is almost magical. I snap a photo, and within 2 seconds it's categorized and logged. Flawless UX, incredible accuracy.",
    rating: 5,
  },
  {
    name: "Sadia Islam",
    role: "PhD Student",
    avatar: "S",
    color: "bg-emerald-600",
    review: "On a tight budget, I needed something powerful but simple. The goal tracking feature changed how I save. I hit my savings target for the first time in years.",
    rating: 5,
  },
  {
    name: "Karim Bhai",
    role: "Restaurant Owner",
    avatar: "K",
    color: "bg-violet-600",
    review: "Managing receipts for a restaurant is a nightmare. ReceiptIQ turned it into a 30-second task per day. My accountant loves me now.",
    rating: 5,
  },
  {
    name: "Maliha Chowdhury",
    role: "Marketing Manager",
    avatar: "M",
    color: "bg-cyan-600",
    review: "The dashboard is gorgeous and the insights are actually actionable. Not just pretty charts — real recommendations that make sense.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-32 bg-zinc-50 dark:bg-zinc-950/90 border-t border-zinc-200 dark:border-zinc-800/50 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4 fill-current" />
            <span>Real Users, Real Results</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4"
          >
            People love{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
              ReceiptIQ
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Join thousands who turned financial chaos into clarity.
          </motion.p>
        </div>

        {/* Stable grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (idx % 3) * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/60 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <Quote className="w-8 h-8 text-emerald-500/30 mb-4" />
              <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mb-6 flex-1">
                "{t.review}"
              </p>
              <div className="flex items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
