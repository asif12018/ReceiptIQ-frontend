import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/shared/Footer";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center font-bold text-white">R</div>
              <span className="text-xl font-bold tracking-tight text-white">ReceiptIQ</span>
            </Link>
          </div>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Home</Link>
            <Link href="/explore" className="text-sm font-medium text-emerald-400">Explore Templates</Link>
            <Link href="/about" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">About Us</Link>
          </div>
          <div>
            <Link href="/login">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-6">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Explore Templates</h1>
            <p className="text-zinc-400 mt-2">Discover popular saving challenges and financial plans.</p>
          </div>
        </div>
        
        {/* Mock Grid for Templates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-colors">
              <div className="h-40 bg-zinc-800 flex items-center justify-center text-zinc-600 font-medium">
                Cover Image {item}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">Template {item}</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-zinc-800 text-zinc-300">Easy</span>
                </div>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                  A complete template to help you save money consistently.
                </p>
                <Link href={`/explore/${item}`}>
                  <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 hover:text-white">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
