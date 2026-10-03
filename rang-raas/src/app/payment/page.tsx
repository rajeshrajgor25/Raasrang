import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAdminSupabase } from "@/lib/supabase";

import { PaymentForm } from "./PaymentForm";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ bookingId?: string }> }) {
  const { bookingId } = await searchParams;
  
  if (!bookingId) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-20 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Invalid Booking ID</h1>
          <Link href="/passes" className="text-gold hover:underline">Go back to Passes</Link>
        </main>
        <Footer />
      </>
    );
  }

  const supabase = getAdminSupabase();
  const { data: booking } = await supabase
    .from("bookings")
    .select("booking_id, total_amount, pass_type, quantity")
    .eq("booking_id", bookingId)
    .single();

  if (!booking) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-20 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Booking not found</h1>
          <p className="text-gray-300">The booking ID {bookingId} does not exist.</p>
        </main>
        <Footer />
      </>
    );
  }

  const ownerUpiId = process.env.OWNER_UPI_ID;
  const isUpiAvailable = !!ownerUpiId;

  let dynamicUpiUrl = "";
  if (isUpiAvailable) {
    dynamicUpiUrl = `upi://pay?pa=${ownerUpiId}&pn=RANG%20RAAS&am=${booking.total_amount}&cu=INR&tn=${booking.booking_id}`;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 px-4 max-w-3xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gold uppercase mb-2">Complete Your Payment</h1>
          <p className="text-gray-400 font-mono">Booking ID: {bookingId}</p>
        </div>
        
        {/* Summary */}
        <div className="glass-card p-6 rounded-xl mb-8 flex justify-between items-center border border-white/10">
          <div>
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Booking ID</h3>
            <p className="font-mono text-xl text-white font-bold">{bookingId}</p>
          </div>
          <div className="text-right">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Amount Payable</h3>
            <p className="font-bold text-2xl text-gold">₹{booking.total_amount}</p>
          </div>
        </div>

        {/* QR Code section */}
        <div className="glass-card p-8 rounded-xl mb-8 text-center flex flex-col items-center border border-white/10">
           {!isUpiAvailable ? (
             <div className="py-12">
               <p className="text-red-400 font-bold mb-2">UPI payment is temporarily unavailable.</p>
               <p className="text-gray-400 text-sm">Please contact the event organizer.</p>
             </div>
           ) : (
             <>
               <h2 className="text-xl font-bold mb-6 uppercase tracking-widest text-white">Scan the QR to pay the exact booking amount.</h2>
               <div className="bg-white p-4 rounded-2xl mb-6 shadow-[0_0_30px_rgba(220,179,101,0.2)]">
                 <QRCodeSVG value={dynamicUpiUrl} size={256} level="H" />
               </div>
               
               <p className="text-gold font-bold mb-2">Amount is automatically filled in your UPI app.</p>
               <p className="text-gray-300 text-sm mb-4">Scan using: Google Pay • PhonePe • Paytm • BHIM</p>
               
               <div className="bg-black/50 border border-white/10 px-4 py-2 rounded-lg inline-block">
                 <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">UPI ID</p>
                 <p className="font-mono text-white font-bold">{ownerUpiId}</p>
               </div>
             </>
           )}
        </div>

        {/* Form section */}
        <PaymentForm bookingId={bookingId} />
      </main>
      <Footer />
    </>
  );
}
