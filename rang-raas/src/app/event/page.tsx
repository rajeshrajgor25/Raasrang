import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Calendar, Clock, MapPin, Music, Sparkles, Utensils, Users, Info } from "lucide-react";

export default function EventPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 border-b border-[#D9A441]/20 bg-[#020817]">
          {/* Garba Festive Background Image */}
          <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center opacity-30 mix-blend-screen"></div>
          {/* Premium Dark Navy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#071426]/80 to-[#0A1830]/70"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <h3 className="text-[#FFF7E6] tracking-[0.4em] text-sm uppercase font-bold">Event Details</h3>
            <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-[#F4C95D] italic tracking-wider drop-shadow-[0_0_20px_rgba(217,164,65,0.4)]">
              RANG RAAS
            </h1>
            <p className="text-xl md:text-2xl font-semibold tracking-widest uppercase text-[#D9A441]">
              Pre-Navratri Garba Night
            </p>
          </div>
        </section>

        {/* Info Grid */}
        <section className="py-16 px-4 bg-gradient-to-b from-[#020817] to-[#0A1830]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-xl border border-[#D9A441]/30 flex flex-col items-center text-center space-y-4 hover:border-[#D9A441]/60 hover:bg-[#D9A441]/5 transition-colors shadow-[0_0_15px_rgba(217,164,65,0.05)]">
              <div className="w-16 h-16 rounded-full bg-[#071426] border border-[#D9A441]/40 flex items-center justify-center">
                <Calendar className="text-[#F4C95D]" size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#FFF7E6] mb-1 uppercase tracking-widest">Date</h3>
                <p className="text-gray-400">Saturday</p>
                <p className="text-[#D9A441] font-medium">10 October 2026</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-xl border border-[#D9A441]/30 flex flex-col items-center text-center space-y-4 hover:border-[#D9A441]/60 hover:bg-[#D9A441]/5 transition-colors shadow-[0_0_15px_rgba(217,164,65,0.05)]">
              <div className="w-16 h-16 rounded-full bg-[#071426] border border-[#D9A441]/40 flex items-center justify-center">
                <Clock className="text-[#F4C95D]" size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#FFF7E6] mb-1 uppercase tracking-widest">Time</h3>
                <p className="text-gray-400">Gates Open: 6:30 PM</p>
                <p className="text-[#D9A441] font-medium">7:00 PM – 10:00 PM</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-xl border border-[#D9A441]/30 flex flex-col items-center text-center space-y-4 hover:border-[#D9A441]/60 hover:bg-[#D9A441]/5 transition-colors shadow-[0_0_15px_rgba(217,164,65,0.05)]">
              <div className="w-16 h-16 rounded-full bg-[#071426] border border-[#D9A441]/40 flex items-center justify-center">
                <MapPin className="text-[#F4C95D]" size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#FFF7E6] mb-1 uppercase tracking-widest">Venue</h3>
                <p className="text-gray-400">Ranbhoomi</p>
                <p className="text-[#D9A441] font-medium">Virar West</p>
              </div>
            </div>
          </div>
        </section>

        {/* Event Features */}
        <section className="py-16 px-4 bg-black/40">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-playfair font-bold text-gold uppercase mb-4">What to Expect</h2>
              <div className="w-24 h-1 bg-gold/50 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Music, title: "Live DJ", desc: "Non-stop Garba beats to keep you grooving." },
                { icon: Sparkles, title: "Garba & Dandiya", desc: "Authentic pre-Navratri festive vibes." },
                { icon: Utensils, title: "Snacks & Refreshments", desc: "Water and delicious snacks included." },
                { icon: Users, title: "Ice-Breaker Games", desc: "Engaging activities and lots of fun!" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3 p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                  <item.icon className="text-gold mb-2" size={28} />
                  <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guidelines */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto glass-card border border-gold/20 p-8 md:p-12 rounded-2xl">
            <div className="flex items-center gap-3 mb-8">
              <Info className="text-gold" size={28} />
              <h2 className="text-2xl font-playfair font-bold text-gold uppercase">Event Guidelines</h2>
            </div>
            
            <ul className="space-y-4 text-gray-300">
              <li className="flex gap-3">
                <span className="text-gold mt-1">•</span>
                <span><strong>Dress Code:</strong> Traditional Indian wear (Kurta, Chaniya Choli, etc.) is highly recommended to keep the festive spirit alive.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold mt-1">•</span>
                <span><strong>Entry:</strong> Please carry a valid digital or printed pass along with a photo ID.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold mt-1">•</span>
                <span><strong>Dandiya Sticks:</strong> Basic dandiya sticks will be available, but you are welcome to bring your own!</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold mt-1">•</span>
                <span><strong>Conduct:</strong> Maintain decorum and respect all attendees. Any inappropriate behavior will result in immediate removal.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 text-center px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full scale-150"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6 text-white">Join the Celebration!</h2>
            <p className="text-gray-400 mb-8 text-lg">Passes are selling out fast. Secure your spot for the most awaited Garba night in town.</p>
            <Link href="/passes" className="inline-block bg-gold text-black px-12 py-4 rounded-md font-bold text-lg hover:bg-gold-light transition-all shadow-[0_0_20px_rgba(220,179,101,0.3)]">
              GET YOUR PASS NOW
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
