import { getAdminSupabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
  const supabase = getAdminSupabase();
  const { data: ticketsData } = await supabase
    .from("tickets")
    .select("*, booking:bookings(*)")
    .order("issued_at", { ascending: false });
    
  const tickets = ticketsData || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">Tickets</h1>
        <p className="text-gray-400">View and manage all issued E-Passes.</p>
      </div>

      <div className="bg-black border border-white/10 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm font-medium text-gray-400">Ticket ID</th>
                <th className="p-4 text-sm font-medium text-gray-400">Booking ID</th>
                <th className="p-4 text-sm font-medium text-gray-400">Customer</th>
                <th className="p-4 text-sm font-medium text-gray-400">Pass Type</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No tickets issued yet.</td>
                </tr>
              ) : tickets.map(ticket => (
                <tr key={ticket.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-sm font-bold text-gold">{ticket.ticket_id}</td>
                  <td className="p-4 font-mono text-sm text-gray-400">{ticket.booking?.booking_id}</td>
                  <td className="p-4 text-sm font-medium text-white">{ticket.booking?.name}</td>
                  <td className="p-4 text-sm text-white capitalize">{ticket.pass_type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      ticket.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                      ticket.status === 'CHECKED_IN' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {ticket.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <a 
                      href={ticket.pdf_url || "#"} 
                      target="_blank"
                      className="px-3 py-1 bg-gold/20 text-gold rounded hover:bg-gold/30 border border-gold/30 text-sm font-medium transition-colors inline-block"
                    >
                      E-Pass
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
