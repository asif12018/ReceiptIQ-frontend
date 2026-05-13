"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Send, Upload, Square, X } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export default function AgenticChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatMutation = useChat();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + " " + transcript : transcript));
      };
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");

    chatMutation.mutate(currentInput, {
      onSuccess: (res) => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "bot", content: res.data.reply },
        ]);
      },
      onError: () => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: "Error communicating with AI. Please try again.",
          },
        ]);
      },
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setIsUploading(true);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `📎 Scanning receipt: ${file.name}…`,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Optimistic UI Update
    const tempReceiptId = `temp-${Date.now()}`;
    const previousReceipts = queryClient.getQueryData(["receipts"]);
    
    queryClient.setQueryData(["receipts"], (old: any) => {
      return [
        {
          id: tempReceiptId,
          merchantName: "Scanning receipt...",
          totalAmount: 0,
          currency: "৳",
          category: "General",
          createdAt: new Date().toISOString(),
          items: [],
          isOptimistic: true
        },
        ...(old || [])
      ];
    });

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/receipts/scan`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Scan failed");
      const json = await res.json();
      const d = json.data;
      const currentCurrency = JSON.parse(localStorage.getItem("receiptiq-settings") || "{}").state?.currency || "৳";

      const reply = `✅ Receipt scanned! **${d.merchantName || "Unknown Merchant"}** — ${currentCurrency}${d.totalAmount?.toLocaleString()} (${d.category || "General"})`;
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "bot", content: reply },
      ]);
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Receipt added successfully!");
    } catch {
      // Revert optimistic update
      if (previousReceipts) {
        queryClient.setQueryData(["receipts"], previousReceipts);
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "❌ Could not scan receipt. Make sure it's a clear image or you are online.",
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  const clearMessages = () => setMessages([]);

  return (
    <>
      {/* Chat Log Overlay */}
      <div className="fixed bottom-24 left-64 right-0 p-6 pointer-events-none z-40 flex flex-col items-end">
        <div className="max-w-4xl w-full flex flex-col gap-3">
          {messages.length > 0 && (
            <div className="self-end pointer-events-auto">
              <button
                onClick={clearMessages}
                className="flex items-center gap-1 text-xs text-zinc-900 dark:text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            </div>
          )}
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 rounded-2xl max-w-[80%] shadow-lg pointer-events-auto text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-zinc-900 dark:text-white self-end rounded-br-sm"
                    : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 self-start rounded-bl-sm"
                }`}
              >
                {msg.content}
              </motion.div>
            ))}
            {(chatMutation.isPending || isUploading) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl max-w-[80%] self-start rounded-bl-sm pointer-events-auto flex gap-2 items-center"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-64 right-0 p-6 bg-gradient-to-t from-white via-white/90 dark:from-zinc-950 dark:via-zinc-950/90 to-transparent pointer-events-none z-50">
        <div id="tour-chat" className="max-w-4xl mx-auto pointer-events-auto">
          <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full shadow-2xl p-2 transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            {/* Receipt upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Scan a receipt image"
              className="p-3 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-100 dark:bg-zinc-800 transition-colors shrink-0 disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask ReceiptIQ or add an expense…"
              className="flex-1 bg-transparent border-none px-4 text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 focus:outline-none min-w-0 text-sm"
              disabled={chatMutation.isPending || isUploading}
            />

            <button
              type="button"
              onClick={toggleRecording}
              className={`p-3 rounded-full transition-colors shrink-0 ${
                isRecording
                  ? "text-red-500 animate-pulse bg-red-500/10"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-100 dark:bg-zinc-800"
              }`}
            >
              {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending || isUploading}
              className="p-3 ml-1 rounded-full bg-indigo-600 text-zinc-900 dark:text-white hover:bg-indigo-500 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-xs text-zinc-600 mt-2">
            Type, speak, or upload a receipt image
          </p>
        </div>
      </div>
    </>
  );
}
