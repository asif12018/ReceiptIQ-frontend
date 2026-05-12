"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Pre-warm the Render backend on page load.
  // We ping Render DIRECTLY (not through Vercel proxy) because
  // Vercel has a 10s timeout but Render cold-start takes 30-60s.
  useEffect(() => {
    const warmUp = async () => {
      try {
        const res = await fetch("https://receiptiq-backend.onrender.com/api/v1/health", {
          mode: "no-cors", // avoid CORS errors on the ping
          signal: AbortSignal.timeout(60000),
        });
      } catch {
        // Likely cold-starting — show user a friendly warning
        toast.info("Server is starting up… please wait ~30 seconds then try again.", {
          duration: 35000,
          id: "server-wake",
        });
      }
    };
    warmUp();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    console.log("[Auth] Submitting:", isSignUp ? "SIGN UP" : "SIGN IN", { email, name });

    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim(),
        });
        console.log("[Auth] signUp result:", result);

        if (result.error) {
          toast.error(result.error.message || "Sign up failed. Please try again.");
        } else {
          toast.dismiss("server-wake");
          toast.success("Account created! Check your email for the verification code.");
          router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
        }
      } else {
        const result = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        console.log("[Auth] signIn result:", result);

        if (result.error) {
          const msg = result.error.message?.toLowerCase() || "";
          if (msg.includes("verify") || msg.includes("email")) {
            toast.info("Please verify your email first.");
            router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
          } else {
            toast.error(result.error.message || "Invalid email or password.");
          }
        } else {
          toast.dismiss("server-wake");
          toast.success("Welcome back! 🎉");
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err: any) {
      console.error("[Auth] Unexpected error:", err);
      toast.error(err?.message || "Request failed — the server may still be waking up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-600/30">
            R
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ReceiptIQ</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              {isSignUp
                ? "Start tracking your expenses with AI"
                : "Sign in to your ReceiptIQ account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (sign up only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Please wait…</>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-zinc-900 px-3 text-zinc-500">Or continue with</span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: `${window.location.origin}/dashboard`,
                errorCallbackURL: `${window.location.origin}/login`,
              })
            }
            className="w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 py-3 px-4 rounded-xl transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          {/* Demo accounts */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button
              type="button"
              onClick={() => { setEmail("hasig49380@anawebs.com"); setPassword("123456789"); setIsSignUp(false); }}
              className="text-xs py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-emerald-900/30 text-emerald-400 border border-zinc-700 transition-all font-medium"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => { setEmail("admin@admin.com"); setPassword("123456789"); setIsSignUp(false); }}
              className="text-xs py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-purple-900/30 text-purple-400 border border-zinc-700 transition-all font-medium"
            >
              Demo Admin
            </button>
          </div>

          {/* Toggle */}
          <p className="text-center text-sm text-zinc-500 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp((v) => !v)}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
