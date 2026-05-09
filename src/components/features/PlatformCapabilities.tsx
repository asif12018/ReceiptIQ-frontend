"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BrainCircuit,
  ScanLine,
  Target,
  Sparkles,
  LineChart,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: "ai-coach",
    title: "Agentic AI Coach",
    description:
      "Not just a chatbot — an autonomous agent that monitors your spending 24/7, predicts shortfalls before they happen, and proactively rebalances your budget.",
    icon: BrainCircuit,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    accent: "#10b981",
  },
  {
    id: "smart-ocr",
    title: "Quantum-Fast OCR",
    description:
      "Snap a photo. In under 2 seconds our neural engine extracts every line item, tax, and merchant detail — auto-categorized with 99.9% accuracy.",
    icon: ScanLine,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    accent: "#6366f1",
  },
  {
    id: "dynamic-goals",
    title: "Predictive Goal Engine",
    description:
      "Set a savings target and let the platform chart the route. Overspend Monday? Your daily allowance recalibrates automatically for the rest of the week.",
    icon: Target,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    accent: "#f43f5e",
  },
  {
    id: "forecasting",
    title: "Cashflow Forecasting",
    description:
      "Visualize next month's financial health based on subscriptions, recurring bills, and historical patterns — before a single penny is spent.",
    icon: LineChart,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    accent: "#f59e0b",
  },
  {
    id: "ai-chat",
    title: "Financial Q&A Intelligence",
    description:
      "Ask plain-English questions — 'Can I afford a vacation this month?' — and receive instant, data-backed answers grounded in your actual finances.",
    icon: MessageCircle,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    accent: "#06b6d4",
  },
];

export function PlatformCapabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Badge slides down
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: badgeRef.current,
            start: "top 88%",
          },
        }
      );

      // Headline word-by-word reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".word");
        gsap.fromTo(
          words,
          { opacity: 0, y: 30, rotateX: -40 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Text block fade
      gsap.fromTo(
        textBlockRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: textBlockRef.current,
            start: "top 85%",
          },
        }
      );

      // Cards: stagger slide-up
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Icon bounce on enter
        const icon = card.querySelector(".feature-icon");
        if (icon) {
          gsap.fromTo(
            icon,
            { scale: 0, rotate: -20 },
            {
              scale: 1,
              rotate: 0,
              duration: 0.5,
              delay: 0.2,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 relative bg-zinc-50 dark:bg-zinc-950 overflow-hidden"
    >
      {/* Ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-emerald-500/5 dark:bg-emerald-500/8 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-20 items-start">

          {/* ── Left: CSS sticky ── */}
          <div className="lg:col-span-5 mb-16 lg:mb-0">
            <div className="lg:sticky lg:top-28 space-y-6">

              <div ref={badgeRef} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-200 dark:border-emerald-500/20">
                <Sparkles className="w-4 h-4" />
                Platform Capabilities
              </div>

              <h2
                ref={headlineRef}
                className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight"
                style={{ perspective: "600px" }}
              >
                {"Not just tracking.".split(" ").map((w, i) => (
                  <span key={i} className="word inline-block mr-[0.3em]">{w}</span>
                ))}
                <br />
                {["Total", "Financial", "Control."].map((w, i) => (
                  <span
                    key={i}
                    className="word inline-block mr-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500"
                  >
                    {w}
                  </span>
                ))}
              </h2>

              <div ref={textBlockRef} className="space-y-5">
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  ReceiptIQ combines multi-agent AI with predictive modeling to automate your financial growth — so you spend less time managing money and more time living.
                </p>

                <div className="flex flex-col gap-3 pt-2">
                  {[
                    { icon: ShieldCheck, label: "End-to-end receipt categorization" },
                    { icon: Sparkles,    label: "AI-driven actionable insights" },
                    { icon: Target,      label: "Adaptive goal recalibration" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 font-medium">
                      <Icon className="w-5 h-5 text-emerald-500 shrink-0" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ── Right: feature cards ── */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  className="group relative bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/60 p-7 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700"
                >
                  {/* Subtle hover gradient */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                    style={{
                      background: `radial-gradient(400px circle at 50% 50%, ${feature.accent}0d, transparent 70%)`,
                    }}
                  />

                  <div className="relative z-10 flex gap-5 items-start">
                    <div className={`feature-icon p-3.5 rounded-2xl ${feature.bg} ${feature.color} shrink-0`}>
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
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
