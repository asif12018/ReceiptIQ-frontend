import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center text-center px-4">
      <ShieldAlert className="w-20 h-20 text-rose-500 mb-6" />
      <h1 className="text-6xl font-extrabold tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-zinc-400 max-w-md mb-8">
        We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps you took a wrong turn in the vault.
      </p>
      <Link href="/">
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-8">
          Return to Safety
        </Button>
      </Link>
    </div>
  );
}
