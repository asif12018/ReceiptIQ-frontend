"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data: config } = useQuery({
    queryKey: ["system-config"],
    queryFn: async () => {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${API}/users/system-config`);
      const json = await res.json();
      return json.data;
    },
    staleTime: 60 * 1000,
  });

  const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" }
  });

  // Pre-warm the Render backend
  useEffect(() => {
    const warmUp = async () => {
      try {
        await fetch("https://receipt-iq-backend.vercel.app/api/v1/health", {
          mode: "no-cors",
          signal: AbortSignal.timeout(60000),
        });
      } catch {
        toast.info("Server is starting up… please wait ~30 seconds then try again.", {
          duration: 35000,
          id: "server-wake",
        });
      }
    };
    warmUp();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (isLoading) return;
    setIsLoading(true);
    
    // In Sign Up mode, require name
    if (isSignUp && (!data.name || data.name.trim().length === 0)) {
      toast.error("Full name is required for sign up");
      setIsLoading(false);
      return;
    }

    if (isSignUp && config?.newRegistrations === false) {
      toast.error("New registrations are currently disabled by the administrator.");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({
          email: data.email.trim(),
          password: data.password,
          name: data.name!.trim(),
        });

        if (result.error) {
          toast.error(result.error.message || "Sign up failed.");
        } else {
          toast.dismiss("server-wake");
          toast.success("Account created! Check your email for verification.");
          router.push(`/verify-email?email=${encodeURIComponent(data.email.trim())}`);
        }
      } else {
        const result = await authClient.signIn.email({
          email: data.email.trim(),
          password: data.password,
        });

        if (result.error) {
          const msg = result.error.message?.toLowerCase() || "";
          if (msg.includes("verify") || msg.includes("email")) {
            toast.info("Please verify your email first.");
            router.push(`/verify-email?email=${encodeURIComponent(data.email.trim())}`);
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
      toast.error(err?.message || "Request failed — server may be waking up.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoUser = () => {
    setValue("email", "hasig49380@anawebs.com");
    setValue("password", "123456789");
    setIsSignUp(false);
    clearErrors();
  };

  const handleDemoAdmin = () => {
    setValue("email", "admin@admin.com");
    setValue("password", "123456789");
    setIsSignUp(false);
    clearErrors();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950 px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-600/30">
            R
          </div>
          <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">ReceiptIQ</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {isSignUp ? "Start tracking your expenses with AI" : "Sign in to your ReceiptIQ account"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 transition-all text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email address</label>
              <input
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all text-sm ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500'}`}
              />
              {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-1 transition-all text-sm ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm"
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Please wait…</> : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200 dark:border-zinc-800" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-zinc-900 px-3 text-zinc-500">Or continue with</span></div>
          </div>

          <button
            type="button"
            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/dashboard`, errorCallbackURL: `${window.location.origin}/login` })}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 py-3 px-4 rounded-xl transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <button type="button" onClick={handleDemoUser} className="text-xs py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-900/10 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-700 transition-all font-medium">Demo User</button>
            <button type="button" onClick={handleDemoAdmin} className="text-xs py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-900/10 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-zinc-200 dark:border-zinc-700 transition-all font-medium">Demo Admin</button>
          </div>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-500 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            {config?.newRegistrations !== false ? (
              <button type="button" onClick={() => { setIsSignUp(!isSignUp); clearErrors(); }} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            ) : (
              <span className="text-zinc-600 cursor-not-allowed" title="Registrations are currently disabled">
                Sign Up Disabled
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
