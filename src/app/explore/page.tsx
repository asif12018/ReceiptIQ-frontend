"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/shared/Footer";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, Compass, Target, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";

import { TEMPLATES } from "@/data/templates";

export default function ExplorePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as any;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const aiRecommendation = useMemo(() => {
    if (!user) return null;
    
    const income = user.monthlyIncome || 0;
    const occupation = user.occupation || "OTHER";
    
    if (occupation === "STUDENT" || income < 30000) {
      return TEMPLATES.find(t => t.id === "50-30-20-rule");
    } else if (income > 80000) {
      return TEMPLATES.find(t => t.id === "travel-fund-europe");
    } else if (occupation === "FREELANCER" || occupation === "BUSINESS") {
      return TEMPLATES.find(t => t.id === "6-month-emergency");
    } else {
      return TEMPLATES.find(t => t.id === "debt-snowball");
    }
  }, [user]);

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(t => 
      t.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      t.category.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch]);

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

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Compass className="w-8 h-8 text-emerald-500" />
              Explore Templates
            </h1>
            <p className="text-zinc-400 mt-2">Discover popular saving challenges and financial plans curated by ReceiptIQ.</p>
          </div>
          
          <div className="relative w-full md:w-96 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search templates or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>
        
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
            <Compass className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-300">No templates found</h3>
            <p className="text-zinc-500">Try adjusting your search term.</p>
          </div>
        ) : (
          <>
            {aiRecommendation && searchTerm === "" && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" /> AI Recommended for you
                </h2>
                <div className="bg-zinc-900 border-2 border-indigo-500/50 rounded-2xl overflow-hidden hover:border-indigo-400 transition-all hover:shadow-lg hover:shadow-indigo-900/20 group flex flex-col md:flex-row relative">
                  <div className="absolute top-4 right-4 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/20 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Perfect match
                  </div>
                  <div className={`w-full md:w-64 h-48 md:h-auto bg-${aiRecommendation.color}-500/10 border-b md:border-b-0 md:border-r border-zinc-800 flex items-center justify-center shrink-0`}>
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {aiRecommendation.icon}
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {aiRecommendation.category}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        aiRecommendation.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        aiRecommendation.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {aiRecommendation.difficulty}
                      </span>
                    </div>
                    <h3 className="font-bold text-2xl text-white mb-3 group-hover:text-indigo-400 transition-colors">{aiRecommendation.title}</h3>
                    <p className="text-zinc-400 mb-6 flex-1 text-sm md:text-base">
                      {aiRecommendation.description}
                    </p>
                    <Link href={`/explore/${aiRecommendation.id}`} className="mt-auto">
                      <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-xl font-bold text-white mb-6">All Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-900/20 group flex flex-col">
                <div className={`h-32 bg-${template.color}-500/10 border-b border-zinc-800 flex items-center justify-center`}>
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {template.icon}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {template.category}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      template.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      template.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {template.difficulty}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2 leading-tight group-hover:text-emerald-400 transition-colors">{template.title}</h3>
                  <p className="text-sm text-zinc-400 mb-6 flex-1 line-clamp-3">
                    {template.description}
                  </p>
                  <Link href={`/explore/${template.id}`} className="mt-auto">
                    <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
