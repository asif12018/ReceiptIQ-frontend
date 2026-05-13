import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate a short API delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setIsLoading(false);
    setIsSubscribed(true);
    toast.success("Welcome to the inner circle! 🚀", {
      description: "You'll receive our next AI insight shortly.",
    });
  };

  return (
    <section className="py-24 relative overflow-hidden bg-white dark:bg-zinc-950">
      <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <Mail className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
        <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">
          Smarter Finances, Delivered.
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
          Join 8,000+ users who get weekly AI-driven financial insights, tips on cutting hidden subscriptions, and exclusive features right in their inbox.
        </p>
        
        <div className="max-w-lg mx-auto h-20">
          <AnimatePresence mode="wait">
            {!isSubscribed ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row gap-3" 
                onSubmit={handleSubmit}
              >
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  className="flex-1 px-5 py-4 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="h-14 rounded-full px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 disabled:opacity-70"
                >
                  {isLoading ? "Joining..." : "Subscribe Now"}
                </Button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xl py-4"
              >
                <CheckCircle2 className="w-6 h-6" />
                You&apos;re in! Check your inbox soon.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-xs text-zinc-500 mt-4">We respect your privacy. No spam, ever.</p>
      </div>
    </section>
  );
}
