import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/shared/Footer";
import { ArrowLeft, CheckCircle2, TrendingUp, Compass, ShieldCheck, Target, Clock } from "lucide-react";
import { TEMPLATES } from "@/data/templates";
import { notFound } from "next/navigation";

// Since it's a dynamic route but we are using mock data, this is fine
export default async function ExploreDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = TEMPLATES.find((t) => t.id === id);

  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center font-bold text-white">R</div>
              <span className="text-xl font-bold tracking-tight text-white">ReceiptIQ</span>
            </Link>
          </div>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Home</Link>
            <Link href="/explore" className="text-sm font-medium text-emerald-400">Explore Templates</Link>
            <Link href="/about" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">About Us</Link>
          </div>
          <div>
            <Link href="/login">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-6">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Templates
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className={`h-48 bg-${template.color}-500/10 border-b border-zinc-800 flex items-center justify-center relative`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            <div className="relative z-10 scale-150">
              {template.icon}
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {template.category}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    template.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    template.difficulty === 'Medium' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {template.difficulty}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">{template.title}</h1>
              </div>
              <Link href="/dashboard/goals">
                <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-8 py-6 text-lg font-medium">
                  Adopt Plan
                </Button>
              </Link>
            </div>

            <div className="prose prose-invert prose-zinc max-w-none">
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                {template.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Key Benefits
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-zinc-400"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Builds financial discipline</li>
                    <li className="flex gap-3 text-zinc-400"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Automates your savings</li>
                    <li className="flex gap-3 text-zinc-400"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Reduces financial anxiety</li>
                  </ul>
                </div>
                <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    How to start
                  </h3>
                  <ol className="space-y-3 text-zinc-400 list-decimal list-inside">
                    <li>Click the <strong>Adopt Plan</strong> button above.</li>
                    <li>ReceiptIQ will create a tracked goal for you.</li>
                    <li>Start logging your receipts and tracking progress!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery (Simulated with colorful blocks and icons) */}
          <div className="p-8 md:p-12 border-t border-zinc-800 bg-zinc-950/50">
            <h3 className="text-2xl font-bold text-white mb-6">Template Preview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="h-40 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-zinc-800 flex items-center justify-center">
                <Target className="w-10 h-10 text-indigo-500/50" />
              </div>
              <div className="h-40 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-zinc-800 flex items-center justify-center">
                <Compass className="w-10 h-10 text-emerald-500/50" />
              </div>
              <div className="h-40 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-zinc-800 flex items-center justify-center hidden md:flex">
                <ShieldCheck className="w-10 h-10 text-rose-500/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Related Items Section */}
        <div className="mt-16 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Related Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMPLATES.filter(t => t.id !== template.id).slice(0, 3).map((t) => (
              <Link key={t.id} href={`/explore/${t.id}`} className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col h-full">
                <div className={`h-24 bg-${t.color}-500/10 border-b border-zinc-800 flex items-center justify-center`}>
                  <div className="group-hover:scale-110 transition-transform duration-300">{t.icon}</div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs font-semibold px-2.5 py-1 w-max rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 mb-3">{t.category}</span>
                  <h3 className="font-bold text-base text-white mb-2 group-hover:text-emerald-400 transition-colors">{t.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-auto">{t.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
