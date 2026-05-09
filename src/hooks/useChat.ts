import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ChatResponse {
  success: boolean;
  data: { reply: string };
}

export const useChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string): Promise<ChatResponse> => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    onSuccess: () => {
      // Refresh goals and receipts after any chat action (the AI may have created/updated data)
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
    },
  });
};
