"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { ShieldCheck, MailCheck, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email param
  useEffect(() => {
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    // auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // auto-submit when last digit entered
    if (value && index === 5) {
      handleVerify(next.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const next = pasted.split("");
      setOtp(next);
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code: string) => {
    if (code.length < 6 || isLoading) return;
    setIsLoading(true);
    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });
      if (error) {
        toast.error(error.message || "Invalid verification code. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        toast.success("🎉 Email verified! Welcome to ReceiptIQ.");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
      toast.success("A new code has been sent to your email.");
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      toast.error("Failed to resend code.");
    }
  };

  const fullCode = otp.join("");

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <MailCheck className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Verify your email</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We sent a 6-digit code to <br />
              <span className="text-white font-medium">{email}</span>
            </p>
          </div>

          {/* OTP input boxes */}
          <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-zinc-800 text-white outline-none transition-all duration-200 
                  ${digit ? "border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.3)]" : "border-zinc-700"}
                  focus:border-indigo-400 focus:shadow-[0_0_16px_rgba(99,102,241,0.4)]`}
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            onClick={() => handleVerify(fullCode)}
            disabled={fullCode.length < 6 || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 mb-4"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
            ) : (
              <><ShieldCheck className="w-4 h-4" /> Verify Email</>
            )}
          </button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-zinc-500 text-sm">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={resendTimer > 0}
                className="text-indigo-400 hover:text-indigo-300 disabled:text-zinc-600 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
              </button>
            </p>
          </div>
        </div>

        {/* Back to login */}
        <div className="text-center mt-6">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
