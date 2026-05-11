"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { User, Briefcase, DollarSign, Camera, Loader2, Sparkles, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  const avatarUrl = preview ?? user?.avatarUrl ?? user?.image;
  const initials = (user?.name ?? "U").charAt(0).toUpperCase();

  return (
    <div className="p-8 pb-32 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <User className="w-8 h-8 text-indigo-500" />
          Profile
        </h1>
        <p className="text-zinc-400 mt-1">Manage your personal and financial details.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Avatar</h2>
          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-indigo-600/30 border-2 border-indigo-500/40 flex items-center justify-center text-2xl font-bold text-indigo-400">
                  {initials}
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </label>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-zinc-500 text-sm">{user?.email}</p>
              <label htmlFor="avatar-upload" className="text-xs text-indigo-400 hover:underline cursor-pointer mt-1 block">
                Change photo
              </label>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> Personal Info
          </h2>
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
            <input
              id="profile-name"
              type="text"
              value={effectiveName}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-50 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full rounded-lg border border-zinc-700/50 bg-zinc-800/20 px-4 py-3 text-zinc-500 outline-none text-sm cursor-not-allowed"
            />
          </div>
        </div>

        {/* Financial Profile */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5" /> Financial Profile
          </h2>

          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> Occupation
            </label>
            <select
              id="occupation"
              value={effectiveOccupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
            >
              <option value="">Select occupation…</option>
              {OCCUPATIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Currency Setting
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="monthly-income" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Monthly Income ({currency})
            </label>
            <input
              id="monthly-income"
              type="number"
              min="0"
              value={effectiveIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-50 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>

          {/* Monthly Budget with AI Suggest */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="monthly-budget" className="text-sm font-medium text-zinc-300">
                Monthly Budget ({currency})
              </label>
              <button
                type="button"
                onClick={handleSuggestBudget}
                disabled={isSuggestingBudget}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-60"
              >
                {isSuggestingBudget ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                {isSuggestingBudget ? "Analyzing…" : "AI Suggest"}
              </button>
            </div>
            <input
              id="monthly-budget"
              type="number"
              min="0"
              value={effectiveBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              placeholder="e.g. 30000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-50 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
            <p className="text-xs text-zinc-600 mt-1.5">
              Budget can be more or less than income depending on your goals.
            </p>

            {/* AI Budget Suggestion Card */}
            {budgetSuggestion && (
              <div className="mt-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-semibold text-indigo-300">AI Budget Suggestion</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      ৳ {budgetSuggestion.suggestedBudget.toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={applyBudgetSuggestion}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-2 rounded-lg transition-colors shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Apply
                  </button>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{budgetSuggestion.reasoning}</p>
                {budgetSuggestion.breakdown && Object.keys(budgetSuggestion.breakdown).length > 0 && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">Suggested Breakdown</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(budgetSuggestion.breakdown).map(([cat, amt]) => (
                        <div key={cat} className="flex justify-between text-xs bg-zinc-900/60 rounded px-2 py-1.5">
                          <span className="text-zinc-400">{cat}</span>
                          <span className="text-zinc-200 font-medium">৳ {Math.round(amt).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
