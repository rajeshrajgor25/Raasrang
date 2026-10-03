"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Check, Minus, Plus } from "lucide-react";

export default function Passes() {
  const [earlyBirdQty, setEarlyBirdQty] = useState(1);
  const [regularQty, setRegularQty] = useState(1);

  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gold mb-4 uppercase">Get Your Passes</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose your pass and be a part of the most exciting pre-navratri celebration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Early Bird */}
          <div className="glass-card rounded-2xl p-8 relative flex flex-col hover:border-gold transition-colors">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gold text-black px-4 py-1 text-xs font-bold rounded-full uppercase tracking-wider">
              Limited Passes
            </div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold uppercase mb-2">Early Bird</h2>
              <div className="text-5xl font-bold text-gold mb-2">₹249 <span className="text-sm text-gray-400 font-normal">/ person</span></div>
            </div>
            
            <div className="flex items-center justify-center gap-6 mb-6">
              <button 
                onClick={() => setEarlyBirdQty(q => Math.max(1, q - 1))} 
                disabled={earlyBirdQty <= 1}
                className="w-10 h-10 rounded-full border border-gold text-gold flex items-center justify-center disabled:opacity-30 hover:bg-gold/10 transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="text-2xl font-bold text-white w-8 text-center">{earlyBirdQty}</span>
              <button 
                onClick={() => setEarlyBirdQty(q => Math.min(10, q + 1))}
                disabled={earlyBirdQty >= 10}
                className="w-10 h-10 rounded-full border border-gold text-gold flex items-center justify-center disabled:opacity-30 hover:bg-gold/10 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {["Entry to Event", "Live DJ", "Garba & Dandiya", "Snacks & Water Included", "Ice-Breaker Games"].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="text-gold" size={20} />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Link href={`/booking?type=early-bird&quantity=${earlyBirdQty}`} className="block w-full text-center bg-gold/10 border border-gold text-gold py-3 rounded-md font-bold hover:bg-gold hover:text-black transition-colors">
              SELECT PASS
            </Link>
          </div>

          {/* Regular */}
          <div className="glass-card rounded-2xl p-8 relative flex flex-col hover:border-gold transition-colors">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
              Popular
            </div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold uppercase mb-2">Regular</h2>
              <div className="text-5xl font-bold text-gold mb-2">₹299 <span className="text-sm text-gray-400 font-normal">/ person</span></div>
            </div>

            <div className="flex items-center justify-center gap-6 mb-6">
              <button 
                onClick={() => setRegularQty(q => Math.max(1, q - 1))} 
                disabled={regularQty <= 1}
                className="w-10 h-10 rounded-full border border-gold text-gold flex items-center justify-center disabled:opacity-30 hover:bg-gold/10 transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="text-2xl font-bold text-white w-8 text-center">{regularQty}</span>
              <button 
                onClick={() => setRegularQty(q => Math.min(10, q + 1))}
                disabled={regularQty >= 10}
                className="w-10 h-10 rounded-full border border-gold text-gold flex items-center justify-center disabled:opacity-30 hover:bg-gold/10 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {["Entry to Event", "Live DJ", "Garba & Dandiya", "Snacks & Water Included", "Ice-Breaker Games"].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="text-gold" size={20} />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Link href={`/booking?type=regular&quantity=${regularQty}`} className="block w-full text-center bg-gold/10 border border-gold text-gold py-3 rounded-md font-bold hover:bg-gold hover:text-black transition-colors">
              SELECT PASS
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
