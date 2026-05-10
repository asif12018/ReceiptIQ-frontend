import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Shield,
  Heart,
  Target,
  TrendingUp,
  Brain,
  Award,
  Globe,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "About Us | ReceiptIQ – AI-Powered Financial Intelligence",
  description:
    "Learn about ReceiptIQ's mission to democratize financial intelligence with AI. Meet the team building the future of personal finance management.",
};

const team = [
  {
    name: "Asif Ahmed",
    role: "Founder & Lead Engineer",
    bio: "Passionate about making AI accessible for everyday financial decisions. Built ReceiptIQ to help people take control of their money.",
    avatar: "AA",
    color: "from-emerald-400 to-teal-500",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Priya Sharma",
    role: "AI & ML Engineer",
    bio: "Specialist in NLP and computer vision. Designed the OCR pipeline that extracts spending data from any receipt with 98% accuracy.",
    avatar: "PS",
    color: "from-indigo-400 to-purple-500",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Leo Tanaka",
    role: "UI/UX Designer",
    bio: "Crafts intuitive, delightful experiences that turn complex financial data into clear, actionable insights users actually enjoy.",
    avatar: "LT",
    color: "from-amber-400 to-orange-500",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Maria Costa",
    role: "Financial Analyst",
    bio: "10+ years in personal finance consulting. Translates deep domain expertise into ReceiptIQ's AI coaching and goal-setting algorithms.",
    avatar: "MC",
    color: "from-rose-400 to-pink-500",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
];

const values = [
  {
    icon: Brain,
    title: "AI-First Thinking",
    description:
      "Every feature is designed with intelligence at its core — not bolted on. We leverage large language models to give you advice that feels human.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10 dark:bg-indigo-500/10",
  },
  {
    icon: Shield,
    title: "Privacy by Design",
    description:
      "Your financial data is yours alone. We use end-to-end encryption and never sell your data. Transparency is non-negotiable.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Heart,
    title: "User Obsessed",
    description:
      "We ship features users actually ask for. Our roadmap is driven by real feedback, not boardroom assumptions.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Globe,
    title: "Accessible to All",
    description:
      "Financial literacy shouldn't be a privilege. We're committed to making smart money management affordable and multilingual.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const stats = [
  { value: "50K+", label: "Receipts Scanned", icon: TrendingUp },
  { value: "8K+", label: "Active Users", icon: Target },
  { value: "৳10M+", label: "Monthly Spend Tracked", icon: Award },
  { value: "98%", label: "OCR Accuracy", icon: Zap },
];

const milestones = [
  {
    year: "2024 Q1",
    title: "Project Inception",
    desc: "ReceiptIQ was born from a hackathon idea — what if AI could be your personal finance advisor?",
  },
  {
    year: "2024 Q3",
    title: "Core Engine Built",
    desc: "Shipped the OCR receipt scanner and first version of the AI spending coach powered by Gemini.",
  },
  {
    year: "2025 Q1",
    title: "Public Beta Launch",
    desc: "Opened to the public with 500 beta users. Collected thousands of data points to refine the models.",
  },
  {
    year: "2025 Q2",
    title: "Agentic Command Center",
    desc: "Launched the multi-agent dashboard with goal coaching, financial reports, and template library.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white dark:from-indigo-900/20 dark:via-zinc-950 dark:to-zinc-950 pointer-events-none" />
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl pointer-events-none animate-pulse [animation-delay:1.5s]" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-8 border border-indigo-200 dark:border-indigo-500/20">
              🚀 Our Story
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-none">
              We&apos;re on a Mission to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-indigo-500">
                Democratize
              </span>{" "}
              Financial Intelligence
            </h1>

            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              ReceiptIQ started as a simple question: why does smart financial
              advice only reach the wealthy? We built the answer — AI-powered
              money management for everyone.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-10 h-14 text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                >
                  Join Us Free
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 h-14 text-base border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    {value}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
                Our Mission
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                Turn Every Receipt into a{" "}
                <span className="text-emerald-500">Financial Lesson</span>
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-6">
                Traditional budgeting apps show you charts of your past. We
                show you the path to your future. ReceiptIQ combines real-time
                OCR scanning, multi-agent AI coaching, and behavioral finance
                principles to make every transaction a step toward your goals.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                We believe the gap between knowing your finances and mastering
                them should be zero. That&apos;s why we built an Agentic
                Command Center that doesn&apos;t just track — it coaches, plans,
                and acts.
              </p>
            </div>

            {/* Right: feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: "🧾",
                  title: "Instant Scanning",
                  desc: "Snap a receipt and get categorized spending data in under 2 seconds.",
                },
                {
                  icon: "🤖",
                  title: "AI Coach",
                  desc: "Gemini-powered advice that understands your financial context.",
                },
                {
                  icon: "🎯",
                  title: "Goal Engine",
                  desc: "Set savings goals and get a personalized roadmap to achieve them.",
                },
                {
                  icon: "📊",
                  title: "Smart Reports",
                  desc: "PDF financial reports with AI-generated insights and recommendations.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group"
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-24 px-4 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">
                What We Stand For
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Our Core Values
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ icon: Icon, title, description, color, bg }) => (
                <div
                  key={title}
                  className="relative p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-all duration-300 group overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${bg} pointer-events-none`}
                  />
                  <div
                    className={`relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-xl ${bg} ${color} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="relative z-10 text-lg font-bold text-zinc-900 dark:text-white mb-2">
                    {title}
                  </h3>
                  <p className="relative z-10 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
                Our Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                How We Got Here
              </h2>
            </div>

            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-indigo-500 to-transparent" />

              <div className="space-y-10">
                {milestones.map(({ year, title, desc }, i) => (
                  <div key={year} className="flex gap-6 group">
                    <div className="relative flex-shrink-0 mt-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1 pb-2">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        {year}
                      </span>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1 mb-2">
                        {title}
                      </h3>
                      <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="py-24 px-4 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-4">
                The People Behind the Product
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Meet Our Team
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-4 max-w-xl mx-auto">
                A small, focused team of engineers, designers, and finance
                experts driven by one goal: make your money work harder.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map(({ name, role, bio, avatar, color, links }) => (
                <div
                  key={name}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Avatar */}
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl font-extrabold mx-auto mb-4 shadow-md group-hover:scale-105 transition-transform`}
                  >
                    {avatar}
                  </div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                    {name}
                  </h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-3">
                    {role}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">
                    {bio}
                  </p>
                  {/* Social links */}
                  <div className="flex items-center justify-center gap-3">
                    {[links.github, links.linkedin, links.twitter].map(
                      (href, idx) => (
                        <a
                          key={idx}
                          href={href}
                          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          aria-label="Social link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative p-12 rounded-3xl bg-gradient-to-br from-emerald-500 to-indigo-600 overflow-hidden shadow-2xl shadow-emerald-500/20">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                  Ready to Transform Your Finances?
                </h2>
                <p className="text-emerald-100 mb-8 text-lg">
                  Join thousands of users who already let AI handle the heavy
                  lifting.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-full px-10 h-14 text-base font-semibold shadow-lg transition-all duration-300"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/explore">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/40 text-white hover:bg-white/10 rounded-full px-10 h-14 text-base"
                    >
                      Explore Templates
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
