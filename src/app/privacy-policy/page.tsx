export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 py-24 px-4 flex flex-col">
      <div className="max-w-3xl mx-auto prose prose-invert flex-1">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <p className="text-zinc-400 mb-6 leading-relaxed">
          At ReceiptIQ, your financial privacy is our absolute priority. This document outlines how we handle your data, particularly regarding our Agentic AI features.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Data Collection & AI Processing</h2>
        <p className="text-zinc-400 mb-6 leading-relaxed">
          When you use the Multimodal Scanner (Image/Voice), your receipt images and voice recordings are processed in-memory via Google Gemini AI. <strong>We do not permanently store physical receipt images on our servers.</strong> Once the text data (Merchant, Amount, Category) is extracted, the image file is securely discarded.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Authentication Security</h2>
        <p className="text-zinc-400 mb-6 leading-relaxed">
          We utilize HTTP-only, secure cookies via Better-Auth. This ensures that your session tokens cannot be accessed via malicious client-side scripts (XSS).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Sharing</h2>
        <p className="text-zinc-400 mb-6 leading-relaxed">
          We never sell your financial data to third-party advertisers or brokers. Your data is strictly used to provide you with personalized wealth management coaching via our internal systems.
        </p>
      </div>
    </div>
  );
}
