import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookingForm } from "./BookingForm";
import { Suspense } from "react";
import Link from "next/link";

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 px-4 max-w-3xl mx-auto w-full">
        <div className="mb-6">
          <Link href="/passes" className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors text-sm font-medium">
            <span>← Back to Passes</span>
          </Link>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gold mb-2 uppercase">Your Details</h1>
          <p className="text-gray-400">Enter your details to proceed with the booking.</p>
        </div>
        
        <Suspense fallback={<div className="text-center text-gold">Loading...</div>}>
          <BookingForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
