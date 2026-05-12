"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AdoptPlanButton({ title, id }: { title: string; id: string }) {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleAdopt = async () => {
    setIsCreating(true);
    
    // Generate sensible defaults based on the plan ID
    let targetAmount = 50000;
    let days = 30;

    if (id === "6-month-emergency") { targetAmount = 300000; days = 180; }
    else if (id === "100-envelope-challenge") { targetAmount = 5050; days = 100; }
    else if (id === "debt-snowball") { targetAmount = 100000; days = 90; }
    else if (id === "travel-fund-europe") { targetAmount = 250000; days = 365; }
    else if (id === "car-downpayment") { targetAmount = 500000; days = 365; }

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          targetAmount,
          targetDate: targetDate.toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create goal");

      toast.success(`Plan "${title}" adopted successfully!`);
      router.push("/dashboard/goals");
    } catch (error) {
      toast.error("Could not adopt plan. Please log in to start tracking goals.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button 
      onClick={handleAdopt}
      disabled={isCreating}
      className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-8 py-6 text-lg font-medium"
    >
      {isCreating ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Adopting...</> : "Adopt Plan"}
    </Button>
  );
}
