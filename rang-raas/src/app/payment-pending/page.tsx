import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAdminSupabase } from "@/lib/supabase";

import Link from "next/link";

export default async function PaymentPendingPage({ searchParams }: { searchParams: Promise<{ bookingId?: string }> }) {
  const { bookingId } = await searchParams;
  const supabase = getAdminSupabase();
  const { data: booking } = await supabase
    .from("bookings")
    .select("booking_id, total_amount, pass_type, quantity")
    .eq("booking_id", bookingId)
    .maybeSingle();

  return (
    <>
      <Navbar />
      <main className="flex-1 py-20 px-4 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="text-6xl mb-6 animate-pulse">🟡</div>
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gold mb-6 uppercase">Payment Verification Pending</h1>
        <p className="text-gray-300 max-w-xl mb-10 text-lg leading-relaxed">
          Your payment details have been submitted successfully. Our team will verify your payment. Once verified, your E-Pass will be generated and sent to your email.
        </p>
        
        {booking && (
          <div className="glass-card p-8 rounded-xl text-left inline-block min-w-[320px] border border-white/10">
             <div className="mb-6 pb-6 border-b border-white/10">
               <p className="text-gray-400 text-sm mb-1">Booking ID</p>
               <p className="font-bold text-xl font-mono text-white">{booking.booking_id}</p>
             </div>
             
             <div className="grid grid-cols-2 gap-8 mb-6">
               <div>
                 <p className="text-gray-400 text-sm mb-1">Pass</p>
                 <p className="font-semibold text-lg text-white">{booking.pass_type === "regular" ? "Regular" : "Early Bird"}</p>
               </div>
               <div>
                 <p className="text-gray-400 text-sm mb-1">Quantity</p>
                 <p className="font-semibold text-lg text-white">{booking.quantity}</p>
               </div>
             </div>
             
             <div className="bg-black/30 p-4 rounded-lg flex justify-between items-center">
               <p className="text-gray-400 text-sm">Amount Paid</p>
               <p className="font-bold text-2xl text-gold">₹{booking.total_amount}</p>
             </div>
          </div>
        )}

        <div className="mt-12">
          <Link href="/" className="text-gold hover:underline font-medium">Return to Home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
