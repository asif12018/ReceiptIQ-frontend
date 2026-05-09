"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Activity, CreditCard, Sparkles, TrendingUp, Cpu } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const tokenUsageData = [
  { day: "Mon", tokens: 12000 },
  { day: "Tue", tokens: 19000 },
  { day: "Wed", tokens: 15000 },
  { day: "Thu", tokens: 22000 },
  { day: "Fri", tokens: 28000 },
  { day: "Sat", tokens: 14000 },
  { day: "Sun", tokens: 18000 },
];

export default function AdminDashboardPage() {
  // In a real app, this would fetch from an admin-only endpoint
  const mockMetrics = {
    totalUsers: 1284,
    activeUsers: 843,
    totalReceipts: 5230,
    mrr: 0, // Free app!
    totalTokens: 128000,
    apiCost: 1.28, // Assuming $10 per 1M tokens
  };

  return (
    <div className="p-8 pb-32">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Activity className="w-8 h-8 text-indigo-500" />
          Platform Metrics
        </h1>
        <p className="text-zinc-400 mt-1">Admin overview of ReceiptIQ usage and AI costs.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-medium text-zinc-400">Total Users</h3>
          </div>
          <p className="text-3xl font-bold text-white">{mockMetrics.totalUsers.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 mt-2">↑ 12% this month</p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-medium text-zinc-400">Monthly Revenue</h3>
          </div>
          <p className="text-3xl font-bold text-white">${mockMetrics.mrr.toLocaleString()}</p>
          <p className="text-xs text-zinc-500 mt-2">Free application model</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-medium text-zinc-400">Receipts Processed</h3>
          </div>
          <p className="text-3xl font-bold text-white">{mockMetrics.totalReceipts.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 mt-2">↑ 8% this week</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-medium text-zinc-400">Gemini Token Cost</h3>
          </div>
          <p className="text-3xl font-bold text-white">${mockMetrics.apiCost.toFixed(2)}</p>
          <p className="text-xs text-red-400 mt-2">{mockMetrics.totalTokens.toLocaleString()} tokens used</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Usage Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">
            AI Token Usage (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tokenUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                cursor={{ fill: "#27272a" }}
              />
              <Bar dataKey="tokens" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-zinc-200">Express Backend</span>
              </div>
              <span className="text-xs text-zinc-500">99.9% Uptime</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-zinc-200">Gemini Pro API</span>
              </div>
              <span className="text-xs text-zinc-500">Latency: 840ms</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-zinc-200">PostgreSQL Database</span>
              </div>
              <span className="text-xs text-zinc-500">Connections: 12/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
