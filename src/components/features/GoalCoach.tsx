"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useGoals, useAiAdvice } from "@/hooks/useGoals";
import { Sparkles, Target, RefreshCw } from "lucide-react";

const COLORS = ["#4f46e5", "#27272a"];

export default function GoalCoach() {
  const { data: goals, isLoading: goalsLoading } = useGoals();

  // Use the most recent (first by targetDate) IN_PROGRESS goal
  const activeGoal = goals?.find((g) => g.status === "IN_PROGRESS") ?? goals?.[0];

  const {
    data: advice,
    isLoading: adviceLoading,
    refetch: refetchAdvice,
    isFetching,
  } = useAiAdvice(activeGoal?.id);

  // Pie chart data derived from actual goal values
  const savedAmount = activeGoal?.savedAmount ?? 0;
  const targetAmount = activeGoal?.targetAmount ?? 1;
  const remaining = Math.max(targetAmount - savedAmount, 0);
  const pieData = [
    { name: "Saved", value: savedAmount },
    { name: "Remaining", value: remaining },
  ];

  // Daily budget cap: prefer live AI advice, fall back to stored value on goal
  const dailyBudgetCap = advice?.dailyBudgetCap ?? activeGoal?.dailyBudgetCap;

  const progressPct = Math.min(
    Math.round((savedAmount / targetAmount) * 100),
    100
  );

  if (goalsLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center justify-center h-56 text-zinc-500">
        Loading goal data…
      </div>
    );
  }

  if (!activeGoal) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 h-56 text-zinc-500">
        <Target className="w-10 h-10 text-zinc-700" />
        <p>No active goals yet.</p>
        <a href="/dashboard/goals" className="text-indigo-400 text-sm hover:underline">
          + Create your first goal
        </a>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left — Pie chart */}
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-between w-full mb-4">
          <h3 className="text-lg font-medium text-white">
            {activeGoal.title}
          </h3>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">
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
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                labelStyle={{ color: "#a1a1aa" }}
                formatter={(value: number) => [`৳ ${value.toLocaleString()}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-white">৳ {savedAmount.toLocaleString()}</span>
            <span className="text-xs text-zinc-500">of ৳ {targetAmount.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600" />
            <span className="text-zinc-400">Saved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700" />
            <span className="text-zinc-400">Remaining</span>
          </div>
        </div>
      </div>

      {/* Right — Budget cap + AI advice */}
      <div className="flex flex-col justify-between space-y-4">
        <div className="bg-zinc-950 rounded-lg p-5 border border-zinc-800/50 flex flex-col justify-center">
          <span className="text-sm text-zinc-400 font-medium tracking-wide">DAILY BUDGET CAP</span>
          {dailyBudgetCap != null ? (
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mt-2">
              ৳ {Math.round(dailyBudgetCap).toLocaleString()}
            </span>
          ) : (
            <span className="text-zinc-500 mt-2 text-sm">Run AI advice to calculate →</span>
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
                <div key={i} className="h-3 bg-zinc-800 animate-pulse rounded w-full" />
              ))}
            </div>
          ) : advice?.costingSuggestions?.length ? (
            <ul className="space-y-2 text-sm text-zinc-300">
              {advice.costingSuggestions.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 text-sm">
              Click <RefreshCw className="inline w-3 h-3" /> to get personalized AI advice based on your goals and receipts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
