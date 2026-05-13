"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useGoals, useAiAdvice, useAiInsights } from "@/hooks/useGoals";
import {
  Sparkles, Target, RefreshCw, Lightbulb, TrendingUp,
  Wallet, ArrowRight, Brain, ChevronRight,
} from "lucide-react";
import { useLenis } from "lenis/react";
import { useEffect } from "react";

const COLORS = ["#4f46e5", "#27272a"];

// ─── No-Goals AI Insight Panel ───────────────────────────────────────────────
function AiInsightPanel() {
  const {
    data: insights,
    isLoading,
    isFetching,
    refetch,
  } = useAiInsights();

  if (isLoading || isFetching) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-indigo-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">AI Financial Advisor</h3>
            <p className="text-xs text-zinc-500">Generating your personalized insights…</p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-full" style={{ width: `${85 - i * 8}%` }} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center gap-4 min-h-[200px]">
        <Brain className="w-10 h-10 text-zinc-700" />
        <div className="text-center">
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Could not load AI insights</p>
          <p className="text-zinc-600 text-xs mt-1">Complete your profile to get personalized advice</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-500/30 rounded-lg px-3 py-1.5"
        >
          <RefreshCw className="w-3 h-3" /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">AI Financial Advisor</h3>
            <p className="text-xs text-zinc-500">Personalized insights based on your profile</p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          title="Refresh insights"
          className="text-zinc-600 hover:text-indigo-400 transition-colors p-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Spending insight banner */}
      {insights.spendingInsight && (
        <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg px-4 py-3 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
          <p className="text-sm text-indigo-200 leading-relaxed">{insights.spendingInsight}</p>
        </div>
      )}

      {/* Main grid: Budget + Occupation tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Suggested Budget Card */}
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800/80 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Suggested Monthly Budget</span>
          </div>
          {insights.suggestedBudget > 0 ? (
            <>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                ৳ {Math.round(insights.suggestedBudget).toLocaleString()}
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{insights.budgetReasoning}</p>
              {/* Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                {Object.entries(insights.budgetBreakdown).slice(0, 4).map(([cat, amt]) => (
                  <div key={cat} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">{cat}</span>
                    <span className="text-zinc-900 dark:text-zinc-300 font-medium">৳ {Math.round(amt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-zinc-500">Set your monthly income in profile to get a budget suggestion.</p>
          )}
        </div>

        {/* Occupation Tips */}
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800/80 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Smart Money Tips</span>
          </div>
          <ul className="space-y-3">
            {(insights.occupationTips || []).map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-900 dark:text-zinc-300 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Goals */}
      {insights.suggestedGoals?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">AI-Suggested Goals For You</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights.suggestedGoals.map((goal, i) => (
              <div
                key={i}
                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-indigo-500/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-indigo-400 font-medium bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                    {goal.timelineMonths}mo
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                </div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">{goal.title}</p>
                <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  ৳ {goal.targetAmount.toLocaleString()}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{goal.reason}</p>
              </div>
            ))}
          </div>

          <a
            href="/dashboard/goals"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/5 hover:border-indigo-500/50 transition-all text-sm font-medium group"
          >
            <Target className="w-4 h-4" />
            Create your first goal
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Goal Progress + AI Coach ─────────────────────────────────────────────────
function GoalAdvicePanel({ activeGoal }: { activeGoal: NonNullable<ReturnType<typeof useGoals>["data"]>[number] }) {
  const {
    data: advice,
    isLoading: adviceLoading,
    refetch: refetchAdvice,
    isFetching,
  } = useAiAdvice(activeGoal.id);

  const lenis = useLenis();
  useEffect(() => {
    if (lenis) setTimeout(() => lenis.resize(), 50);
  }, [advice, isFetching, lenis]);

  const savedAmount = activeGoal.savedAmount ?? 0;
  const targetAmount = activeGoal.targetAmount ?? 1;
  const remaining = Math.max(targetAmount - savedAmount, 0);
  const pieData = [
    { name: "Saved", value: savedAmount },
    { name: "Remaining", value: remaining },
  ];

  const dailyBudgetCap = advice?.dailyBudgetCap ?? activeGoal.dailyBudgetCap;
  const progressPct = Math.min(Math.round((savedAmount / targetAmount) * 100), 100);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left — Pie chart */}
      <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-5 border border-zinc-200 dark:border-zinc-800/50 flex flex-col items-center justify-center">
        <div className="flex items-center justify-between w-full mb-4">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            {activeGoal.title}
          </h3>
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-full">
            {progressPct}% saved
          </span>
        </div>
        <div className="w-full h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                labelStyle={{ color: "#a1a1aa" }}
                formatter={(value: any) => [`৳ ${Number(value).toLocaleString()}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-zinc-900 dark:text-white">৳ {savedAmount.toLocaleString()}</span>
            <span className="text-xs text-zinc-500">of ৳ {targetAmount.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600" />
            <span className="text-zinc-500 dark:text-zinc-400">Saved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-700" />
            <span className="text-zinc-500 dark:text-zinc-400">Remaining</span>
          </div>
        </div>
      </div>

      {/* Right — Budget cap + AI advice */}
      <div className="flex flex-col justify-between space-y-4">
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-5 border border-zinc-200 dark:border-zinc-800/50 flex flex-col justify-center">
          <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">DAILY BUDGET CAP</span>
          {adviceLoading || isFetching ? (
            <div className="h-10 w-36 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg mt-2" />
          ) : dailyBudgetCap != null ? (
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mt-2">
              ৳ {Math.round(dailyBudgetCap).toLocaleString()}
            </span>
          ) : (
            <span className="text-zinc-500 mt-2 text-sm">Calculating from your data…</span>
          )}
          <span className="text-xs text-zinc-500 mt-2">
            Based on your goal &amp; spending history
          </span>
        </div>

        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-lg p-5 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-indigo-400 font-medium text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Advisor Notes
            </h4>
            <button
              onClick={() => refetchAdvice()}
              disabled={isFetching}
              title="Refresh AI advice"
              className="text-zinc-500 hover:text-indigo-400 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
          </div>

          {adviceLoading || isFetching ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-3 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded w-full" />
              ))}
            </div>
          ) : advice?.costingSuggestions?.length ? (
            <ul className="space-y-2 text-sm text-zinc-900 dark:text-zinc-300">
              {advice.costingSuggestions.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 text-sm">
              Click <RefreshCw className="inline w-3 h-3" /> to get AI advice tailored to your goal.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GoalCoach() {
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const activeGoal = goals?.find((g) => g.status === "IN_PROGRESS") ?? goals?.[0];

  if (goalsLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex items-center justify-center h-56 text-zinc-500">
        Loading goal data…
      </div>
    );
  }

  // User has goals — show goal progress + AI coach
  if (activeGoal) {
    return <GoalAdvicePanel activeGoal={activeGoal} />;
  }

  // User has NO goals — show AI-generated insights, occupation tips & goal suggestions
  return (
    <div className="space-y-4">
      {/* Nudge header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-300">
            AI Insights &amp; Recommendations
          </span>
        </div>
        <a
          href="/dashboard/goals"
          className="flex items-center gap-1 text-xs text-indigo-400 hover:underline"
        >
          Set a goal <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      <AiInsightPanel />
    </div>
  );
}
