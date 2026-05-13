"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { User, Briefcase, DollarSign, Camera, Loader2, Sparkles, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSettings } from "@/hooks/useSettings";

const CURRENCIES = [
  { value: "৳", label: "BDT (৳)" },
  { value: "$", label: "USD ($)" },
  { value: "€", label: "EUR (€)" },
  { value: "£", label: "GBP (£)" },
  { value: "₹", label: "INR (₹)" },
];

const OCCUPATIONS = [
  { value: "JOB_HOLDER", label: "Job Holder" },
  { value: "STUDENT", label: "Student" },
  { value: "SOFTWARE_ENGINEER", label: "Software Engineer" },
  { value: "FREELANCER", label: "Freelancer" },
  { value: "OTHER", label: "Other" },
];

interface BudgetSuggestion {
  suggestedBudget: number;
  reasoning: string;
  breakdown: Record<string, number>;
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as any;
  const { currency, setCurrency } = useSettings();

  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuggestingBudget, setIsSuggestingBudget] = useState(false);
  const [budgetSuggestion, setBudgetSuggestion] = useState<BudgetSuggestion | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Fetch full user data from /users/me — the session alone is missing monthlyBudget
  // and may be stale for occupation/income after updates.
  useEffect(() => {
    if (!session || initialized) return;
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const json = await res.json();
        const dbUser = json.data;
        // Only set if the local state is still empty (user hasn't typed yet)
        if (dbUser.name)          setName(dbUser.name);
        if (dbUser.occupation)    setOccupation(dbUser.occupation);
        if (dbUser.monthlyIncome) setMonthlyIncome(dbUser.monthlyIncome.toString());
        if (dbUser.monthlyBudget) setMonthlyBudget(dbUser.monthlyBudget.toString());
        setInitialized(true);
      } catch {
        // silently fail — form will still work via session fallback
      }
    };
    fetchUserData();
  }, [session, initialized]);

  // Effective values: local state (from DB fetch or user typing) → session fallback
  const effectiveName = name || user?.name || "";
  const effectiveOccupation = occupation || user?.occupation || "";
  const effectiveIncome = monthlyIncome || user?.monthlyIncome?.toString() || "";
  const effectiveBudget = monthlyBudget || user?.monthlyBudget?.toString() || "";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSuggestBudget = async () => {
    if (!effectiveIncome) {
      toast.error("Please enter your monthly income first.");
      return;
    }
    // If income not saved yet, save it first so the AI can use it
    if (!user?.monthlyIncome && effectiveIncome) {
      await handleSave(undefined, true); // silent save
    }
    setIsSuggestingBudget(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/suggest-budget`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setBudgetSuggestion(json.data);
    } catch {
      toast.error("Could not get AI suggestion. Try again.");
    } finally {
      setIsSuggestingBudget(false);
    }
  };

  const applyBudgetSuggestion = () => {
    if (!budgetSuggestion) return;
    setMonthlyBudget(budgetSuggestion.suggestedBudget.toString());
    setBudgetSuggestion(null);
    toast.success("Budget applied! Click Save Changes to confirm.");
  };

  const handleSave = async (e?: React.FormEvent, silent = false) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      if (effectiveName)       formData.append("name", effectiveName);
      if (effectiveOccupation) formData.append("occupation", effectiveOccupation);
      if (effectiveIncome)     formData.append("monthlyIncome", effectiveIncome);
      if (effectiveBudget)     formData.append("monthlyBudget", effectiveBudget);
      if (avatar)              formData.append("avatar", avatar);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-profile`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed");
      }
      if (!silent) toast.success("Profile updated successfully!");
    } catch (err: any) {
      if (!silent) toast.error(err.message || "Could not update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-900 dark:text-zinc-500" />
      </div>
    );
  }

  const avatarUrl = preview ?? user?.avatarUrl ?? user?.image;
  const initials = (user?.name ?? "U").charAt(0).toUpperCase();

  return (
    <div className="p-4 md:p-8 pb-32 max-w-6xl mx-auto w-full">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <User className="w-8 h-8 text-indigo-500" />
          </div>
          Account Settings
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">Manage your personal and financial identity on ReceiptIQ.</p>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Personal Info */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-6">
              <User className="w-4 h-4 text-indigo-500" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <label htmlFor="profile-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Full Name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={effectiveName}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 text-zinc-900 dark:text-zinc-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/20 px-4 py-3 text-zinc-500 dark:text-zinc-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Financial Profile */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-6">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Financial Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Occupation
                </label>
                <select
                  id="occupation"
                  value={effectiveOccupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 text-zinc-900 dark:text-zinc-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                >
                  <option value="">Select occupation…</option>
                  {OCCUPATIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Preferred Currency
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 text-zinc-900 dark:text-zinc-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="ai-persona" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> AI Coach Personality
                </label>
                <select
                  id="ai-persona"
                  value={typeof window !== "undefined" ? localStorage.getItem("ai-persona") || "Professional" : "Professional"}
                  onChange={(e) => {
                    localStorage.setItem("ai-persona", e.target.value);
                    toast.success(`AI Persona changed to ${e.target.value}!`);
                    setTimeout(() => window.location.reload(), 500);
                  }}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 text-zinc-900 dark:text-zinc-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                >
                  <option value="Professional">Professional (Polite & strict)</option>
                  <option value="Roast Mode">Roast Mode (Gordon Ramsay style)</option>
                  <option value="Hype Beast">Hype Beast (Extremely Enthusiastic)</option>
                </select>
              </div>

              <div>
                <label htmlFor="monthly-income" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Monthly Income ({currency})
                </label>
                <input
                  id="monthly-income"
                  type="number"
                  min="0"
                  value={effectiveIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 text-zinc-900 dark:text-zinc-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="monthly-budget" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Monthly Budget ({currency})
                  </label>
                  <button
                    type="button"
                    onClick={handleSuggestBudget}
                    disabled={isSuggestingBudget}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors disabled:opacity-60"
                  >
                    {isSuggestingBudget ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI Suggest
                  </button>
                </div>
                <input
                  id="monthly-budget"
                  type="number"
                  min="0"
                  value={effectiveBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  placeholder="e.g. 30000"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 text-zinc-900 dark:text-zinc-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* AI Budget Suggestion Card */}
            {budgetSuggestion && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">AI Insights</span>
                    </div>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                      {currency}{budgetSuggestion.suggestedBudget.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={applyBudgetSuggestion}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 shadow-lg shadow-indigo-500/20"
                  >
                    Apply Plan
                  </Button>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{budgetSuggestion.reasoning}</p>
                
                {budgetSuggestion.breakdown && Object.keys(budgetSuggestion.breakdown).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(budgetSuggestion.breakdown).map(([cat, amt]) => (
                      <div key={cat} className="bg-white dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{cat}</p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{currency}{Math.round(amt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          <div className="hidden lg:block pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3"
            >
              {isSaving ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating Profile…</> : "Save All Changes"}
            </Button>
          </div>
        </div>

        {/* Right Column: Avatar & Extras */}
        <div className="lg:col-span-4 space-y-8">
          {/* Avatar Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center shadow-sm">
            <div className="relative group mx-auto w-32 h-32 mb-6">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl" />
              ) : (
                <div className="w-full h-full rounded-full bg-indigo-600/10 border-4 border-indigo-500/20 flex items-center justify-center text-4xl font-bold text-indigo-500">
                  {initials}
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <Camera className="w-8 h-8 text-white" />
              </label>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{user?.name}</h3>
            <p className="text-sm text-zinc-500 mb-6">{user?.email}</p>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("avatar-upload")?.click()}
              className="w-full rounded-xl border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Change Photo
            </Button>
          </div>

          {/* Quick Stats / Info */}
          <div className="bg-zinc-900 dark:bg-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-500/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Account Tip
            </h3>
            <p className="text-sm text-zinc-300 dark:text-indigo-100 leading-relaxed">
              Keeping your income and budget up-to-date helps ReceiptIQ provide more accurate financial coaching and goal tracking.
            </p>
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-zinc-400 dark:text-indigo-200 uppercase tracking-widest">Status</span>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase">Active</span>
            </div>
          </div>

          <div className="lg:hidden">
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3"
            >
              {isSaving ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating Profile…</> : "Save All Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
