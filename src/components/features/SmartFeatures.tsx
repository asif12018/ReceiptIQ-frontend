"use client";

import { useState } from "react";
import { Sparkles, BrainCircuit, FastForward, Repeat, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSettings } from "@/hooks/useSettings";
import { authClient } from "@/lib/auth-client";
import { useMonthlySpend } from "@/hooks/useReceipts";

export default function SmartFeatures() {
  const [activeTab, setActiveTab] = useState<"braindump" | "timetravel" | "subscriptions">("braindump");

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mt-6">
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
        <button
          onClick={() => setActiveTab("braindump")}
          className={`flex-1 py-3 text-sm font-medium transition-colors flex justify-center gap-2 items-center ${activeTab === "braindump" ? "text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-300"}`}
        >
          <BrainCircuit className="w-4 h-4" /> Multi-Modal Brain Dump
        </button>
        <button
          onClick={() => setActiveTab("timetravel")}
          className={`flex-1 py-3 text-sm font-medium transition-colors flex justify-center gap-2 items-center ${activeTab === "timetravel" ? "text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-300"}`}
        >
          <FastForward className="w-4 h-4" /> Time-Travel Forecast
        </button>
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`flex-1 py-3 text-sm font-medium transition-colors flex justify-center gap-2 items-center ${activeTab === "subscriptions" ? "text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-300"}`}
        >
          <Repeat className="w-4 h-4" /> Subscription Sniper
        </button>
      </div>

      <div className="p-6">
        {activeTab === "braindump" && <BrainDumpTab />}
        {activeTab === "timetravel" && <TimeTravelTab />}
        {activeTab === "subscriptions" && <SubscriptionsTab />}
      </div>
    </div>
  );
}

function BrainDumpTab() {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const { currency } = useSettings();

  const { mutate, isPending } = useMutation({
    mutationFn: async (dumpText: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/receipts/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: dumpText })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to process brain dump");
      return json.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success(`Successfully extracted and logged ${data.length} expenses!`);
      setText("");
    },
    onError: () => {
      toast.error("Failed to extract expenses. Please try again.");
    }
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-1">
          <BrainCircuit className="w-4 h-4 text-indigo-400" /> AI Brain Dump Entry
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Just type whatever you spent money on naturally. The AI will extract all expenses, categorize them, and log them simultaneously.</p>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. I bought a coffee for 500, paid rent 15000, and ordered UberEats for 1200."
        className="w-full h-24 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4 text-sm text-zinc-900 dark:text-zinc-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 custom-scrollbar"
        disabled={isPending}
      />
      <div className="flex justify-end">
        <button
          onClick={() => mutate(text)}
          disabled={!text.trim() || isPending}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-zinc-900 dark:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isPending ? "Parsing..." : "Magic Extract & Log"}
        </button>
      </div>
    </div>
  );
}

function TimeTravelTab() {
  const [months, setMonths] = useState(3);
  const { data: session } = authClient.useSession();
  const user = session?.user as any;
  const { total } = useMonthlySpend();
  const { currency } = useSettings();

  const monthlyIncome = user?.monthlyIncome || 0;
  const currentSpend = total;
  const savingsPerMonth = monthlyIncome - currentSpend;
  const futureSavings = savingsPerMonth * months;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-1">
          <FastForward className="w-4 h-4 text-indigo-400" /> Financial Time-Travel
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Predict your future savings based on your current monthly trajectory.</p>
      </div>

      {!monthlyIncome ? (
        <div className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
          Please set your Monthly Income in your profile to use the time-travel forecasting.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-4">Travel into the future:</label>
            <input 
              type="range" 
              min="1" max="24" 
              value={months} 
              onChange={(e) => setMonths(Number(e.target.value))} 
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-2">
              <span>1 month</span>
              <span className="text-indigo-400 font-bold">{months} months</span>
              <span>2 years</span>
            </div>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl text-center">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Projected Bank Balance</p>
            <p className={`text-4xl font-black ${futureSavings >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {futureSavings >= 0 ? "+" : "-"}{currency} {Math.abs(futureSavings).toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              Based on {currency}{savingsPerMonth.toLocaleString()} average monthly savings
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SubscriptionsTab() {
  const { currency } = useSettings();
  
  const { data: subs, isLoading, refetch } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/receipts/subscriptions`, {
        credentials: "include"
      });
      const json = await res.json();
      return json.data || [];
    },
    staleTime: 5 * 60_000,
    enabled: false // requires explicit button click to avoid heavy AI calls
  });

  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setAnalyzed(true);
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-1">
            <Repeat className="w-4 h-4 text-indigo-400" /> Subscription Sniper
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Our Agent scans your past receipts to find recurring subscriptions and instantly drafts cancellation emails for you.</p>
        </div>
        {!analyzed && (
          <button onClick={handleAnalyze} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-zinc-900 dark:text-white rounded-lg text-sm font-medium transition-colors shrink-0 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Scan Receipts
          </button>
        )}
      </div>

      {analyzed && isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-zinc-500 dark:text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm">Agent is analyzing your expense history...</p>
        </div>
      )}

      {analyzed && !isLoading && subs?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg gap-2 text-zinc-500">
          <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
          <p className="text-sm">No recurring subscriptions detected.</p>
        </div>
      )}

      {analyzed && !isLoading && subs?.length > 0 && (
        <div className="space-y-3 mt-4">
          {subs.map((sub: any, i: number) => (
            <div key={i} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">{sub.merchant}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Estimated Cost: {currency} {sub.estimatedMonthlyCost.toLocaleString()} / mo</p>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(sub.draftCancellationEmail);
                  toast.success("Cancellation email copied to clipboard!");
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-200 rounded text-sm transition-colors"
              >
                <Mail className="w-4 h-4" /> Copy Cancellation Email
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
