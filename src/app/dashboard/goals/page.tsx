"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Target, Plus, CheckCircle2, Clock, Sparkles,
  PiggyBank, X, Loader2, RefreshCw, TrendingUp,
} from "lucide-react";
import { useGoals, useAiAdvice, Goal } from "@/hooks/useGoals";
import { useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";

const API = process.env.NEXT_PUBLIC_API_URL;

// ─── Add Savings Modal ────────────────────────────────────────────────────
function AddSavingsModal({ goal, onClose }: { goal: Goal; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const remaining = goal.targetAmount - goal.savedAmount;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${API}/goals/add-savings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ goalId: goal.id, amount: Number(amount) }),
      });
      if (!res.ok) throw new Error("Failed");
      
      const addedAmount = Number(amount);
      if (addedAmount >= remaining) {
        // Goal reached! Trigger confetti explosion
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#34d399', '#6366f1', '#fbbf24']
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#34d399', '#6366f1', '#fbbf24']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
        toast.success(`🎉 Congratulations! You reached your goal: "${goal.title}"!`);
      } else {
        toast.success(`৳ ${addedAmount.toLocaleString()} added to "${goal.title}"!`);
      }
      
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      onClose();
    } catch {
      toast.error("Could not add savings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">Add Savings</h3>
            <p className="text-sm text-zinc-500">{goal.title}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-zinc-800/50 rounded-xl p-4 mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-400">Saved</span>
            <span className="text-white font-semibold">৳ {goal.savedAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-zinc-400">Remaining</span>
            <span className="text-indigo-400 font-semibold">৳ {remaining.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Amount to Add (৳)</label>
            <input
              type="number"
              min="1"
              max={remaining}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Max ৳ ${remaining.toLocaleString()}`}
              autoFocus
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-50 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
            />
            {/* Quick-fill buttons */}
            <div className="flex gap-2 mt-2">
              {[1000, 5000, 10000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(String(Math.min(v, remaining)))}
                  className="flex-1 text-xs py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700"
                >
                  +৳{v >= 1000 ? `${v / 1000}k` : v}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(String(remaining))}
                className="flex-1 text-xs py-1.5 rounded-lg bg-indigo-900/40 text-indigo-400 hover:bg-indigo-900/70 transition-colors border border-indigo-500/30"
              >
                Full
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSaving || !amount}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
          >
            {isSaving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Adding…</> : "Add to Goal"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── AI Advice Panel ──────────────────────────────────────────────────────
function GoalAiPanel({ goal, onClose }: { goal: Goal; onClose: () => void }) {
  const { data: advice, isLoading, isFetching, refetch } = useAiAdvice(goal.id);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              AI Coach
            </h3>
            <p className="text-sm text-zinc-500">{goal.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-zinc-500 hover:text-indigo-400 transition-colors disabled:opacity-50"
              title="Refresh advice"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoading || isFetching ? (
          <div className="space-y-3 py-4">
            <div className="h-12 bg-zinc-800 animate-pulse rounded-xl" />
            {[1, 2, 3].map((i) => <div key={i} className="h-4 bg-zinc-800 animate-pulse rounded w-full" />)}
          </div>
        ) : advice ? (
          <div className="space-y-4">
            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 flex items-center gap-4">
              <div>
                <p className="text-xs text-zinc-500 mb-0.5">Recommended Daily Cap</p>
                <p className="text-2xl font-bold text-white">৳ {Math.round(advice.dailyBudgetCap).toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-400/50 ml-auto shrink-0" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">AI Tips</p>
              <ul className="space-y-2">
                {advice.costingSuggestions.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-indigo-500 shrink-0 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-zinc-500 text-sm text-center py-6">
            Click <RefreshCw className="inline w-3 h-3" /> to generate your personalized AI advice.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Goal Card ────────────────────────────────────────────────────────────
function GoalCard({ goal, onAddSavings, onAiAdvice }: {
  goal: Goal;
  onAddSavings: (g: Goal) => void;
  onAiAdvice: (g: Goal) => void;
}) {
  const pct = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100);
  const daysLeft = Math.ceil(
    (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isComplete = goal.status === "COMPLETED" || pct >= 100;
  const isOverdue = daysLeft < 0 && !isComplete;

  return (
    <div className={`p-5 rounded-xl border transition-all ${
      isComplete
        ? "border-emerald-500/30 bg-emerald-950/10"
        : isOverdue
        ? "border-red-500/20 bg-red-950/5"
        : "border-zinc-700/80 bg-zinc-800/30"
    }`}>
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">{goal.title}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Target: ৳ {goal.targetAmount.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isComplete ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <span className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-400" : "text-zinc-500"}`}>
              <Clock className="w-3 h-3" />
              {isOverdue ? "Overdue" : `${daysLeft}d`}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isComplete ? "bg-emerald-500" : isOverdue ? "bg-red-500" : "bg-indigo-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-500 mb-3">
        <span>৳ {goal.savedAmount.toLocaleString()} saved</span>
        <span className={isComplete ? "text-emerald-400" : "text-indigo-400"}>{pct}%</span>
      </div>

      {goal.dailyBudgetCap && (
        <div className="text-xs text-indigo-300/60 mb-3 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI daily cap: ৳ {Math.round(goal.dailyBudgetCap).toLocaleString()}
        </div>
      )}

      {!isComplete && (
        <div className="flex gap-2">
          <button
            onClick={() => onAddSavings(goal)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/40 transition-colors"
          >
            <PiggyBank className="w-3.5 h-3.5" />
            Add Savings
          </button>
          <button
            onClick={() => onAiAdvice(goal)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Coach
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function GoalsPage() {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [savingsGoal, setSavingsGoal] = useState<Goal | null>(null);
  const [aiGoal, setAiGoal] = useState<Goal | null>(null);
  const { data: goals, isLoading, isError } = useGoals();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch(`${API}/goals/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          targetAmount: Number(targetAmount),
          targetDate: new Date(targetDate).toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Goal created!");
      setTitle(""); setTargetAmount(""); setTargetDate("");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    } catch {
      toast.error("Could not create goal. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const inProgress = goals?.filter((g) => g.status !== "COMPLETED") ?? [];
  const completed = goals?.filter((g) => g.status === "COMPLETED") ?? [];
  const totalSaved = goals?.reduce((s, g) => s + g.savedAmount, 0) ?? 0;
  const totalTarget = goals?.reduce((s, g) => s + g.targetAmount, 0) ?? 0;

  return (
    <div className="p-8 pb-32">
      {/* Modals */}
      {savingsGoal && <AddSavingsModal goal={savingsGoal} onClose={() => setSavingsGoal(null)} />}
      {aiGoal && <GoalAiPanel goal={aiGoal} onClose={() => setAiGoal(null)} />}

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Target className="w-8 h-8 text-indigo-500" />
          Financial Goals
        </h1>
        <p className="text-zinc-400 mt-1">Set targets and let the AI guide your spending.</p>
      </header>

      {/* Summary strip */}
      {goals && goals.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Goals", value: goals.length },
            { label: "Total Saved", value: `৳ ${totalSaved.toLocaleString()}` },
            { label: "Total Target", value: `৳ ${totalTarget.toLocaleString()}` },
          ].map((s) => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" /> Create New Goal
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="goal-title" className="block text-sm font-medium text-zinc-300 mb-1.5">Goal Title</label>
              <input
                id="goal-title" type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Buy a Bike, Emergency Fund, New Laptop"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-50 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label htmlFor="goal-amount" className="block text-sm font-medium text-zinc-300 mb-1.5">Target Amount (৳)</label>
              <input
                id="goal-amount" type="number" required min="1" value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-50 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label htmlFor="goal-date" className="block text-sm font-medium text-zinc-300 mb-1.5">Target Date</label>
              <input
                id="goal-date" type="date" required value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
              />
            </div>
            <Button type="submit" disabled={isCreating}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition-all">
              {isCreating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating…</> : "Create Goal"}
            </Button>
          </form>

          <div className="mt-5 p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/50">
            <p className="text-xs text-zinc-500 font-medium mb-2">💡 Or ask the AI chat:</p>
            <div className="space-y-1">
              {[
                '"Save 1.5 lakh for a motorcycle by December"',
                '"Emergency fund goal of 50k in 6 months"',
              ].map((ex) => (
                <p key={ex} className="text-xs italic text-indigo-400/80">{ex}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Goals list */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center justify-between">
            <span>Your Goals</span>
            {inProgress.length > 0 && (
              <span className="text-xs font-normal text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">
                {inProgress.length} active
              </span>
            )}
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-zinc-800 animate-pulse rounded-xl" />)}
            </div>
          ) : !goals || goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
              <Target className="w-12 h-12 text-zinc-700" />
              <p className="text-zinc-400 text-sm">No goals yet. Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {inProgress.map((g) => (
                <GoalCard key={g.id} goal={g} onAddSavings={setSavingsGoal} onAiAdvice={setAiGoal} />
              ))}
              {completed.length > 0 && (
                <>
                  <p className="text-xs text-zinc-600 uppercase tracking-wider pt-1 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Completed
                  </p>
                  {completed.map((g) => (
                    <GoalCard key={g.id} goal={g} onAddSavings={setSavingsGoal} onAiAdvice={setAiGoal} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
