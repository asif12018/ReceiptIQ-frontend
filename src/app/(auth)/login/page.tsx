"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isVerifying) {
        // Step 3: Verify OTP
        const { data, error } = await authClient.emailOtp.verifyEmail({
          email,
          otp,
        });
        if (error) {
          toast.error(error.message || "Failed to verify OTP");
        } else {
          toast.success("Login successful!");
          router.push("/dashboard");
          router.refresh();
        }
      } else if (isSignUp) {
        // Step 1: Sign Up
        const { data, error } = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (error) {
          toast.error(error.message || "Failed to sign up");
        } else {
          toast.success("Account created! Please check your email for the OTP.");
          setIsVerifying(true);
        }
      } else {
        // Step 2: Sign In
        const { data, error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) {
          if (error.message?.toLowerCase().includes("verify")) {
            toast.info("Please check your email for the verification code.");
            setIsVerifying(true);
          } else {
            toast.error(error.message || "Failed to login");
          }
        } else {
          toast.success("Welcome back!");
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            {isVerifying ? "Verify your Email" : isSignUp ? "Create an Account" : "Sign in to ReceiptIQ"}
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            {isVerifying ? "Enter the 6-digit code sent to your email" : "Intelligent receipt scanning and AI insights"}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
          <div className="space-y-4 rounded-md shadow-sm">
            {isVerifying ? (
              <div>
                <label htmlFor="otp" className="sr-only">OTP Code</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="relative block w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-3 text-zinc-50 placeholder-zinc-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-all text-center tracking-[0.5em] font-mono text-xl"
                  placeholder="------"
                  maxLength={6}
                />
              </div>
            ) : (
              <>
                {isSignUp && (
                  <div>
                    <label htmlFor="name" className="sr-only">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="relative block w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-3 text-zinc-50 placeholder-zinc-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-all"
                      placeholder="Full Name"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative block w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-3 text-zinc-50 placeholder-zinc-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="relative block w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-3 text-zinc-50 placeholder-zinc-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="Password"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all"
            >
              {isVerifying ? "Verify Code" : isSignUp ? "Sign Up" : "Sign in"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => authClient.signIn.social({ 
                provider: "google",
                callbackURL: `${window.location.origin}/dashboard`,
                errorCallbackURL: `${window.location.origin}/login`
              })}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-all"
            >
              Sign in with Google
            </Button>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button
                type="button"
                onClick={() => { setEmail("demo@user.com"); setPassword("password123"); setIsSignUp(false); }}
                className="w-full bg-zinc-800 hover:bg-emerald-900/40 text-emerald-400 border border-zinc-700 transition-all text-xs"
              >
                Demo User
              </Button>
              <Button
                type="button"
                onClick={() => { setEmail("admin@user.com"); setPassword("password123"); setIsSignUp(false); }}
                className="w-full bg-zinc-800 hover:bg-purple-900/40 text-purple-400 border border-zinc-700 transition-all text-xs"
              >
                Demo Admin
              </Button>
            </div>
            
            {!isVerifying && (
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors mt-2"
              >
                {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
