"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/shared/Footer";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, Compass, Sparkles, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { TEMPLATES } from "@/data/templates";

export default function ExplorePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as any;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [sortBy, setSortBy] = useState("A-Z");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const aiRecommendation = useMemo(() => {
    if (!user) return null;
    const income = user.monthlyIncome || 0;
    const occupation = user.occupation || "OTHER";
    if (occupation === "STUDENT" || income < 30000) return TEMPLATES.find(t => t.id === "50-30-20-rule");
    else if (income > 80000) return TEMPLATES.find(t => t.id === "travel-fund-europe");
    else if (occupation === "FREELANCER" || occupation === "BUSINESS") return TEMPLATES.find(t => t.id === "6-month-emergency");
    else return TEMPLATES.find(t => t.id === "debt-snowball");
  }, [user]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(TEMPLATES.map(t => t.category)))], []);
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filteredAndSortedTemplates = useMemo(() => {
    let result = TEMPLATES.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || t.category.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchCat = categoryFilter === "All" || t.category === categoryFilter;
      const matchDiff = difficultyFilter === "All" || t.difficulty === difficultyFilter;
      return matchSearch && matchCat && matchDiff;
    });

    if (sortBy === "A-Z") result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "Z-A") result.sort((a, b) => b.title.localeCompare(a.title));
    else if (sortBy === "Difficulty") {
      const diffOrder: Record<string, number> = { "Easy": 1, "Medium": 2, "Hard": 3 };
      result.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
    }

    return result;
  }, [debouncedSearch, categoryFilter, difficultyFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedTemplates.length / itemsPerPage);
  const paginatedTemplates = filteredAndSortedTemplates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when filters change
  useMemo(() => setCurrentPage(1), [debouncedSearch, categoryFilter, difficultyFilter, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center font-bold text-white">R</div>
            <span className="text-xl font-bold tracking-tight text-white">ReceiptIQ</span>
          </Link>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Home</Link>
            <Link href="/explore" className="text-sm font-medium text-emerald-400">Explore Templates</Link>
            <Link href="/about" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">About Us</Link>
          </div>
          <Link href="/login"><Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-6">Login</Button></Link>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Compass className="w-8 h-8 text-emerald-500" />
              Explore Templates
            </h1>
            <p className="text-zinc-400 mt-2">Discover popular saving challenges and financial plans.</p>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input type="text" placeholder="Search templates..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
                <Filter className="w-4 h-4 text-zinc-500" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-transparent text-sm text-zinc-300 outline-none">
                  {categories.map(c => <option key={c} value={c} className="bg-zinc-900">{c === "All" ? "All Categories" : c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
                <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="bg-transparent text-sm text-zinc-300 outline-none">
                  {difficulties.map(d => <option key={d} value={d} className="bg-zinc-900">{d === "All" ? "All Difficulties" : d}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 ml-auto">
                <span className="text-xs text-zinc-500">Sort:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm text-zinc-300 outline-none">
                  <option value="A-Z" className="bg-zinc-900">A-Z</option>
                  <option value="Z-A" className="bg-zinc-900">Z-A</option>
                  <option value="Difficulty" className="bg-zinc-900">Difficulty</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {aiRecommendation && searchTerm === "" && categoryFilter === "All" && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-400" /> AI Recommended</h2>
            <div className="bg-zinc-900 border-2 border-indigo-500/50 rounded-2xl overflow-hidden hover:border-indigo-400 transition-all flex flex-col md:flex-row relative">
              <div className="absolute top-4 right-4 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/20"><Sparkles className="w-3.5 h-3.5 inline" /> Perfect match</div>
              <div className={`w-full md:w-64 h-48 md:h-auto bg-${aiRecommendation.color}-500/10 border-r border-zinc-800 flex justify-center items-center`}>{aiRecommendation.icon}</div>
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">{aiRecommendation.category}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-zinc-800/50 text-indigo-400 border-indigo-500/20">{aiRecommendation.difficulty}</span>
                </div>
                <h3 className="font-bold text-2xl text-white mb-3">{aiRecommendation.title}</h3>
                <p className="text-zinc-400 mb-6">{aiRecommendation.description}</p>
                <Link href={`/explore/${aiRecommendation.id}`}><Button className="bg-indigo-600 hover:bg-indigo-500 text-white">View Details</Button></Link>
              </div>
            </div>
          </div>
        )}

        {paginatedTemplates.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
            <Compass className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-300">No templates found</h3>
            <p className="text-zinc-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-bold text-white">Templates</h2>
              <span className="text-sm text-zinc-500">Showing {paginatedTemplates.length} of {filteredAndSortedTemplates.length}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {paginatedTemplates.map((template) => (
                <div key={template.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col">
                  <div className={`h-32 bg-${template.color}-500/10 border-b border-zinc-800 flex items-center justify-center`}>{template.icon}</div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">{template.category}</span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-zinc-800/50 text-emerald-400 border-emerald-500/20">{template.difficulty}</span>
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2">{template.title}</h3>
                    <p className="text-sm text-zinc-400 mb-6 flex-1 line-clamp-3">{template.description}</p>
                    <Link href={`/explore/${template.id}`} className="mt-auto">
                      <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"><ChevronLeft className="w-4 h-4 mr-2" /> Previous</Button>
                <span className="text-sm text-zinc-400">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Next <ChevronRight className="w-4 h-4 ml-2" /></Button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
