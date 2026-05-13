"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";

// 1. Define the Zod Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Simulate API call for the contest
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.log("Support Ticket Submitted:", data);
    setIsSubmitted(true);
    toast.success("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col">
      <Navbar />
      <div className="max-w-xl mx-auto w-full flex-1 py-24 px-4">
        <h1 className="text-4xl font-bold mb-4">Contact Support</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Need help with your wealth manager? Send us a message.</p>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="contact-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-6 bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input {...register("name")} className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12" placeholder="John Doe" />
                  {errors.name && <p className="text-rose-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input {...register("email")} type="email" className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12" placeholder="john@example.com" />
                  {errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea {...register("message")} className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 min-h-[150px]" placeholder="How can we help?" />
                  {errors.message && <p className="text-rose-500 text-sm mt-1">{errors.message.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-emerald-500/20"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-5 h-5 mr-2" /> Send Message</>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.div 
                key="contact-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center p-12 bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-3xl"
              >
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Message Sent!</h2>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-sm mb-8">
                  Thanks for reaching out. Our support team will get back to you within 24 hours.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitted(false)}
                  className="rounded-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400"
                >
                  Send another message
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}
