import { getAdminSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, Clock, MapPin, User, Mail, Phone, QrCode } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function EPassPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params;
  const supabase = getAdminSupabase();
  const { data: ticket } = await supabase
    .from("tickets")
    .select("*, booking:bookings(*)")
    .eq("ticket_id", ticketId)
    .single();

  let ticketNumber = 1;
  let totalTickets = 1;

  if (ticket && ticket.booking) {
    totalTickets = ticket.booking.quantity || 1;
    const { data: allTickets } = await supabase
      .from("tickets")
      .select("id")
      .eq("booking_id", ticket.booking_id)
      .order("id");
      
    if (allTickets) {
      const idx = allTickets.findIndex(t => t.id === ticket.id);
      if (idx !== -1) ticketNumber = idx + 1;
    }
  }

  if (!ticket) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-24">
        <div className="max-w-md w-full relative">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-playfair font-bold text-white uppercase tracking-widest mb-1">Entry Pass</h1>
            <p className="text-gold font-bold tracking-widest text-sm">TICKET {ticketNumber} OF {totalTickets}</p>
          </div>

          {/* Ticket Card */}
          <div className="relative bg-[#0a0f19] border border-[#966e28] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(220,179,101,0.15)]">
            
            {/* Top Pattern */}
            <div className="absolute top-0 inset-x-0 h-32 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#0a0f19]/20 to-[#0a0f19]"></div>

            <div className="relative p-8 pb-6 text-center border-b border-[#966e28] border-dashed">
              <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center bg-[#0a0f19] mx-auto mb-4 shadow-[0_0_15px_rgba(220,179,101,0.2)]">
                <span className="font-playfair text-gold font-bold text-xl">WCC</span>
              </div>
              <h2 className="text-3xl font-playfair font-bold text-white uppercase tracking-widest">Rang Raas</h2>
              <p className="text-gold text-xs font-bold tracking-[0.2em] mt-2">PRE-NAVRATRI GARBA NIGHT</p>
              
              <div className="mt-6 inline-block border border-gold bg-gold/10 px-4 py-1.5 rounded-full">
                 <span className="text-gold font-bold text-xs tracking-widest">VALID ENTRY PASS</span>
              </div>
            </div>

            <div className="p-8 relative">
              {/* QR Code Section */}
              <div className="bg-white p-3 rounded-lg flex items-center justify-center w-52 h-52 mx-auto mb-6 relative border-2 border-gold shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                 <QRCodeSVG 
                   value={ticket.qr_token} 
                   size={180}
                   level="H"
                   fgColor="#000000"
                   bgColor="#FFFFFF"
                 />
                 {ticket.status === "CHECKED_IN" && (
                   <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl backdrop-blur-sm">
                      <div className="text-red-600 font-bold text-xl uppercase border-4 border-red-600 p-2 transform -rotate-12">
                        Used
                      </div>
                   </div>
                 )}
              </div>

              <div className="text-center mb-8">
                <p className="text-[#966e28] text-xs font-bold uppercase tracking-widest mb-1">Ticket ID</p>
                <p className="font-mono text-2xl font-bold text-white tracking-widest">{ticket.ticket_id}</p>
              </div>

              {/* Details */}
              <div className="bg-white/5 rounded-xl p-5 space-y-4 border border-[#966e28]/30">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#966e28]/30">
                  <div>
                    <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Customer</span>
                    <span className="text-white font-medium text-sm">{ticket.booking.name}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Booking ID</span>
                    <span className="text-white font-medium text-sm">{ticket.booking.booking_id}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#966e28]/30">
                  <div>
                    <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Pass Type</span>
                    <span className="text-white font-medium text-sm uppercase">{ticket.pass_type} Pass</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Amount</span>
                    <span className="text-white font-medium text-sm">₹{ticket.booking.total_amount}</span>
                  </div>
                </div>
                
                <div>
                   <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Event Information</span>
                   <div className="space-y-2">
                     <div className="flex items-center gap-3 text-sm">
                       <Calendar size={14} className="text-[#966e28]" />
                       <span className="text-gray-200">Saturday, 10 October 2026</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm">
                       <Clock size={14} className="text-[#966e28]" />
                       <span className="text-gray-200">7:00 PM – 10:00 PM</span>
                     </div>
                     <div className="flex items-start gap-3 text-sm mt-1">
                       <MapPin size={14} className="text-[#966e28] shrink-0 mt-0.5" />
                       <span className="text-gray-400 text-xs">
                         Ranbhoomi, Marambal Pada Road, Jatty Road,<br/>
                         near Sai Baba Mandir, Virar West, Maharashtra 401301
                       </span>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Cutouts */}
            <div className="absolute left-[-15px] top-[250px] w-8 h-8 rounded-full bg-gray-950 border-r border-[#966e28]"></div>
            <div className="absolute right-[-15px] top-[250px] w-8 h-8 rounded-full bg-gray-950 border-l border-[#966e28]"></div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gold font-bold text-sm tracking-widest uppercase mb-2">Please show this QR code at the entrance</p>
            <p className="text-xs text-gray-500">Please carry a valid photo ID matching the name on this ticket.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
