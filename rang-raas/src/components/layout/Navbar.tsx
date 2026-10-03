import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#020817]/80 backdrop-blur-md border-b border-[#D9A441]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-12 h-12 rounded-full border-2 border-[#D9A441] flex items-center justify-center bg-[#071426] shadow-[0_0_15px_rgba(217,164,65,0.2)] hover:scale-105 transition-transform">
              <span className="font-playfair text-[#F4C95D] font-bold text-lg tracking-wider">WCC</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className="text-sm font-semibold tracking-wider uppercase text-[#FFF7E6] hover:text-[#D9A441] transition-colors">Home</Link>
            <Link href="/event" className="text-sm font-semibold tracking-wider uppercase text-[#FFF7E6] hover:text-[#D9A441] transition-colors">Event</Link>
            <Link href="/passes" className="text-sm font-semibold tracking-wider uppercase text-[#FFF7E6] hover:text-[#D9A441] transition-colors">Passes</Link>
            <Link href="/faq" className="text-sm font-semibold tracking-wider uppercase text-[#FFF7E6] hover:text-[#D9A441] transition-colors">FAQs</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/passes" className="bg-gradient-to-r from-[#D9A441] to-[#F4C95D] text-[#020817] px-8 py-2.5 rounded-full font-bold text-sm hover:from-[#F4C95D] hover:to-[#FFD978] transition-all shadow-[0_0_15px_rgba(217,164,65,0.3)] uppercase tracking-wider">
              Book Passes
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
