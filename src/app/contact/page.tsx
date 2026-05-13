"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

// 1. Define the Zod Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Simulate API call for the contest
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Support Ticket Submitted:", data);
    alert("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col">
      <Navbar />
      <div className="max-w-xl mx-auto w-full flex-1 py-24 px-4">
        <h1 className="text-4xl font-bold mb-4">Contact Support</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Need help with your wealth manager? Send us a message.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input {...register("name")} className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" placeholder="John Doe" />
            {errors.name && <p className="text-rose-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input {...register("email")} type="email" className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" placeholder="john@example.com" />
            {errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <Textarea {...register("message")} className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 min-h-[120px]" placeholder="How can we help?" />
            {errors.message && <p className="text-rose-500 text-sm mt-1">{errors.message.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500">
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
