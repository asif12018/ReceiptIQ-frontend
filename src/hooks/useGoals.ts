import { useQuery } from "@tanstack/react-query";

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  dailyBudgetCap: number | null;
  status: string;
}

export interface AiAdvice {
  dailyBudgetCap: number;
  costingSuggestions: string[];
}

export interface BudgetSuggestion {
  suggestedBudget: number;
  reasoning: string;
  breakdown: Record<string, number>;
}

export interface AiInsights {
  occupationTips: string[];
  suggestedBudget: number;
  budgetReasoning: string;
  budgetBreakdown: Record<string, number>;
  suggestedGoals: {
    title: string;
    targetAmount: number;
    timelineMonths: number;
    reason: string;
  }[];
  spendingInsight: string;
}

const API = process.env.NEXT_PUBLIC_API_URL;

const fetchGoals = async (): Promise<Goal[]> => {
  const res = await fetch(`${API}/goals`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch goals");
  const json = await res.json();
  return json.data;
};

const fetchAiAdvice = async (goalId: string): Promise<AiAdvice> => {
  const res = await fetch(`${API}/goals/${goalId}/ai-advice`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch AI advice");
  const json = await res.json();
  return json.data;
};

export const useGoals = () => {
  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: fetchGoals,
    staleTime: 30_000,
  });
};

export const useAiAdvice = (goalId: string | undefined) => {
  return useQuery<AiAdvice>({
    queryKey: ["ai-advice", goalId],
    queryFn: () => fetchAiAdvice(goalId!),
    enabled: !!goalId,
    staleTime: 5 * 60_000, // cache for 5 min — AI calls are slow
  });
};

export const useBudgetSuggestion = () => {
  return useQuery<BudgetSuggestion>({
    queryKey: ["budget-suggestion"],
    queryFn: async () => {
      const res = await fetch(`${API}/users/suggest-budget`, {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to fetch suggestion");
      return json.data;
    },
    staleTime: 5 * 60_000,
    retry: false,
  });
};

export const useAiInsights = () => {
  return useQuery<AiInsights>({
    queryKey: ["ai-insights"],
    queryFn: async () => {
      const persona = typeof window !== "undefined" ? localStorage.getItem("ai-persona") || "Professional" : "Professional";
      const res = await fetch(`${API}/users/ai-insights?persona=${encodeURIComponent(persona)}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to fetch AI insights");
      return json.data;
    },
    staleTime: 10 * 60_000, // cache 10 min
    retry: false,
  });
};
