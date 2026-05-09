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
