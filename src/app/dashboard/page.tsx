"use client";

import AgenticChat from "@/components/features/AgenticChat";
import GoalCoach from "@/components/features/GoalCoach";
import { useMonthlySpend, useReceipts } from "@/hooks/useReceipts";
import { authClient } from "@/lib/auth-client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, LineChart, Line, CartesianGrid,
} from "recharts";
import { useMemo, useEffect } from "react";
import { TrendingUp, Wallet, AlertTriangle, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSettings } from "@/hooks/useSettings";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { usePDF } from "react-to-pdf";
import { Download, Sparkles as SparklesIcon } from "lucide-react";
import { useGoals, useAiAdvice } from "@/hooks/useGoals";

// ─── Recent Receipts ───────────────────────────────────────────────────────
function RecentReceipts() {
  const { receipts, isLoading } = useMonthlySpend();
  const { currency } = useSettings();
  if (isLoading) {
    return (
      <div className="divide-y divide-zinc-800">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 gap-4">
            <div className="h-4 w-36 bg-zinc-800 animate-pulse rounded" />
            <div className="h-4 w-16 bg-zinc-800 animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!receipts || receipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-zinc-800/80 rounded-lg gap-2 bg-zinc-900/30">
        <Sparkles className="w-6 h-6 text-indigo-500/50 mb-1" />
        <p className="text-zinc-400 text-sm font-medium">No recent transactions</p>
        <p className="text-zinc-600 text-xs">Scan a receipt or type an expense below</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-800/60">
      {receipts.slice(0, 6).map((r) => (
        <div key={r.id} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-zinc-100">{r.merchantName || "Unknown"}</p>
            <p className="text-xs text-zinc-500">
              {r.category || "General"} ·{" "}
              {new Date(r.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short" })}
            </p>
          </div>
          <span className="text-sm font-semibold text-indigo-400 shrink-0">
            {currency} {r.totalAmount.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Category Breakdown ────────────────────────────────────────────────────
const CAT_COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#ec4899", "#10b981", "#8b5cf6", "#f97316"];

function CategoryBreakdown() {
  const { receipts, isLoading } = useMonthlySpend();
  const { currency } = useSettings();

  const data = useMemo(() => {
    if (!receipts) return [];
    const map: Record<string, number> = {};
    receipts.forEach((r) => {
      const cat = r.category || "General";
      map[cat] = (map[cat] || 0) + r.totalAmount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [receipts]);

  if (isLoading) return <div className="h-40 bg-zinc-800 animate-pulse rounded-lg" />;
  if (!data.length) return <div className="h-40 flex items-center justify-center text-zinc-600 text-sm">No spending data yet</div>;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name" paddingAngle={3} stroke="none">
          {data.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 12 }}
          formatter={(v: any) => [`${currency} ${Number(v).toLocaleString()}`, ""]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function CategoryLegend() {
  const { receipts } = useMonthlySpend();
  const { currency } = useSettings();
  const data = useMemo(() => {
    if (!receipts) return [];
    const map: Record<string, number> = {};
    receipts.forEach((r) => { const cat = r.category || "General"; map[cat] = (map[cat] || 0) + r.totalAmount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [receipts]);

  return (
    <div className="space-y-2 mt-2">
      {data.map(([cat, val], i) => (
        <div key={cat} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
            <span className="text-zinc-400">{cat}</span>
          </div>
          <span className="text-zinc-300 font-medium">{currency} {Math.round(val).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── 7-Day Trend ──────────────────────────────────────────────────────────
function SpendingTrend() {
  const { data: allReceipts, isLoading } = useReceipts();
  const { currency } = useSettings();

  const data = useMemo(() => {
    const days: { label: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-BD", { weekday: "short" });
      const total = allReceipts
        ?.filter((r) => new Date(r.createdAt).toDateString() === d.toDateString())
        .reduce((s, r) => s + r.totalAmount, 0) ?? 0;
      days.push({ label, total: Math.round(total) });
    }
    return days;
  }, [allReceipts]);

  if (isLoading) return <div className="h-32 bg-zinc-800 animate-pulse rounded-lg" />;

  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip
          contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 12 }}
          formatter={(v: any) => [`${currency} ${Number(v).toLocaleString()}`, "Spent"]}
        />
        <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Monthly Budget Progress ───────────────────────────────────────────────
function BudgetProgress() {
  const { total, isLoading } = useMonthlySpend();
  const { data: session } = authClient.useSession();
  const { currency } = useSettings();
  const user = session?.user as any;
  const budget = user?.monthlyBudget as number | undefined;

  if (!budget || isLoading) return null;

  const pct = Math.min(Math.round((total / budget) * 100), 100);
  const isWarning = pct >= 80;
  const isOver = pct >= 100;

  return (
    <div className={`bg-zinc-900 border rounded-xl p-5 ${isOver ? "border-red-500/40" : isWarning ? "border-amber-500/30" : "border-zinc-800"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isWarning ? (
            <AlertTriangle className={`w-4 h-4 ${isOver ? "text-red-400" : "text-amber-400"}`} />
          ) : (
            <Wallet className="w-4 h-4 text-zinc-400" />
          )}
          <h3 className="text-sm font-medium text-zinc-300">Monthly Budget</h3>
        </div>
        <span className={`text-xs font-semibold ${isOver ? "text-red-400" : isWarning ? "text-amber-400" : "text-zinc-400"}`}>
          {pct}% used
        </span>
      </div>
      <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isOver ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-500">
        <span>{currency} {Math.round(total).toLocaleString()} spent</span>
        <span>{currency} {Math.round(budget).toLocaleString()} budget</span>
      </div>
      {isWarning && !isOver && (
        <p className="text-xs text-amber-400 mt-2">⚠ You're close to your monthly limit.</p>
      )}
      {isOver && (
        <p className="text-xs text-red-400 mt-2">🚨 You've exceeded your monthly budget!</p>
      )}
    </div>
  );
}

// ─── Printable Report ────────────────────────────────────────────────────────
function PrintableReport() {
  const { data: allReceipts } = useReceipts();
  const { data: goals } = useGoals();
  const activeGoal = goals?.find((g) => g.status === "IN_PROGRESS") ?? goals?.[0];
  const { data: advice } = useAiAdvice(activeGoal?.id);
  const { currency } = useSettings();
  const { total } = useMonthlySpend();
  const { data: session } = authClient.useSession();
  const user = session?.user as any;

  return (
    <div className="hidden print:block w-full max-w-[800px] mx-auto bg-white text-black p-10 font-sans absolute top-0 left-0 z-[100] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end border-b-2 border-indigo-600 pb-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-indigo-900 tracking-tight">ReceiptIQ</h1>
          <p className="text-zinc-500 font-medium">Financial Intelligence Report</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-zinc-800">{user?.name || "User"}</p>
          <p className="text-sm text-zinc-500">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Monthly Spend</p>
          <p className="text-2xl font-black text-indigo-700">{currency} {total.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Monthly Budget</p>
          <p className="text-2xl font-black text-zinc-800">{currency} {(user?.monthlyBudget || 0).toLocaleString()}</p>
        </div>
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Active Goal</p>
          <p className="text-2xl font-black text-zinc-800 truncate">{activeGoal?.title || "N/A"}</p>
        </div>
      </div>

      {/* Gemini AI Analysis */}
      <div className="bg-indigo-50/50 rounded-2xl p-6 border-l-4 border-indigo-500 mb-8">
        <h2 className="text-xl font-bold text-indigo-900 mb-3 flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-indigo-600" /> Gemini AI Financial Analysis
        </h2>
        {advice?.costingSuggestions?.length ? (
          <ul className="space-y-3 mt-4">
            {advice.costingSuggestions.map((tip, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-700 leading-relaxed">
                <span className="text-indigo-500 font-bold">•</span>
                {tip}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500 italic mt-4">No AI analysis available. Generate advice in the Goal Coach to see it here.</p>
        )}
      </div>

      {/* Recent Receipts Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-zinc-800 mb-4 border-b border-zinc-200 pb-2">Recent Transactions</h2>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-zinc-200 text-zinc-500">
              <th className="py-2 font-bold uppercase tracking-wider text-xs">Date</th>
              <th className="py-2 font-bold uppercase tracking-wider text-xs">Merchant</th>
              <th className="py-2 font-bold uppercase tracking-wider text-xs">Category</th>
              <th className="py-2 font-bold uppercase tracking-wider text-xs text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {allReceipts?.slice(0, 15).map(r => (
              <tr key={r.id} className="border-b border-zinc-100">
                <td className="py-2 text-zinc-600">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="py-2 font-medium text-zinc-800">{r.merchantName || "Unknown"}</td>
                <td className="py-2 text-zinc-600">{r.category || "General"}</td>
                <td className="py-2 text-right font-bold text-zinc-800">{currency} {r.totalAmount.toLocaleString()}</td>
              </tr>
            ))}
            {!allReceipts?.length && (
              <tr><td colSpan={4} className="py-4 text-center text-zinc-500 italic">No recent transactions</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="pt-8 mt-auto border-t border-zinc-200 text-center text-xs text-zinc-400">
        <p>Generated by ReceiptIQ AI Engine (Powered by Google Gemini 2.5 Flash)</p>
      </div>
    </div>
  );
}

// ─── Monthly Spend Card ────────────────────────────────────────────────────
function MonthlySpendCard() {
  const { total, isLoading } = useMonthlySpend();
  const { currency } = useSettings();
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-medium text-zinc-400">Total This Month</h3>
      </div>
      {isLoading ? (
        <div className="h-9 w-32 bg-zinc-800 animate-pulse rounded mt-1" />
      ) : (
        <p className="text-3xl font-bold text-white">{currency} {total.toLocaleString()}</p>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { toPDF, targetRef } = usePDF({filename: `ReceiptIQ_Report_${new Date().toISOString().split('T')[0]}.pdf`});
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("receiptiq-tour");
    if (!hasSeenTour) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          { element: "#tour-overview", popover: { title: 'Welcome to ReceiptIQ', description: 'This is your AI-powered financial command center. Here you can see your total spending and budget progress.', side: 'bottom' } },
          { element: "#tour-coach", popover: { title: 'AI Goal Coach', description: 'Get proactive budget caps and advice from Gemini to reach your financial goals.', side: 'bottom' } },
          { element: "#tour-recent", popover: { title: 'Recent Activity', description: 'Your scanned receipts will appear here automatically.', side: 'left' } },
          { element: "#tour-chat", popover: { title: 'Agentic Command Center', description: 'Type or speak your expenses here, or upload receipt images directly.', side: 'top' } },
        ],
        onDestroyStarted: () => {
          localStorage.setItem("receiptiq-tour", "true");
          driverObj.destroy();
        }
      });
      // Small timeout to ensure elements are rendered
      setTimeout(() => driverObj.drive(), 500);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <PrintableReport />
      <div className="flex-1 p-8 pb-36 print:hidden" ref={targetRef}>
        <header id="tour-overview" className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Financial Overview</h1>
            <p className="text-zinc-400 mt-1">Your AI-powered insights and recent activity.</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors border border-indigo-500/50 print:hidden"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </header>

        <div className="space-y-6">
          {/* Row 1 — Goal Coach (full width) */}
          <div id="tour-coach">
            <GoalCoach />
          </div>

          {/* Row 2 — Spend + Budget + Trend */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MonthlySpendCard />
            <div className="md:col-span-2">
              <BudgetProgress />
            </div>
          </div>

          {/* Row 3 — Category Breakdown + 7-day trend + Recent */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category breakdown */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Spending by Category
              </h3>
              <CategoryBreakdown />
              <CategoryLegend />
            </div>

            {/* 7-day trend */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                Last 7 Days
              </h3>
              <SpendingTrend />
            </div>

            {/* Recent Receipts */}
            <div id="tour-recent" className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Recent Receipts
                </h3>
                <a href="/dashboard/receipts" className="text-xs text-indigo-400 hover:underline">
                  View all →
                </a>
              </div>
              <RecentReceipts />
            </div>
          </div>
        </div>
      </div>

      <AgenticChat />
    </div>
  );
}
