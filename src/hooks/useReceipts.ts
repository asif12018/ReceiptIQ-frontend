import { useQuery } from "@tanstack/react-query";

export interface Receipt {
  id: string;
  merchantName: string | null;
  totalAmount: number;
  currency: string;
  category: string | null;
  createdAt: string;
  items: { id: string; name: string; price: number }[];
}

const fetchReceipts = async (): Promise<Receipt[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/receipts`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch receipts");
  const json = await res.json();
  return json.data;
};

export const useReceipts = () => {
  return useQuery<Receipt[]>({
    queryKey: ["receipts"],
    queryFn: fetchReceipts,
    staleTime: 30_000,
  });
};

/** Returns the total spend for the current calendar month */
export const useMonthlySpend = () => {
  const { data: receipts, ...rest } = useReceipts();

  const now = new Date();
  const total = receipts
    ?.filter((r) => {
      const d = new Date(r.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, r) => sum + r.totalAmount, 0) ?? 0;

  return { total, receipts, ...rest };
};
