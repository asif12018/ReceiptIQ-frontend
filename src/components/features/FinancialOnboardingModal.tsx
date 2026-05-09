"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function FinancialOnboardingModal({ user }: { user: any }) {
  const [occupation, setOccupation] = useState("STUDENT");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const res = await fetch("/api/v1/users/update-profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          occupation,
          monthlyIncome: Number(monthlyIncome),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(errData?.message || `Server error: ${res.status}`);
      }

      // Mark profile as complete in a cookie so the layout can detect it
      // without relying on better-auth's session (which doesn't include
      // occupation/monthlyIncome until the backend additionalFields is deployed).
      document.cookie = "profile_complete=1; path=/; max-age=86400; SameSite=Lax";

      // Hard redirect — full page reload so the layout re-runs and reads the new cookie
      window.location.href = "/dashboard";
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err?.name === "AbortError") {
        setError("Request timed out. The server may be starting up — please try again in a moment.");
      } else {
        console.error("Profile update failed:", err);
        setError(err?.message || "Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to ReceiptIQ</h2>
          <p className="text-zinc-400 text-sm">Let&apos;s personalize your financial coaching.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Occupation
            </label>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-zinc-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="STUDENT">Student</option>
              <option value="SOFTWARE_ENGINEER">Software Engineer</option>
              <option value="FREELANCER">Freelancer</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Monthly Income (৳)
            </label>
            <input
              type="number"
              required
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-zinc-50 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 mt-2 transition-all"
          >
            {loading ? "Saving…" : "Complete Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
