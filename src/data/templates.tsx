import { Compass, ShieldCheck, Target, Clock } from "lucide-react";

export const TEMPLATES = [
  {
    id: "50-30-20-rule",
    title: "50/30/20 Budgeting Rule",
    difficulty: "Easy",
    category: "Budgeting",
    description: "The classic rule: 50% for needs, 30% for wants, and 20% for savings or paying off debt.",
    icon: <Compass className="w-8 h-8 text-emerald-500" />,
    color: "emerald"
  },
  {
    id: "6-month-emergency",
    title: "6-Month Emergency Fund",
    difficulty: "Hard",
    category: "Savings",
    description: "Build a financial safety net that covers exactly 6 months of your essential living expenses.",
    icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />,
    color: "indigo"
  },
  {
    id: "100-envelope-challenge",
    title: "100 Envelope Challenge",
    difficulty: "Medium",
    category: "Challenge",
    description: "A fun gamified way to save $5,050 over 100 days by filling numbered envelopes.",
    icon: <Target className="w-8 h-8 text-rose-500" />,
    color: "rose"
  },
  {
    id: "debt-snowball",
    title: "Debt Snowball Method",
    difficulty: "Medium",
    category: "Debt",
    description: "Pay off your smallest debts first to gain momentum while paying minimums on larger debts.",
    icon: <Clock className="w-8 h-8 text-amber-500" />,
    color: "amber"
  },
  {
    id: "no-spend-month",
    title: "No-Spend Month Challenge",
    difficulty: "Hard",
    category: "Challenge",
    description: "Commit to buying absolutely nothing except essential bills and groceries for 30 days.",
    icon: <Target className="w-8 h-8 text-emerald-500" />,
    color: "emerald"
  },
  {
    id: "travel-fund-europe",
    title: "Europe Travel Fund",
    difficulty: "Medium",
    category: "Goals",
    description: "A specialized savings tracker to fund a 2-week backpacking trip across Europe.",
    icon: <Compass className="w-8 h-8 text-indigo-500" />,
    color: "indigo"
  },
  {
    id: "car-downpayment",
    title: "20% Car Downpayment",
    difficulty: "Easy",
    category: "Goals",
    description: "Save a solid 20% downpayment for a new vehicle to avoid high monthly loan interest.",
    icon: <Target className="w-8 h-8 text-rose-500" />,
    color: "rose"
  },
  {
    id: "zero-based-budget",
    title: "Zero-Based Budget",
    difficulty: "Hard",
    category: "Budgeting",
    description: "Give every single dollar a job before the month begins so your income minus expenses equals exactly zero.",
    icon: <ShieldCheck className="w-8 h-8 text-amber-500" />,
    color: "amber"
  }
];
