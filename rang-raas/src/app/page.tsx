import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Calendar, Clock, MapPin, Music, Sparkles, Utensils, Users } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-28 pb-20 bg-[#020817]">
          {/* Garba Festive Background Image */}
          <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center opacity-40 mix-blend-screen"></div>
          {/* Premium Dark Navy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/80 via-[#071426]/70 to-[#0A1830]"></div>
          
          <div className="relative z-10 space-y-4 max-w-5xl mx-auto w-full">
            <h3 className="text-[#FFF7E6] tracking-[0.4em] text-xs md:text-sm uppercase font-bold flex flex-col items-center justify-center gap-2 mb-6">
              <span>WEEKEND CULTURE CLUB</span>
              <span className="text-[#D9A441] text-[10px] tracking-[0.5em]">PRESENTS</span>
            </h3>
            
            <h1 className="font-playfair text-6xl md:text-8xl lg:text-[140px] leading-none font-bold text-[#F4C95D] italic tracking-wider drop-shadow-[0_0_30px_rgba(217,164,65,0.3)] mb-4">
              RANG RAAS
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-10">
              <span className="w-12 md:w-24 h-[1px] bg-[#D9A441]/50"></span>
              <h2 className="text-lg md:text-2xl lg:text-3xl font-playfair font-semibold tracking-widest text-[#FFF7E6] uppercase">
                Pre-Navratri Garba Night
              </h2>
              <span className="w-12 md:w-24 h-[1px] bg-[#D9A441]/50"></span>
            </div>
            
            <div className="bg-[#020817]/40 backdrop-blur-md border border-[#D9A441]/30 rounded-xl p-6 md:p-8 inline-flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm md:text-base mb-12 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3">
                <Calendar className="text-[#D9A441]" size={24} />
                <div className="text-left">
                  <p className="text-[#D9A441] text-xs font-bold uppercase tracking-wider mb-0.5">Saturday</p>
                  <p className="text-[#FFF7E6] font-medium">10 October 2026</p>
                </div>
              </div>
              
              <div className="hidden md:block w-px h-10 bg-[#D9A441]/30"></div>
              
              <div className="flex items-center gap-3">
                <Clock className="text-[#D9A441]" size={24} />
                <div className="text-left">
                  <p className="text-[#D9A441] text-xs font-bold uppercase tracking-wider mb-0.5">Time</p>
                  <p className="text-[#FFF7E6] font-medium">7:00 PM – 10:00 PM</p>
                </div>
              </div>
              
              <div className="hidden md:block w-px h-10 bg-[#D9A441]/30"></div>
              
              <div className="flex items-center gap-3">
                <MapPin className="text-[#D9A441]" size={24} />
                <div className="text-left">
                  <p className="text-[#D9A441] text-xs font-bold uppercase tracking-wider mb-0.5">Ranbhoomi</p>
                  <p className="text-[#FFF7E6] font-medium text-xs">Virar West</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
              <Link href="/passes" className="bg-gradient-to-r from-[#D9A441] to-[#F4C95D] text-[#020817] px-12 py-4 rounded-full font-bold text-lg hover:from-[#F4C95D] hover:to-[#FFD978] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(217,164,65,0.4)]">
                BUY PASSES &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 border-y border-[#D9A441]/20 bg-[#0A1830] relative overflow-hidden">
          {/* Subtle Garba Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D9A441]/5 to-transparent opacity-50"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
              {[
                { icon: Music, label: "Live DJ" },
                { icon: Sparkles, label: "Garba" },
                { icon: Sparkles, label: "Dandiya Vibes" },
                { icon: Utensils, label: "Snacks & Water" },
                { icon: Users, label: "Ice-Breaker Games" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4 group">
                  <div className="w-20 h-20 rounded-full border border-[#D9A441]/40 flex items-center justify-center bg-[#071426] group-hover:bg-[#D9A441]/10 group-hover:border-[#D9A441] transition-all shadow-[0_0_15px_rgba(217,164,65,0.1)]">
                    <item.icon className="text-[#F4C95D]" size={32} />
                  </div>
                  <span className="font-bold text-xs md:text-sm text-[#FFF7E6] uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-[#0A1830] to-[#020817] relative">
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <h2 className="text-4xl font-playfair font-bold text-[#F4C95D] uppercase tracking-widest">About The Event</h2>
            <div className="w-24 h-1 bg-[#D97706] mx-auto rounded-full"></div>
            <p className="text-lg md:text-xl text-[#FFF7E6] leading-relaxed font-light">
              Get ready for an unforgettable evening of music, dance, and festive vibes at Rang Raas - a spectacular pre-Navratri Garba Night organized by Weekend Culture Club. Experience the vibrant culture, dress up in your best traditional attire, and dance to the energetic beats of our Live DJ!
            </p>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-28 text-center px-4 relative overflow-hidden bg-[#020817]">
          <div className="absolute inset-0 bg-[#D9A441]/10 blur-[100px] rounded-full translate-y-1/2 scale-150 pointer-events-none"></div>
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white tracking-wide">READY FOR RANG RAAS?</h2>
            <Link href="/passes" className="inline-block bg-gradient-to-r from-[#D9A441] to-[#F4C95D] text-[#020817] px-12 py-5 rounded-full font-bold text-xl hover:from-[#F4C95D] hover:to-[#FFD978] transition-all shadow-[0_0_30px_rgba(217,164,65,0.5)] transform hover:-translate-y-1">
              BOOK YOUR PASS &rarr;
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
