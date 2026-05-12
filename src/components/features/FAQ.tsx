"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const faqs = [
  { question: "Is ReceiptIQ really powered by AI?", answer: "Yes! We use advanced Google Gemini models to instantly parse your receipts, categorize expenses, and provide proactive financial coaching tailored specifically to your goals." },
  { question: "How does the AI Personality Coach work?", answer: "You can choose between different personas (like Professional, Roast Mode, or Hype Beast). The AI analyzes your spending habits and responds dynamically based on its assigned personality." },
  { question: "Is my financial data secure?", answer: "Absolutely. Your data is encrypted and securely stored. We use bank-grade security protocols, and your sensitive information is never shared with third parties." },
  { question: "Can I use ReceiptIQ for my small business?", answer: "Yes! Our platform is perfect for freelancers and small businesses. The 'Brain Dump' feature allows you to quickly log multiple expenses at once, saving hours of manual data entry." },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6">
            <MessageCircleQuestion className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Everything you need to know about ReceiptIQ.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden transition-all duration-200">
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-semibold text-zinc-900 dark:text-white">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${openIndex === idx ? "rotate-180" : ""}`} />
              </button>
              <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
