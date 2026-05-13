import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto prose dark:prose-invert flex-1 py-24 px-4">
        <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Privacy Policy</h1>
        
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          At ReceiptIQ, your financial privacy is our absolute priority. This document outlines how we handle your data, particularly regarding our Agentic AI features.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-white">1. Data Collection & AI Processing</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          When you use the Multimodal Scanner (Image/Voice), your receipt images and voice recordings are processed in-memory via Google Gemini AI. <strong>We do not permanently store physical receipt images on our servers.</strong> Once the text data (Merchant, Amount, Category) is extracted, the image file is securely discarded.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-white">2. Authentication Security</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          We utilize HTTP-only, secure cookies via Better-Auth. This ensures that your session tokens cannot be accessed via malicious client-side scripts (XSS).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-white">3. Data Sharing</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          We never sell your financial data to third-party advertisers or brokers. Your data is strictly used to provide you with personalized wealth management coaching via our internal systems.
        </p>
      </div>
      <Footer />
    </div>
  );
}
