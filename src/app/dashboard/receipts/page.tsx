"use client";

import { useState, useMemo } from "react";
import { useReceipts } from "@/hooks/useReceipts";
import { Receipt, Search, ScanLine, ShoppingBag, Utensils, Car, Zap } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Transport: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Shopping: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  Groceries: "bg-green-500/15 text-green-400 border-green-500/30",
  Utilities: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  General: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Food: Utensils,
  Groceries: ShoppingBag,
  Transport: Car,
  Utilities: Zap,
  Shopping: ShoppingBag,
};

function CategoryBadge({ category }: { category: string | null }) {
  const label = category || "General";
  const color = CATEGORY_COLORS[label] ?? CATEGORY_COLORS.General;
  const Icon = CATEGORY_ICONS[label] ?? Receipt;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export default function ReceiptsPage() {
  const { data: receipts, isLoading } = useReceipts();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(receipts?.map((r) => r.category || "General") ?? []);
    return ["All", ...Array.from(cats)];
  }, [receipts]);

  const filtered = useMemo(() => {
    return receipts?.filter((r) => {
      const matchCategory =
        selectedCategory === "All" || (r.category || "General") === selectedCategory;
      const matchSearch =
        !search ||
        r.merchantName?.toLowerCase().includes(search.toLowerCase()) ||
        (r.category || "").toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [receipts, search, selectedCategory]);

  const totalFiltered = filtered?.reduce((s, r) => s + r.totalAmount, 0) ?? 0;

  return (
    <div className="p-8 pb-32">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Receipt className="w-8 h-8 text-indigo-500" />
          Receipts
        </h1>
        <p className="text-zinc-400 mt-1">All your scanned receipts in one place.</p>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search merchant or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      {!isLoading && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-zinc-500">
            {filtered?.length ?? 0} receipt{filtered?.length !== 1 ? "s" : ""}
          </span>
          <span className="text-sm font-semibold text-indigo-400">
            Total: ৳ {totalFiltered.toLocaleString()}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-zinc-800">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4 gap-4">
                <div className="h-4 w-40 bg-zinc-800 animate-pulse rounded" />
                <div className="h-4 w-20 bg-zinc-800 animate-pulse rounded" />
                <div className="h-5 w-16 bg-zinc-800 animate-pulse rounded-full" />
                <div className="h-4 w-24 bg-zinc-800 animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : !filtered?.length ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <ScanLine className="w-12 h-12 text-zinc-700" />
            <p className="text-zinc-500">No receipts found.</p>
            <p className="text-zinc-600 text-sm">Use the chat bar below to scan a receipt.</p>
          </div>
        ) : (
          <>
            {/* Header row */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-zinc-800 bg-zinc-950/50">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Merchant</span>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Amount</span>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</span>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</span>
            </div>
            <div className="divide-y divide-zinc-800/60">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-zinc-800/30 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      {r.merchantName || "Unknown Merchant"}
                    </p>
                    {r.items && r.items.length > 0 && (
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {r.items.length} item{r.items.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-white text-right whitespace-nowrap">
                    ৳ {r.totalAmount.toLocaleString()}
                  </span>
                  <CategoryBadge category={r.category} />
                  <span className="text-xs text-zinc-500 whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
